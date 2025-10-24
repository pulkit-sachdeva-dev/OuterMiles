
// window.localStorage.clear();

// function getAllUsers() {
//   return JSON.parse(localStorage.getItem("users")) || [];
// }
// function saveAllUsers(users) {
//   localStorage.setItem("users", JSON.stringify(users));
// }
// function getLoggedInUser() {
//   return JSON.parse(localStorage.getItem("loggedInUser"));
// }
// function saveLoggedInUser(user) {
//   localStorage.setItem("loggedInUser", JSON.stringify(user));
// }
// function getAllTrips() {
//   return JSON.parse(localStorage.getItem("trips")) || [];
// }
// function saveAllTrips(trips) {
//   localStorage.setItem("trips", JSON.stringify(trips));
// }


//selecting date for trip
let startDate = document.getElementById('start-date');
let endDate = document.getElementById('end-date');

startDate.addEventListener('change', () => {
    const startDateValue = startDate.value;
    endDate.min = startDateValue;
});

// you and discover button functionality
let you = document.getElementById('you');
let discover = document.getElementById('discover');
let container = document.getElementById('om-container');
let container2 = document.getElementById('container2');

you.addEventListener('click', () => {
    you.style.color='#13c892';
    you.style.borderBottom='2px solid #13c892';
    container.style.display='flex';
    discover.style.color='#6b7280';
    discover.style.border='none';
    container2.style.display='none';
});
discover.addEventListener('click',() => {
    discover.style.color='#13c892';
    discover.style.borderBottom='2px solid #13c892';
    container.style.display='none';
    you.style.color='#6b7280';
    you.style.border='none';
    container2.style.display='block'; 
});
let errorPopup = document.getElementById('error-msg');
let errorMsg = document.getElementById('err-msg');

// trip details storing and start planning button.
let startPlanningButton = document.getElementById('start-planning');
let tripsContainer = document.getElementById('trips-container');
let noTripContent = document.getElementById('no-trip');
let tripNameInput = document.getElementById('trip-name');
let tripCountrySelect = document.getElementById('trip-country');

let i=1000; //initialising the value of trip id.

startPlanningButton.addEventListener('click',() => {
    const tripName = tripNameInput.value;
    const country = tripCountrySelect.value;
    const startdate = startDate.value;
    const enddate = endDate.value;

    if(enddate < startdate){
        errorPopup.style.display='block';
        errorMsg.innerHTML="!! End Date should not be less than Start Date !!";
        return;
    }

    if(!tripName || !country || !startdate || !enddate){
        errorPopup.style.display='block';
        errorMsg.innerHTML="!! Please Fill All Fields !!";
         //alerts if any value in the form is left empty.
        return;
    }
    let countryImages = {
        India: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        Uae:   "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        France: "https://images.unsplash.com/photo-1418854982207-12f710b74003?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        Japan: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }; // stores the image src for each country respectively.

    i++; //increment of id value after each trip is added.

    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const trip = {
        id:Date.now(),
        name: tripName,
        country:country,
        startdate,
        enddate,
        image:countryImages[country],
        ownerId:loggedInUser.id,
        inviteCode: Math.random().toString(36).substr(2,6)

    } // store the details of the trip being added

    let trips = JSON.parse(localStorage.getItem("trips"))||[];
    trips.push(trip);
    localStorage.setItem("trips",JSON.stringify(trips));


    let allUsers = JSON.parse(localStorage.getItem('users'));
    let currentUser = allUsers.find(u => u.id ===loggedInUser.id);
    currentUser.trips.push(trip.id);

    localStorage.setItem('users',JSON.stringify(allUsers));
    localStorage.setItem('loggedInUser',JSON.stringify(currentUser));

    renderTrips(); // refreshs trips on the dashboard as soon as a new trip is added
    document.getElementById('trip1').style.display='none'; //hides the add trip popup after succesfully adding the trip.
});

//render trips function
renderTrips = () => {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let trips = JSON.parse(localStorage.getItem('trips'))||[];
    let userTrips = trips.filter(t => loggedInUser.trips.includes(t.id));


    tripsContainer.innerHTML = "";

    if(userTrips.length === 0){
        tripsContainer.appendChild(noTripContent);
        noTripContent.style.display = "block";
        return;
    }

    userTrips.forEach(trip => {
        let card=document.createElement("div");
        card.classList.add('trip-card');
        card.innerHTML=`
        <div class="card" style="width: 38rem; margin:10px; cursor:pointer;">
            <img src="${trip.image}" class="card-img-top" alt="trip image">
            <div class="card-body">
                <h5 class="card-title">${trip.name}</h5>
                <p class="card-text">${trip.country}<br>${trip.startdate} → ${trip.enddate}</p>
            </div>
        </div>
        `;

        card.addEventListener('click',() => showTripDetails(trip));
        tripsContainer.appendChild(card);
    });
}

//shows trip popup
showTripDetails = (trip) => {
    const content = document.getElementById("trip-details-content");
    content.innerHTML = `
    <h3>${trip.name}</h3>
    <img src="${trip.image}" style="width:100%; border-radius:8px; margin:10px 0; position:relative; ">
    <p><strong>Dates:</strong> ${trip.startdate} → ${trip.enddate}</p>
    <p><strong>Invite Code:</strong> ${trip.inviteCode}</p>
    <div class="d-flex justify-content-between mt-3">
        <button class="btn btn-outline-danger"id="delete-btn" onclick="deleteTrip(${trip.id})">Delete Trip</button>
        <button class="btn btn-secondary" onclick="document.getElementById('trip-details-popup').style.display='none'">Close</button>
    </div>
    `;
    document.getElementById("trip-details-popup").style.display = 'block';
}

//trip delete button functionality
deleteTrip = (tripId) => {
    let trips = JSON.parse(localStorage.getItem('trips')) || [];
    
    trips = trips.filter(t => t.id !== tripId);
    localStorage.setItem("trips", JSON.stringify(trips));
    
    let users = JSON.parse(localStorage.getItem('users'));
    users.forEach((u) => {
        u.trips = u.trips.filter((id) => id !==tripId);
    })
    localStorage.setItem('users',JSON.stringify(users));

    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    loggedInUser.trips = loggedInUser.trips.filter((id) => id!== tripId);
    localStorage.setItem('loggedInUser',JSON.stringify(loggedInUser));


    document.getElementById('trip-details-popup').style.display="none";
    renderTrips();
}

// loads trip 
// renderTrips();


renderFriends = () => {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let users = JSON.parse(localStorage.getItem('users'));
    let friendList = document.getElementById('friends-list');
    if(!friendList)return;

    friendList.innerHTML="";
    if(!loggedInUser.friends || loggedInUser.friends.length===0){
        friendList.innerHTML="<p>No friends yet!</p>";
        return;
    }
    loggedInUser.friends.forEach((fid)=> {
        let friend = users.find(u => u.id ===fid);
        if(friend){
            let div = document.createElement('div');
            div.classList.add('friend-card');
            div.innerHTML=`
            <span>${friend.name} (@${friend.username})</span>
            `;
            friendList.appendChild(div);
        } 
    })

}

let joinTripBtn = document.getElementById('join-trip-btn');
joinTripBtn.addEventListener('click',() => {    
    let code = document.getElementById('trip-code').value;
    joinTripByCode(code);
    document.getElementById('join-popup').style.display='none';
});

joinTripByCode = (code) => {
    let trips = JSON.parse(localStorage.getItem('trips'));
    let tripToJoin = trips.find((t)=> t.inviteCode === code);
    if(!tripToJoin){
        errorPopup.style.display='block';
        errorMsg.innerHTML="!! Invalid Trip Code !!";
        // alert("!! Invalid Code !!");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users'));
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let currentUser = users.find(i => i.id === loggedInUser.id);

    if(currentUser.trips.includes(tripToJoin.id)){
        errorPopup.style.display='block';
        errorMsg.innerHTML="!! You already joined the trip !!";
        // alert("You already joined the trip");
        return;
    }
    currentUser.trips.push(tripToJoin.id);

    if(!currentUser.friends.includes(tripToJoin.ownerId)){
        currentUser.friends.push(tripToJoin.ownerId);
    }
    let owner = users.find(u => u.id === tripToJoin.ownerId);
    if(owner && !owner.friends.includes(currentUser.id)){
        owner.friends.push(currentUser.id);
    }
    localStorage.setItem('users',JSON.stringify(users));
    localStorage.setItem('loggedInUser',JSON.stringify(currentUser));
    errorPopup.style.display='block';
    errorMsg.innerHTML="!! Trip joined Successfully !!";
    // alert("trip joined successfully");

    renderTrips();
    renderFriends();
}

window.addEventListener('DOMContentLoaded',() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if(loggedInUser){
        document.getElementById('profile-name').innerText = loggedInUser.name;
        document.getElementById('profile-username').innerText = "@" + loggedInUser.username;
        document.getElementById('profile-photo').src = loggedInUser.photo || "istockphoto-1300845620-612x612.jpg";
    }
    else{
        errorPopup.style.display='block';
        errorMsg.innerHTML="!! Please Login First !!";
        // alert("!! Please log in first !!");
        window.location.href = "login.html";
    }
    renderTrips();
    renderFriends();
});

document.getElementById('logout-btn').addEventListener('click',() => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
});


 
//  window.localStorage.clear();
 
 document.addEventListener('DOMContentLoaded', () => {
            const toggleLink = document.getElementById("toggle-link");
            const loginFields = document.getElementById("login-fields");
            const signupFields = document.getElementById("signup-fields");
            const formTitle = document.getElementById("form-title");
            const authForm = document.getElementById("auth-form");
            const messageContainer = document.getElementById("message-container");
            const submitBtn = document.getElementById("submit-btn");

            let isLogin = true;
            // Initialize users from localStorage
            let users = JSON.parse(localStorage.getItem('users')) || [];
            console.log('Initial users from localStorage:', users);

            function showMessage(text, type = 'success') {
                messageContainer.textContent = text;
                messageContainer.className = `message ${type}`;
                messageContainer.style.display = "block";
                setTimeout(() => { messageContainer.style.display = "none"; }, 3000);
            }

            function clearErrors() {
                document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
                document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
            }

            function showError(element, message) {
                element.textContent = message;
                element.previousElementSibling.classList.add('error');
            }

            function isValidEmail(email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
            }

            function clearInputs() {
                authForm.querySelectorAll('input').forEach(i => i.value = '');
            }

            function redirectToDashboard(name) {
                console.log('Redirecting to dashboard with name:', name);
                sessionStorage.setItem('userName', name);
                // localStorage.setItem("loggedInUser", JSON.stringify(user));
                window.location.href = 'dashboard.html';
            }

            toggleLink.addEventListener('click', (e) => {
                e.preventDefault();
                isLogin = !isLogin;
                clearErrors();
                messageContainer.style.display = 'none';
                
                if (isLogin) {
                    loginFields.classList.remove('hidden');
                    signupFields.classList.add('hidden');
                    formTitle.textContent = 'Login to OuterMiles';
                    submitBtn.textContent = 'Login';
                    toggleLink.textContent = 'Create new account';
                } else {
                    loginFields.classList.add('hidden');
                    signupFields.classList.remove('hidden');
                    formTitle.textContent = 'Create an Account';
                    submitBtn.textContent = 'Create Account';
                    toggleLink.textContent = 'Already have an account? Login';
                }
                clearInputs();
            });

            authForm.addEventListener('submit', (ev) => {
                ev.preventDefault();
                clearErrors();
                messageContainer.style.display = 'none';
                
                if (isLogin) {
                    const email = document.getElementById('login-email').value.trim().toLowerCase();
                    const password = document.getElementById('login-password').value.trim();
                    console.log('Login attempt with email:', email, 'and password:', password);
                    let hasErrors = false;

                    if (!isValidEmail(email)) {
                        showError(document.getElementById('login-email-error'), 'Please enter a valid email address');
                        hasErrors = true;
                    }
                    if (!password) {
                        showError(document.getElementById('login-password-error'), 'Please enter your password');
                        hasErrors = true;
                    }
                    if (hasErrors) return;

                    const user = users.find(u => u.email === email && u.password === password);
                     localStorage.setItem("loggedInUser", JSON.stringify(user));
                    console.log('Found user:', user);
                    if (!user) {
                        showError(document.getElementById('login-email-error'), 'Invalid email or password');
                        document.getElementById('login-password').value = '';
                        return;
                    }

                    showMessage(`🎉 Welcome back, ${user.name}!`, 'success');
                    setTimeout(() => redirectToDashboard(user.name), 700);
                } else {
                    const name = document.getElementById('signup-name').value.trim();
                    const username = document.getElementById('signup-username').value.trim();
                    const email = document.getElementById('signup-email').value.trim().toLowerCase();
                    const password = document.getElementById('signup-password').value.trim();
                    const confirmPassword = document.getElementById('signup-confirm-password').value.trim();
                    console.log('Signup attempt with name:', name, 'email:', email, 'password:', password);
                    let hasErrors = false;

                    if (!name || name.length < 2) {
                        showError(document.getElementById('signup-name-error'), 'Name must be at least 2 characters long');
                        hasErrors = true;
                    }
                    if (!username || name.length < 2) {
                        showError(document.getElementById('signup-username-error'), 'Username is required');
                        hasErrors = true;
                    }
                    if (!email) {
                        showError(document.getElementById('signup-email-error'), 'Email is required');
                        hasErrors = true;
                    } else if (!isValidEmail(email)) {
                        showError(document.getElementById('signup-email-error'), 'Please enter a valid email address');
                        hasErrors = true;
                    } else if (users.some(u => u.email === email)) {
                        showError(document.getElementById('signup-email-error'), 'An account with this email already exists');
                        hasErrors = true;
                    }
                    if (!password) {
                        showError(document.getElementById('signup-password-error'), 'Password is required');
                        hasErrors = true;
                    } else if (password.length < 6) {
                        showError(document.getElementById('signup-password-error'), 'Password must be at least 6 characters long');
                        hasErrors = true;
                    }
                    if (!confirmPassword) {
                        showError(document.getElementById('signup-confirm-password-error'), 'Please confirm your password');
                        hasErrors = true;
                    } else if (password !== confirmPassword) {
                        showError(document.getElementById('signup-confirm-password-error'), 'Passwords do not match');
                        hasErrors = true;
                    }
                    if (hasErrors) return;

                    // const newUser = { name, email, password };
                    // users.push(newUser);
                    // console.log('Saving new user to localStorage:', newUser);
                    // localStorage.setItem('users', JSON.stringify(users));

                    const user = { id:Date.now(), name, username, email, password, trips:[], friends:[] };
                    users.push(user);
                    localStorage.setItem("users", JSON.stringify(users));
                    localStorage.setItem("loggedInUser", JSON.stringify(user));


                    // console.log('Updated users in localStorage:', JSON.parse(localStorage.getItem('users')));

                    showMessage(`🎉 Account created successfully! Welcome to OuterMiles, ${name}!`, 'success');
                    setTimeout(() => redirectToDashboard(name), 800);
                }
            });
        });
   
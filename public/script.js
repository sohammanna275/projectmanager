// --- Configuration ---
const API_BASE_URL = "/api/v1/auth"; // Base path for all auth routes

// --- Utility Functions ---

/** Displays a message on the current page */
function displayMessage(type, text) {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
}

/** Handles general form submissions to the API */
async function submitForm(endpoint, data, redirectUrl, isResetPassword = false) {
    displayMessage('message', 'Processing...');

    let url = `${API_BASE_URL}/${endpoint}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Note: Auth endpoints rely on cookies, so no manual Authorization header is needed here.
            },
            // Note: credentials: 'include' is often implicitly handled by modern browsers for same-origin
            // but for cross-origin or explicit handling, you would add it here.
            body: JSON.stringify(data),
        });

        // 🎯 Parse the JSON response ONLY ONCE
        const result = await response.json(); 

        if (response.ok) {
            // Success Path
            displayMessage('success', result.message || 'Success!');
            if (redirectUrl) {
                // Wait briefly for user to see success message before redirect
                setTimeout(() => {
                    // 🎯 FIX: Use absolute path for robust redirection from the server root
                    window.location.href = `/${redirectUrl}`; 
                }, isResetPassword ? 3000 : 1000); 
            }
        } else {
            // Error Path
            console.error("API Error Details:", result);
            let errorMessage = result.message || 'An error occurred.';
            
            // Check for specific 422 validation errors (requires error.middleware.js fix)
            if (result.statusCode === 422 && Array.isArray(result.errors) && result.errors.length > 0) {
                const specificError = result.errors[0];
                const key = Object.keys(specificError)[0]; 
                const msg = specificError[key];             
                errorMessage = `Validation Failed for ${key.toUpperCase()}: ${msg}`;
            }

            displayMessage('error', errorMessage);
        }

    } catch (error) {
        console.error("Fetch Error:", error);
        displayMessage('error', 'Network error or server is down.');
    }
}

/** Extracts a query parameter from the URL */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// --- Dashboard / Auth Check Functions ---

/** Fetches current user and displays welcome message (or redirects if unauthorized) */
async function fetchCurrentUser() {
    try {
        // The browser automatically includes the HTTP-only accessToken cookie
        const response = await fetch(`${API_BASE_URL}/current-user`, {
            method: 'POST',
        });
        
        const result = await response.json();

        if (response.ok) {
            const user = result.data;
            // NOTE: You need an element with id="welcomeUser" in dashboard.html
            const welcomeEl = document.getElementById('welcomeUser');
            if (welcomeEl) {
                welcomeEl.textContent = `Hello, ${user.username}!`;
            }
        } else {
            // If the token is invalid or missing, redirect to login
            window.location.href = '/index.html';
        }

    } catch (error) {
        console.error("Current User Fetch Error:", error);
        window.location.href = '/index.html';
    }
}

/** Handles user logout */
async function handleLogout() {
    try {
        const response = await fetch(`${API_BASE_URL}/logout`, {
            method: 'POST',
        });
        
        if (response.ok) {
            // Successfully logged out and cookies cleared on backend
            window.location.href = '/index.html';
        } else {
            alert('Logout failed. An error occurred.');
            window.location.href = '/index.html'; // Redirect anyway for safety
        }

    } catch (error) {
        console.error("Logout Error:", error);
        alert('A network error occurred during logout.');
        window.location.href = '/index.html'; // Redirect anyway
    }
}


// --- Event Listeners and Initial Load ---

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    // 1. Handle Login Form Submission (index.html)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());
            await submitForm('login', data, 'dashboard.html'); // uses /login route
        });
    }

    // 2. Handle Registration Form Submission (register.html)
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());
            await submitForm('register', data, 'index.html'); // uses /register route
        });
    }

    // 3. Handle Forgot Password Request (forgot-password.html)
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(forgotPasswordForm);
            const data = Object.fromEntries(formData.entries());
            await submitForm('forgot-password', data, null); 
        });
    }

    // 4. Handle Password Reset Submission (reset-password.html)
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        const resetToken = getQueryParam('token');
        if (!resetToken) {
            displayMessage('error', 'Reset token is missing. Please check your email link.');
            return;
        }

        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (newPassword !== confirmPassword) {
                displayMessage('error', 'Passwords do not match.');
                return;
            }

            const data = { newPassword };
            const endpoint = `reset-password/${resetToken}`; 

            await submitForm(endpoint, data, 'index.html', true);
        });
    }


    // 5. Handle Dashboard and Logout (dashboard.html)
    if (path.includes('dashboard.html')) {
        fetchCurrentUser();
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
});
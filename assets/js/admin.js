document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login-form');
    const statusMessage = document.getElementById('login-status-message');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    async function handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('login-btn');

        loginBtn.textContent = 'Logging in...';
        loginBtn.disabled = true;
        statusMessage.style.display = 'none';

        // --- STEP 1: Send credentials to the backend ---
        try {
            // Replace '/api/admin/login' with your actual Node.js endpoint
            const response = await fetch('http://localhost:8080/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            // --- STEP 2: Process the response ---
            if (response.ok) {
                const data = await response.json();
                
                // Store the token (or session info) securely
                localStorage.setItem('adminToken', data.token); 
                
                // Display success message
                showStatus('Login successful! Redirecting...', 'success');
                
                // Redirect to the Admin Dashboard after a short delay
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html'; 
                }, 1500);

            } else {
                // Handle 401 Unauthorized or other errors
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Invalid username or password.';
                showStatus(errorMessage, 'error');
                console.log(response);
            }

        } catch (error) {
            console.error('Login error:', error);
            showStatus('Network error or server unavailable. Try again later.', 'error');
        } finally {
            loginBtn.textContent = 'Log In';
            loginBtn.disabled = false;
        }
    }

    /** Helper function to show status messages */
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `sntatus-message ${type}`;
        statusMessage.style.display = 'block';
    }
});
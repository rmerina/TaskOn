document.addEventListener('DOMContentLoaded', function() {
            const loginForm = document.getElementById('loginForm');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const loginBtn = document.getElementById('loginBtn');
            const loginText = document.getElementById('loginText');
            const loginSpinner = document.getElementById('loginSpinner');
            
            // Validate email format
            function validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(String(email).toLowerCase());
            }
            
            // Form submission
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Basic validation
                if (!validateEmail(emailInput.value) || passwordInput.value.length < 6) {
                    alert('Please enter valid credentials');
                    return;
                }
                
                // Show loading state
                loginText.classList.add('hidden');
                loginSpinner.classList.remove('hidden');
                loginBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Store auth state
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('userEmail', emailInput.value);
                    
                    // Redirect to tsm.html
                    window.location.href = 'tsm.html';
                }, 1500);
            });
        });
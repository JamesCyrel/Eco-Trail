// ===================================
// LOGIN & SIGNUP FUNCTIONALITY
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize login form if it exists
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Initialize signup form if it exists
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

// ===================================
// LOGIN HANDLER
// ===================================

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Validate email
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Validate password
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    
    // Simulate API call
    setTimeout(() => {
        // In a real application, this would make an API call to verify credentials
        // For demo purposes, we'll simulate successful login
        
        // Store user data (in real app, this would come from API)
        const userData = {
            email: email,
            name: email.split('@')[0],
            loggedIn: true,
            loginTime: new Date().toISOString()
        };
        
        if (remember) {
            localStorage.setItem('ecotrail_user', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('ecotrail_user', JSON.stringify(userData));
        }
        
        showNotification('Login successful! Redirecting...', 'success');
        
        // Check if there's a redirect URL stored
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        
        // Redirect to stored URL or default to index page
        setTimeout(() => {
            if (redirectUrl) {
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectUrl;
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);
        
    }, 1500);
}

// ===================================
// SIGNUP HANDLER
// ===================================

function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');
    const newsletter = formData.get('newsletter');
    
    // Validation
    if (!firstName || !lastName) {
        showNotification('Please enter your full name', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (!isValidPhone(phone)) {
        showNotification('Please enter a valid Philippine phone number', 'error');
        return;
    }
    
    if (!isStrongPassword(password)) {
        showNotification('Password must be at least 8 characters with letters and numbers', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (!terms) {
        showNotification('Please agree to the Terms & Conditions', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    
    // Simulate API call
    setTimeout(() => {
        // In a real application, this would make an API call to create account
        // For demo purposes, we'll simulate successful signup
        
        // Store user data
        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            newsletter: newsletter ? true : false,
            signupTime: new Date().toISOString(),
            loggedIn: true
        };
        
        localStorage.setItem('ecotrail_user', JSON.stringify(userData));
        
        showNotification('Account created successfully! Redirecting...', 'success');
        
        // Check if there's a redirect URL stored
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        
        // Redirect to stored URL or default to index page
        setTimeout(() => {
            if (redirectUrl) {
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectUrl;
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);
        
    }, 2000);
}

// ===================================
// PASSWORD TOGGLE
// ===================================

function togglePassword(inputId) {
    // If no inputId provided, use the default password field
    const input = inputId ? document.getElementById(inputId) : document.getElementById('password');
    const icon = inputId ? document.getElementById('toggleIcon' + inputId.charAt(0).toUpperCase() + inputId.slice(1)) : document.getElementById('toggleIcon');
    
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    } else {
        input.type = 'password';
        if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// ===================================
// VALIDATION HELPERS
// ===================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Philippine phone number validation
    const phoneRegex = /^(09|\+639)\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function isStrongPassword(password) {
    // At least 8 characters, contains letters and numbers
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Check screen size for responsive positioning
    const isMobile = window.innerWidth <= 768;
    const topPosition = isMobile ? '20px' : '100px';
    const rightPosition = isMobile ? '10px' : '20px';
    const leftPosition = isMobile ? '10px' : 'auto';
    const maxWidth = isMobile ? 'calc(100% - 20px)' : '400px';
    
    notification.style.cssText = `
        position: fixed;
        top: ${topPosition};
        right: ${rightPosition};
        ${isMobile ? `left: ${leftPosition};` : ''}
        background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 100000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.3s ease;
        max-width: ${maxWidth};
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin-left: 1rem;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===================================
// CHECK IF USER IS LOGGED IN
// ===================================

function isUserLoggedIn() {
    const localUser = localStorage.getItem('ecotrail_user');
    const sessionUser = sessionStorage.getItem('ecotrail_user');
    return localUser || sessionUser;
}

function getCurrentUser() {
    const localUser = localStorage.getItem('ecotrail_user');
    const sessionUser = sessionStorage.getItem('ecotrail_user');
    const userDataString = localUser || sessionUser;
    
    if (userDataString) {
        try {
            return JSON.parse(userDataString);
        } catch (e) {
            return null;
        }
    }
    return null;
}

function logout() {
    localStorage.removeItem('ecotrail_user');
    sessionStorage.removeItem('ecotrail_user');
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c🔐 Auth System Loaded 🔐', 'color: #2d7a4f; font-size: 16px; font-weight: bold;');
console.log('%cLogin and Signup ready!', 'color: #52a679; font-size: 12px;');


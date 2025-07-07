import { authService } from './auth.service.js';
import { AuthViews } from './auth.views.js';

// Password strength calculator
const calculatePasswordStrength = (password) => {
    let strength = 0;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[^A-Za-z0-9]/.test(password);
    
    // Length contributes up to 3 points
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;
    
    // Character variety
    if (hasUpperCase && hasLowerCase) strength += 1;
    if (hasNumbers) strength += 1;
    if (hasSpecialChars) strength += 1;
    
    // Calculate percentage and color
    const percentage = Math.min(100, strength * 20);
    let color, label;
    
    if (percentage <= 20) {
        color = '#e74c3c'; // Red
        label = 'Very Weak';
    } else if (percentage <= 40) {
        color = '#f39c12'; // Orange
        label = 'Weak';
    } else if (percentage <= 60) {
        color = '#f1c40f'; // Yellow
        label = 'Fair';
    } else if (percentage <= 80) {
        color = '#2ecc71'; // Light green
        label = 'Good';
    } else {
        color = '#27ae60'; // Green
        label = 'Strong';
    }
    
    return { percentage, color, label, strength };
};

// Initialize auth state when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    AuthViews.initAuthState();
    
    // Setup password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });
});

// Signup Controller
if (document.getElementById('signupForm')) {
    AuthViews.redirectIfAuthenticated();
    
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthText = document.getElementById('passwordStrengthText');
    
    // Password strength indicator
    passwordInput.addEventListener('input', function() {
        const { percentage, color, label } = calculatePasswordStrength(this.value);
        
        strengthBar.style.width = `${percentage}%`;
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = label;
        strengthText.style.color = color;
    });
    
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        AuthViews.showLoading('signupForm', true);
        
        const formData = {
            username: signupForm.signupUsername.value.trim(),
            email: signupForm.signupEmail.value.trim(),
            password: signupForm.signupPassword.value,
            confirmPassword: signupForm.confirmPassword.value
        };
        
        try {
            // Client-side validation
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Passwords do not match');
            }
            
            const { strength } = calculatePasswordStrength(formData.password);
            if (strength < 2) {
                throw new Error('Password is too weak. Please choose a stronger password.');
            }
            
            if (!signupForm.agreeTerms.checked) {
                throw new Error('You must agree to the terms and conditions');
            }
            
            // Register user
            const user = await authService.register(formData);
            
            // Show success message and redirect
            AuthViews.showSuccess(
                'signupForm', 
                'Account created successfully! Redirecting to your profile...',
                '/profile.html'
            );
            
            // Reset form
            signupForm.reset();
            strengthBar.style.width = '0';
            strengthText.textContent = 'Very Weak';
            strengthText.style.color = '';
            
        } catch (error) {
            AuthViews.showError('signupForm', error.message);
        } finally {
            AuthViews.showLoading('signupForm', false);
        }
    });
}

// Login Controller (would be in login.html's controller)
if (document.getElementById('loginForm')) {
    AuthViews.redirectIfAuthenticated();
    
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        AuthViews.showLoading('loginForm', true);
        
        const credentials = {
            email: loginForm.loginEmail.value.trim(),
            password: loginForm.loginPassword.value
        };
        
        try {
            const user = await authService.login(credentials);
            AuthViews.showSuccess(
                'loginForm', 
                'Login successful! Redirecting...',
                '/jobs.html'
            );
        } catch (error) {
            AuthViews.showError('loginForm', error.message);
        } finally {
            AuthViews.showLoading('loginForm', false);
        }
    });
}

// Global logout handler
document.addEventListener('click', async (e) => {
    if (e.target.closest('#logoutBtn')) {
        try {
            await authService.logout();
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
            window.location.href = '/';
        }
    }
});
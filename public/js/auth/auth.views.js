export class AuthViews {
    static showError(formId, message) {
        const form = document.getElementById(formId);
        if (!form) return;

        let errorElement = form.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            form.prepend(errorElement);
        }
        
        errorElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span>${message}</span>
        `;
        errorElement.style.display = 'flex';
        
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    static showSuccess(formId, message, redirectUrl = null) {
        const form = document.getElementById(formId);
        if (!form) return;

        let successElement = form.querySelector('.success-message');
        
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.className = 'success-message';
            form.prepend(successElement);
        }
        
        successElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>${message}</span>
        `;
        successElement.style.display = 'flex';
        
        if (redirectUrl) {
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1500);
        } else {
            setTimeout(() => {
                successElement.style.display = 'none';
            }, 5000);
        }
    }

    static showLoading(formId, show = true) {
        const form = document.getElementById(formId);
        if (!form) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        submitBtn.disabled = show;
        submitBtn.innerHTML = show ? `
            <span class="spinner"></span> Processing...
        ` : submitBtn.dataset.originalText || submitBtn.textContent;
    }

    static updateAuthUI(user) {
        const authSection = document.getElementById('authSection');
        if (!authSection) return;
        
        if (user) {
            authSection.innerHTML = `
                <div class="user-dropdown">
                    <button class="user-profile">
                        <div class="avatar">
                            ${user.username.charAt(0).toUpperCase()}
                        </div>
                        <span>${user.username}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="dropdown-menu">
                        <a href="/profile.html"><i class="fas fa-user"></i> Profile</a>
                        <a href="/applications.html"><i class="fas fa-file-alt"></i> Applications</a>
                        <a href="/saved-jobs.html"><i class="fas fa-bookmark"></i> Saved Jobs</a>
                        <div class="divider"></div>
                        <button id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</button>
                    </div>
                </div>
            `;
            
            // Add dropdown functionality
            const profileBtn = authSection.querySelector('.user-profile');
            const dropdown = authSection.querySelector('.dropdown-menu');
            
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdown.classList.remove('show');
            });
        } else {
            authSection.innerHTML = `
                <a href="/login.html" class="auth-btn">Login</a>
                <a href="/signup.html" class="auth-btn primary">Register</a>
            `;
        }
    }

    static redirectIfAuthenticated(redirectUrl = '/jobs.html') {
        if (authService.isAuthenticated()) {
            window.location.href = redirectUrl;
        }
    }

    static protectRoute(loginUrl = '/login.html') {
        if (!authService.isAuthenticated()) {
            window.location.href = loginUrl;
        }
    }

    static async initAuthState() {
        try {
            const isAuthenticated = await authService.checkAuth();
            if (!isAuthenticated && authService.isAuthenticated()) {
                // Token is invalid but we thought we were logged in
                authService.clearAuth();
                window.location.href = '/login.html';
            }
            this.updateAuthUI(authService.currentUser);
        } catch (error) {
            console.error('Auth initialization error:', error);
            this.updateAuthUI(null);
        }
    }
}
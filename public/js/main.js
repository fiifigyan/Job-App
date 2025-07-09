// main.js
import { authService } from './auth/auth.service.js';
import { AuthViews } from './auth/auth.views.js';

// Theme Functions
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = `<i class="fas fa-${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
}

// Mobile Menu Functions
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // Update aria-expanded attribute for accessibility
            const isExpanded = mainNav.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#mainNav') && !e.target.closest('#mobileMenuBtn')) {
                mainNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Search Functionality
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const jobSearchInput = document.getElementById('jobSearchInput');
    const locationInput = document.getElementById('locationInput');
    
    if (searchBtn && jobSearchInput && locationInput) {
        const performSearch = () => {
            const query = jobSearchInput.value.trim();
            const location = locationInput.value.trim();
            
            if (query || location) {
                const params = new URLSearchParams();
                if (query) params.append('q', query);
                if (location) params.append('location', location);
                window.location.href = `/jobs.html?${params.toString()}`;
            }
        };

        searchBtn.addEventListener('click', performSearch);
        
        // Allow search on Enter key
        [jobSearchInput, locationInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        });
    }
}

// Auth Functions
async function initAuth() {
    try {
        // Show loading state
        const authSection = document.getElementById('authSection');
        if (authSection) {
            authSection.innerHTML = '<div class="auth-loading"><span class="spinner"></span></div>';
        }

        // Check auth status
        const isAuthenticated = await authService.checkAuth();
        
        if (!isAuthenticated && authService.isAuthenticated()) {
            // Token is invalid but we thought we were logged in
            authService.clearAuth();
            window.location.href = '/login.html';
            return;
        }

        // Update UI based on auth status
        AuthViews.updateAuthUI(authService.currentUser);
        
        // Set up auth event listeners
        initAuthListeners();
    } catch (error) {
        console.error('Auth initialization error:', error);
        AuthViews.updateAuthUI(null);
    }
}

function initAuthListeners() {
    // Global logout handler
    document.addEventListener('click', async (e) => {
        if (e.target.closest('#logoutBtn')) {
            e.preventDefault();
            try {
                await authService.logout();
                AuthViews.updateAuthUI(null);
                window.location.href = '/';
            } catch (error) {
                console.error('Logout failed:', error);
                window.location.href = '/';
            }
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

// Prevent mobile menu from closing when clicking inside it
function initNavClickHandler() {
    const mainNav = document.getElementById('mainNav');
    if (mainNav) {
        mainNav.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// Main Initialization
async function initializeApp() {
    try {
        // Initialize theme first
        initTheme();
        
        // Set up theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        // Initialize mobile menu
        initMobileMenu();
        
        // Initialize search
        initSearch();
        
        // Initialize auth
        await initAuth();
        
        // Initialize nav click handler
        initNavClickHandler();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Application initialization failed:', error);
    }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
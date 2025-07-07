import { authService } from './auth/auth.service.js';
import { AuthViews } from './auth/auth.views.js';

// Initialize theme from localStorage or preferred color scheme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Toggle between light/dark theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Update theme toggle icon
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = `<i class="fas fa-${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
    }
}

// Initialize mobile menu toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            mainNav.classList.remove('active');
        });
    }
}

// Initialize search functionality
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

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    try {
        initTheme();
        initMobileMenu();
        initSearch();
        
        // Initialize theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Initialize auth state
        AuthViews.initAuthState();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Application initialization failed:', error);
    }
});
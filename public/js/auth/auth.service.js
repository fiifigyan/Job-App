import { apiService } from './api.service.js';
import { storageService } from './storage.service.js';

export class AuthService {
    constructor() {
        this.currentUser = storageService.get('currentUser') || null;
        this.token = storageService.get('authToken') || null;
        this.tokenExpiration = storageService.get('tokenExpiration') || null;
    }

    async register(userData) {
        try {
            // Validate password strength client-side first
            if (userData.password.length < 8) {
                throw new Error('Password must be at least 8 characters');
            }

            if (userData.password !== userData.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const response = await apiService.post('/auth/register', {
                username: userData.username,
                email: userData.email,
                password: userData.password
            });

            this.setAuth(response.user, response.token, response.expiresIn);
            return response.user;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async login(credentials) {
        try {
            const response = await apiService.post('/auth/login', credentials);
            this.setAuth(response.user, response.token, response.expiresIn);
            return response.user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async logout() {
        try {
            await apiService.post('/auth/logout', {}, this.token);
            this.clearAuth();
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            this.clearAuth(); // Clear auth even if server logout fails
            return false;
        }
    }

    async refreshToken() {
        if (!this.token || !this.tokenExpiration) return false;
        
        // Refresh if token expires in less than 5 minutes
        if (new Date(this.tokenExpiration) - Date.now() > 300000) {
            return true;
        }

        try {
            const response = await apiService.post('/auth/refresh', {}, this.token);
            this.token = response.token;
            this.tokenExpiration = new Date(Date.now() + response.expiresIn * 1000);
            storageService.set('authToken', this.token);
            storageService.set('tokenExpiration', this.tokenExpiration);
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.clearAuth();
            return false;
        }
    }

    setAuth(user, token, expiresIn) {
        this.currentUser = user;
        this.token = token;
        this.tokenExpiration = new Date(Date.now() + expiresIn * 1000);
        
        storageService.set('currentUser', user);
        storageService.set('authToken', token);
        storageService.set('tokenExpiration', this.tokenExpiration);
    }

    clearAuth() {
        this.currentUser = null;
        this.token = null;
        this.tokenExpiration = null;
        
        storageService.remove('currentUser');
        storageService.remove('authToken');
        storageService.remove('tokenExpiration');
    }

    isAuthenticated() {
        return !!this.token && !!this.currentUser;
    }

    async checkAuth() {
        if (!this.isAuthenticated()) return false;
        
        try {
            const response = await apiService.get('/auth/verify', this.token);
            return response.valid;
        } catch (error) {
            console.error('Auth verification failed:', error);
            return false;
        }
    }
}

export const authService = new AuthService();
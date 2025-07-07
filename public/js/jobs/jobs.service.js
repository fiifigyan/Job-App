import { apiService } from './api.service.js';

export const jobsService = {
    async getJobs(filters = {}, page = 1, limit = 10) {
        const query = new URLSearchParams({
            page,
            limit,
            ...filters
        }).toString();
        
        try {
            const response = await apiService.get(`/jobs?${query}`);
            return {
                jobs: response.data,
                total: response.total,
                page: response.page,
                pages: response.pages
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch jobs');
        }
    },

    async getJobDetails(jobId) {
        try {
            const response = await apiService.get(`/jobs/${jobId}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch job details');
        }
    },

    async applyToJob(jobId, applicationData) {
        try {
            const response = await apiService.post(`/jobs/${jobId}/apply`, applicationData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Failed to apply to job');
        }
    },

    async saveJob(jobId) {
        try {
            const response = await apiService.post(`/jobs/${jobId}/save`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Failed to save job');
        }
    },

    async getSavedJobs() {
        try {
            const response = await apiService.get('/jobs/saved');
            return response;
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch saved jobs');
        }
    },

    async getRecommendedJobs() {
        try {
            const response = await apiService.get('/jobs/recommended');
            return response;
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch recommended jobs');
        }
    }
};
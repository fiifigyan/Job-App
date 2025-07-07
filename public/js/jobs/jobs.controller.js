import { jobsService } from './jobs.service.js';
import { jobsViews } from './jobs.views.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize jobs display
    const jobs = jobsService.getJobs();
    jobsViews.displayJobs(jobs);
    
    // Set up filter event listeners
    document.getElementById('jobType').addEventListener('change', filterJobs);
    document.getElementById('experienceLevel').addEventListener('change', filterJobs);
    
    function filterJobs() {
        const filters = {
            type: document.getElementById('jobType').value,
            experience: document.getElementById('experienceLevel').value
        };
        const filteredJobs = jobsService.getJobs(filters);
        jobsViews.displayJobs(filteredJobs);
    }
});
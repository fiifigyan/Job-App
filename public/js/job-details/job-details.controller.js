import { jobsService } from '../../services/jobs.service.js';
import { authService } from '../../auth/auth.service.js';
import { AuthViews } from '../../auth/auth.views.js';

export class JobDetailsController {
    constructor() {
        this.jobId = this.getJobIdFromUrl();
        this.init();
    }

    getJobIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async init() {
        try {
            // Load job details
            await this.loadJobDetails();
            
            // Initialize event listeners
            this.initEventListeners();
            
            // Load similar jobs
            await this.loadSimilarJobs();
        } catch (error) {
            console.error('Error initializing job details:', error);
            this.showError('Failed to load job details');
        }
    }

    async loadJobDetails() {
        if (!this.jobId) {
            throw new Error('No job ID provided');
        }

        const job = await jobsService.getJobDetails(this.jobId);
        this.renderJobDetails(job);
    }

    renderJobDetails(job) {
        // Main job details
        document.getElementById('jobTitle').textContent = job.title;
        document.getElementById('jobCompany').textContent = job.company.name;
        document.getElementById('jobLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${job.location}`;
        document.getElementById('jobType').innerHTML = `<i class="fas fa-clock"></i> ${job.type}`;
        document.getElementById('jobSalary').innerHTML = `<i class="fas fa-dollar-sign"></i> ${job.salary}`;
        
        // Job content
        document.getElementById('jobDescription').innerHTML = job.description;
        
        // Requirements
        const requirementsList = document.getElementById('jobRequirements');
        requirementsList.innerHTML = job.requirements.map(req => `<li>${req}</li>`).join('');
        
        // Benefits
        const benefitsList = document.getElementById('jobBenefits');
        benefitsList.innerHTML = job.benefits.map(benefit => `<li>${benefit}</li>`).join('');
        
        // Company info
        document.getElementById('companyName').textContent = job.company.name;
        document.getElementById('companyLogo').src = job.company.logo;
        document.getElementById('companyLogo').alt = `${job.company.name} logo`;
        document.getElementById('companyIndustry').textContent = job.company.industry;
        document.getElementById('companySize').textContent = job.company.size;
        document.getElementById('companyWebsiteLink').href = job.company.website;
        
        // Modal title
        document.getElementById('modalJobTitle').textContent = job.title;
    }

    async loadSimilarJobs() {
        try {
            const similarJobs = await jobsService.getSimilarJobs(this.jobId);
            this.renderSimilarJobs(similarJobs);
        } catch (error) {
            console.error('Error loading similar jobs:', error);
        }
    }

    renderSimilarJobs(jobs) {
        const similarJobsContainer = document.getElementById('similarJobs');
        
        if (jobs.length === 0) {
            similarJobsContainer.innerHTML = '<p>No similar jobs found</p>';
            return;
        }

        similarJobsContainer.innerHTML = jobs.map(job => `
            <div class="similar-job-card">
                <h4><a href="/job-details.html?id=${job.id}">${job.title}</a></h4>
                <p class="company">${job.company.name}</p>
                <div class="job-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span><i class="fas fa-clock"></i> ${job.type}</span>
                </div>
            </div>
        `).join('');
    }

    initEventListeners() {
        // Save job button
        document.getElementById('saveJob').addEventListener('click', async () => {
            if (!authService.isAuthenticated()) {
                window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
                return;
            }

            try {
                await jobsService.saveJob(this.jobId);
                this.showSuccess('Job saved successfully');
                document.getElementById('saveJob').innerHTML = '<i class="fas fa-bookmark"></i> Saved';
            } catch (error) {
                this.showError('Failed to save job');
            }
        });

        // Apply now button
        document.getElementById('applyNow').addEventListener('click', () => {
            if (!authService.isAuthenticated()) {
                window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
                return;
            }
            this.openApplicationModal();
        });

        // Modal close button
        document.querySelector('.modal .close').addEventListener('click', () => {
            this.closeApplicationModal();
        });

        // Application form submission
        document.getElementById('applicationForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitApplication();
        });
    }

    openApplicationModal() {
        document.getElementById('applicationModal').style.display = 'block';
    }

    closeApplicationModal() {
        document.getElementById('applicationModal').style.display = 'none';
        document.getElementById('applicationForm').reset();
    }

    async submitApplication() {
        const form = document.getElementById('applicationForm');
        const formData = new FormData(form);
        
        try {
            await jobsService.applyToJob(this.jobId, formData);
            this.showSuccess('Application submitted successfully');
            this.closeApplicationModal();
        } catch (error) {
            this.showError('Failed to submit application');
        }
    }

    showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JobDetailsController();
});
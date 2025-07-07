import { jobsService } from '../services/jobs.service.js';
import { authService } from '../auth/auth.service.js';

// Display trending jobs
async function displayTrendingJobs() {
    const trendingJobsContainer = document.getElementById('trendingJobs');
    if (!trendingJobsContainer) return;

    try {
        trendingJobsContainer.innerHTML = '<div class="loading-spinner"></div>';
        
        // Get trending jobs (in a real app, this would be an API call)
        const { jobs } = await jobsService.getJobs({ 
            limit: 4,
            sort: 'trending'
        });
        
        if (jobs.length === 0) {
            trendingJobsContainer.innerHTML = '<p class="no-results">No trending jobs found</p>';
            return;
        }
        
        trendingJobsContainer.innerHTML = jobs.map(job => `
            <div class="job-card">
                <div class="job-header">
                    <h3><a href="/job-details.html?id=${job.id}">${job.title}</a></h3>
                    <p class="company">${job.company}</p>
                </div>
                <div class="job-details">
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span><i class="fas fa-clock"></i> ${job.type.replace('-', ' ')}</span>
                </div>
                <p class="job-description">${job.description.substring(0, 100)}...</p>
                <div class="job-footer">
                    <span class="posted-date"><i class="far fa-calendar-alt"></i> Posted ${job.posted}</span>
                    <div class="job-actions">
                        ${authService.isAuthenticated() ? 
                            `<button class="save-job" data-job-id="${job.id}">
                                <i class="far fa-bookmark"></i>
                            </button>` : ''
                        }
                        <a href="/job-details.html?id=${job.id}" class="btn btn-primary btn-sm">
                            View Job
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to save buttons
        document.querySelectorAll('.save-job').forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                const jobId = button.dataset.jobId;
                try {
                    await jobsService.saveJob(jobId);
                    button.innerHTML = '<i class="fas fa-bookmark"></i>';
                    button.classList.add('saved');
                    showToast('Job saved to your profile');
                } catch (error) {
                    console.error('Error saving job:', error);
                    showToast('Failed to save job', 'error');
                }
            });
        });
        
    } catch (error) {
        console.error('Error loading trending jobs:', error);
        trendingJobsContainer.innerHTML = `
            <p class="error-message">
                <i class="fas fa-exclamation-circle"></i> Failed to load trending jobs
            </p>
        `;
    }
}

// Display testimonials
function displayTestimonials() {
    const testimonialsSlider = document.getElementById('testimonialsSlider');
    if (!testimonialsSlider) return;
    
    // Mock data - in a real app this would come from an API
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Frontend Developer at TechCorp",
            content: "JobFinder helped me land my dream job in just 2 weeks! The application process was so smooth and the salary insights were incredibly helpful.",
            avatar: "/public/images/avatars/avatar1.jpg"
        },
        {
            name: "Michael Chen",
            role: "UX Designer at DesignHub",
            content: "I received 3 interview invitations within a week of creating my profile. The quick apply feature saved me so much time!",
            avatar: "/public/images/avatars/avatar2.jpg"
        },
        {
            name: "David Wilson",
            role: "Data Scientist at DataWorks",
            content: "The job recommendations were spot-on for my skills and experience. I found a perfect match that I wouldn't have discovered otherwise.",
            avatar: "/public/images/avatars/avatar3.jpg"
        }
    ];
    
    testimonialsSlider.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-card">
            <div class="testimonial-content">
                <p>"${testimonial.content}"</p>
            </div>
            <div class="testimonial-author">
                <img src="${testimonial.avatar}" alt="${testimonial.name}" class="avatar">
                <div class="author-info">
                    <h4>${testimonial.name}</h4>
                    <p>${testimonial.role}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Initialize homepage
document.addEventListener('DOMContentLoaded', () => {
    displayTrendingJobs();
    displayTestimonials();
    
    // Add any other homepage-specific initialization here
});
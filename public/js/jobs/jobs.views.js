export const jobsViews = {
    displayJobs(jobs) {
        const jobsContainer = document.getElementById('jobsContainer');
        jobsContainer.innerHTML = '';
        
        if (jobs.length === 0) {
            jobsContainer.innerHTML = '<p>No jobs found matching your criteria.</p>';
            return;
        }
        
        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
                <h3>${job.title}</h3>
                <p class="company">${job.company}</p>
                <div class="details">
                    <span>${job.location}</span>
                    <span>${job.type.replace('-', ' ')}</span>
                    <span>${job.experience} level</span>
                </div>
                <p class="description">${job.description}</p>
                <p class="posted">Posted: ${job.posted}</p>
                <button class="apply-btn" data-id="${job.id}">Apply Now</button>
            `;
            jobsContainer.appendChild(jobCard);
        });
    },

    openApplicationModal(jobId, jobs) {
        const job = jobs.find(job => job.id == jobId);
        if (job) {
            document.getElementById('jobTitle').textContent = job.title;
            document.getElementById('jobId').value = job.id;
            document.getElementById('applicationModal').style.display = 'block';
        }
    },

    closeApplicationModal() {
        document.getElementById('applicationModal').style.display = 'none';
        document.getElementById('applicationForm').reset();
    }
};
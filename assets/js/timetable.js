document.addEventListener('DOMContentLoaded', () => {
    // API_BASE_URL is defined globally in main.js
    const currentTimetableSection = document.getElementById('current-timetable-section');
    const archiveListEl = document.getElementById('timetable-archive-list');
    
    // 1. Fetch the Current Timetable (Single Item)
    async function fetchCurrentTimetable() {
        currentTimetableSection.innerHTML = '<div class="loading-container"><div class="spinner"></div><p>Loading current timetable...</p></div>';
        try {
            // CALL: GET /api/timetables/current
            const response = await fetch(`${API_BASE_URL}/timetables/current`);
            
            if (!response.ok) {
                throw new Error('Failed to load current timetable.');
            }

            const data = await response.json(); 
            
            if (data.timetable_id) {
                // Render the current timetable display
                currentTimetableSection.innerHTML = `
                    <h3>${data.title}</h3>
                    <p class="meta">Posted: ${new Date(data.date_posted).toLocaleDateString()}</p>
                    ${data.description ? `<p class="description">${data.description}</p>` : ''}
                    <div class="timetable-link-box">
                        <p>Access the official document:</p>
                        <a href="${data.file_url}" target="_blank" class="download-button">
                            View/Download Timetable (PDF/Image)
                        </a>
                    </div>
                `;
            } else {
                currentTimetableSection.innerHTML = '<p class="empty-message">No current timetable has been posted yet.</p>';
            }

        } catch (error) {
            console.error('Error fetching current timetable:', error);
            currentTimetableSection.innerHTML = '<p class="error-message">Failed to load the current timetable.</p>';
        }
    }

    // 2. Fetch Archived Timetables
    async function fetchArchivedTimetables() {
        archiveListEl.innerHTML = '<div class="loading-container"><div class="spinner"></div><p>Loading archived list...</p></div>';
        try {
            // CALL: GET /api/timetables/archive
            const response = await fetch(`${API_BASE_URL}/timetables/archive`);
            
            if (!response.ok) {
                throw new Error('Failed to load archived timetables.');
            }

            const archivedData = await response.json(); 
            
            displayArchivedTimetables(archivedData);

        } catch (error) {
            console.error('Error fetching archived timetables:', error);
            archiveListEl.innerHTML = '<p class="error-message">Failed to load the archived timetables list.</p>';
        }
    }

    // 3. Render the Archived List
    function displayArchivedTimetables(items) {
        archiveListEl.innerHTML = ''; // Clear previous content

        if (items.length === 0) {
            archiveListEl.innerHTML = '<p class="empty-message">No archived timetables available.</p>';
            return;
        }

        const ul = document.createElement('ul');
        items.forEach(item => {
            const li = document.createElement('li');
            // Note: Since the public archive list doesn't expose file_url for security/cleanup, 
            // the admin must repost the link if they want students to view it.
            li.innerHTML = `
                <span class="archive-title">${item.title}</span> 
                <span class="archive-date">Posted: ${new Date(item.date_posted).toLocaleDateString()}</span>
                — <span class="status">ARCHIVED</span>
            `;
            ul.appendChild(li);
        });
        archiveListEl.appendChild(ul);
    }

    // Initial load
    fetchCurrentTimetable();
    fetchArchivedTimetables();
});
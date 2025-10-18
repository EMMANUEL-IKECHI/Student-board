document.addEventListener('DOMContentLoaded', () => {
    // Check for admin authentication immediately
    if (!initAdminPage()) {
        return; // Stop execution if not authenticated
    }
    
    // -----------------------------------------------------------------
    // 1. DOM Elements
    // -----------------------------------------------------------------
    const form = document.getElementById('timetable-form');
    const titleInput = document.getElementById('title');
    const urlInput = document.getElementById('file_url');
    const loadingStatus = document.getElementById('loading-status');
    const currentDisplay = document.getElementById('current-timetable-display');
    const currentTitleSpan = document.getElementById('current-title');
    const currentUrlLink = document.getElementById('current-url');
    const currentLastUpdatedSpan = document.getElementById('current-last-updated');
    const messageDiv = document.getElementById('admin-message');

    // -----------------------------------------------------------------
    // 2. Utility Functions
    // -----------------------------------------------------------------

    /**
     * Display system messages.
     */
    function displayMessage(msg, type) {
        messageDiv.textContent = msg;
        messageDiv.className = `status-message message-${type}`;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    /**
     * Headers for authenticated requests.
     */
    function getAuthHeaders() {
        const token = localStorage.getItem('adminToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    /**
     * Formats an ISO date string into a readable local date/time.
     */
    function formatLastUpdated(isoString) {
        if (!isoString) return 'N/A';
        return new Date(isoString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // -----------------------------------------------------------------
    // 3. Data Operations
    // -----------------------------------------------------------------

    /**
     * Fetches the current timetable information (which is a single record).
     */
    async function fetchCurrentTimetable() {
        loadingStatus.textContent = 'Loading current timetable data...';
        currentDisplay.style.display = 'none';

        try {
            // Hypothetical API endpoint for fetching the single current timetable configuration
            const response = await fetch(`${API_BASE_URL}/admin/timetables/current`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });

            if (!response.ok) {
                 // Even if 404 (Not Found), we should still display the form to create a new one.
                 if (response.status === 404) {
                    loadingStatus.textContent = 'No current timetable found. Please create one below.';
                    return;
                 }
                throw new Error('Failed to fetch current timetable status.');
            }

            const data = await response.json();
            
            // Populate Display Status
            currentTitleSpan.textContent = data.title || 'N/A';
            currentUrlLink.textContent = data.file_url ? 'View Document' : 'N/A';
            currentUrlLink.href = data.file_url || '#';
            currentLastUpdatedSpan.textContent = formatLastUpdated(data.updated_at);

            currentDisplay.style.display = 'block';
            loadingStatus.textContent = ''; // Clear loading text
            
            // Populate Form for easy editing
            titleInput.value = data.title || '';
            urlInput.value = data.file_url || '';

        } catch (error) {
            console.error('Fetch Error:', error);
            displayMessage(`Error loading data: ${error.message}`, 'error');
            loadingStatus.textContent = 'Failed to load timetable status.';
        }
    }

    /**
     * Handles form submission (PUT request to update the single configuration record).
     */
    async function handleFormSubmit(e) {
        e.preventDefault();
        displayMessage('Updating timetable link...', 'info');

        const timetableData = {
            title: titleInput.value.trim(),
            file_url: urlInput.value.trim(),
            // We usually let the backend handle the updated_at timestamp
        };

        try {
            // We use a PUT request to update the single 'current' resource
            const response = await fetch(`${API_BASE_URL}/admin/timetables/current`, {
                method: 'PUT', 
                headers: getAuthHeaders(),
                body: JSON.stringify(timetableData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update timetable link.');
            }

            // Success feedback
            displayMessage(`Timetable link updated successfully!`, 'success');
            fetchCurrentTimetable(); // Refresh the status display

        } catch (error) {
            console.error('Submit Error:', error);
            displayMessage(`Update Failed: ${error.message}`, 'error');
        }
    }
    
    // -----------------------------------------------------------------
    // 4. Initialization
    // -----------------------------------------------------------------

    // Attach Event Listener
    form.addEventListener('submit', handleFormSubmit);

    // Initial data fetch
    fetchCurrentTimetable();
});

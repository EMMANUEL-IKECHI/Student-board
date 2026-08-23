document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // 1. DOM Elements and State
    // -----------------------------------------------------------------
    const authGuard = document.getElementById('auth-guard');
    const adminContent = document.getElementById('admin-content');
    const form = document.getElementById('event-form');
    const formTitle = document.getElementById('form-title');
    const saveBtn = document.getElementById('save-event-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const tableBody = document.getElementById('events-table-body');
    const loadingEvents = document.getElementById('loading-events');
    const messageDiv = document.getElementById('admin-message');

    // Input Fields
    const eventIdInput = document.getElementById('event-id');
    const titleInput = document.getElementById('title');
    const locationInput = document.getElementById('location');
    const startTimeInput = document.getElementById('start_time');
    const endTimeInput = document.getElementById('end_time');
    const descriptionInput = document.getElementById('description');
    const categoryInput = document.getElementById('category');

    let isEditing = false;

    // -----------------------------------------------------------------
    // 2. Utility Functions
    // -----------------------------------------------------------------

    /**
     * Converts a JS Date object/ISO string into the format needed for datetime-local input: YYYY-MM-DDTHH:MM
     * @param {string | Date} dateString 
     * @returns {string} Local datetime string
     */
    function formatToLocalDatetime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        // We use slice(0, 16) to get the YYYY-MM-DDTHH:MM part
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    }

    /**
     * Display system messages.
     */
    function displayMessage(msg, type) {
        messageDiv.textContent = msg;
        messageDiv.className = `message-${type}`;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    /**
     * Checks for admin token and redirects if unauthorized.
     */
    function checkAdminAuthAndInit() {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            authGuard.style.display = 'block';
            adminContent.style.display = 'none';
            setTimeout(() => { window.location.href = 'admin-login.html'; }, 100);
            return false;
        }
        authGuard.style.display = 'none';
        adminContent.style.display = 'block';
        return true;
    }

    /**
     * Clears the form and resets the state to 'Create'.
     */
    function resetForm() {
        form.reset();
        isEditing = false;
        eventIdInput.value = '';
        formTitle.textContent = 'Create New Event';
        saveBtn.textContent = 'Publish Event';
        cancelBtn.style.display = 'none';
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

    // -----------------------------------------------------------------
    // 3. CRUD Operations (API Calls)
    // -----------------------------------------------------------------

    /**
     * Fetches all events for admin view.
     */
    async function fetchEvents() {
        loadingEvents.textContent = 'Loading events...';
        tableBody.innerHTML = '';
        
        try {
            // Using a hypothetical admin endpoint that fetches ALL events
            const response = await fetch(`${API_BASE_URL}/admin/events/all`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('Unauthorized: Session expired or invalid token.');
                }
                throw new Error('Failed to fetch events.');
            }

            const events = await response.json();
            renderEventsTable(events);

        } catch (error) {
            console.error('Fetch Error:', error);
            displayMessage(error.message, 'error');
            loadingEvents.textContent = 'Error loading events. Please log in again.';
        }
    }

    /**
     * Handles form submission for both creation (POST) and update (PUT).
     */
    async function handleFormSubmit(e) {
        e.preventDefault();
        displayMessage('Saving event...', 'info');

        let event_date = null;
        let event_time = null;
        if (startTimeInput.value) {
            const parts = startTimeInput.value.split('T');
            event_date = parts[0];
            event_time = parts[1] || '';
        }

        const eventData = {
            title: titleInput.value,
            location: locationInput.value,
            event_date: event_date,
            event_time: event_time,
            description: descriptionInput.value
        };

        const id = eventIdInput.value;
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing 
            ? `${API_BASE_URL}/admin/events/${id}`
            : `${API_BASE_URL}/admin/events`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders(),
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} event.`);
            }

            const result = await response.json();
            displayMessage(`Event "${result.title}" successfully ${isEditing ? 'updated' : 'published'}!`, 'success');
            
            resetForm();
            fetchEvents(); // Refresh the list

        } catch (error) {
            console.error('Submit Error:', error);
            displayMessage(`Operation Failed: ${error.message}`, 'error');
        }
    }

    /**
     * Populates the form fields for editing an event.
     */
    function startEdit(item) {
        isEditing = true;
        
        // Populate Fields
        eventIdInput.value = item.event_id;
        titleInput.value = item.title;
        locationInput.value = item.location;
        descriptionInput.value = item.description;
        if(categoryInput) categoryInput.value = item.category || 'general';
        
        // Format ISO date strings back to datetime-local format for the input fields
        startTimeInput.value = item.event_date ? (item.event_date.split('T')[0] + 'T' + (item.event_time || '00:00')) : '';
        if(endTimeInput) endTimeInput.value = ''; // End time not supported by backend schema
        
        // Update UI
        formTitle.textContent = `Editing Event: ${item.title}`;
        saveBtn.textContent = 'Update Event';
        cancelBtn.style.display = 'inline-block';
        
        document.querySelector('.content-management-form').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Deletes an event permanently.
     */
    async function deleteEvent(id, title) {
        if (!confirm(`Are you sure you want to PERMANENTLY DELETE the event: "${title}"? This cannot be undone.`)) {
            return;
        }
        displayMessage('Deleting event...', 'info');

        try {
            const response = await fetch(`${API_BASE_URL}/admin/events/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete event.');
            }

            displayMessage(`Event "${title}" deleted successfully.`, 'success');
            fetchEvents();

        } catch (error) {
            console.error('Delete Error:', error);
            displayMessage(`Deletion Failed: ${error.message}`, 'error');
        }
    }
    
    // -----------------------------------------------------------------
    // 4. Rendering and Event Listeners
    // -----------------------------------------------------------------

    /**
     * Renders the list of events in the admin table.
     */
    function renderEventsTable(events) {
        tableBody.innerHTML = '';
        loadingEvents.textContent = '';
        
        if (events.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">No events currently scheduled.</td></tr>';
            return;
        }
        
        // Sort events by event_date (latest first)
        events.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

        const now = new Date();

        events.forEach(item => {
            const row = tableBody.insertRow();
            
            const eventDateTime = item.event_date ? new Date(item.event_date.split('T')[0] + 'T' + (item.event_time || '00:00')) : new Date();

            // Format date for display
            const startDate = eventDateTime.toLocaleString('en-US', { 
                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
            });

            // Determine Status
            const isPast = eventDateTime < now;
            const statusText = isPast ? 'Past' : 'Upcoming';
            const statusClass = isPast ? 'status-past' : 'status-upcoming';

            row.insertCell().textContent = item.title;
            row.insertCell().textContent = item.location;
            row.insertCell().textContent = startDate;
            row.insertCell().textContent = item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'General';
            row.insertCell().innerHTML = `<span class="status-tag ${statusClass}">${statusText}</span>`;
            
            // Actions Cell
            const actionsCell = row.insertCell();
            actionsCell.className = 'table-actions';
            
            // Edit Button
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => startEdit(item));
            actionsCell.appendChild(editBtn);

            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteEvent(item.event_id, item.title));
            actionsCell.appendChild(deleteBtn);
        });
    }

    // --- Attach Event Listeners ---
    form.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);

    // --- Initialization ---
    if (checkAdminAuthAndInit()) {
        fetchEvents();
    }
});

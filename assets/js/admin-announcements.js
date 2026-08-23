document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // 1. DOM Elements and State
    // -----------------------------------------------------------------

    // Security Check
    const authGuard = document.getElementById('auth-guard');
    const adminContent = document.getElementById('admin-content');
    
    // Form Elements
    const form = document.getElementById('announcement-form');
    const formTitle = document.getElementById('form-title');
    const saveBtn = document.getElementById('save-announcement-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    
    // Input Fields
    const announcementIdInput = document.getElementById('announcement-id');
    const titleInput = document.getElementById('title');
    const categoryInput = document.getElementById('category');
    const snippetInput = document.getElementById('snippet');
    const contentInput = document.getElementById('content');
    const isActiveInput = document.getElementById('is_active');
    
    // Table Elements
    const tableBody = document.getElementById('announcements-table-body');
    const loadingAnnouncements = document.getElementById('loading-announcements');

    // Message Element
    const messageDiv = document.getElementById('admin-message');
    
    let isEditing = false;
    
    // -----------------------------------------------------------------
    // 2. Utility Functions
    // -----------------------------------------------------------------

    /**
     * Display system messages to the admin.
     * @param {string} msg 
     * @param {string} type 'success', 'error', or 'info'
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
        announcementIdInput.value = '';
        formTitle.textContent = 'Create New Announcement';
        saveBtn.textContent = 'Publish Announcement';
        cancelBtn.style.display = 'none';
        isActiveInput.value = 'true'; // Default to active for new posts
    }

    /**
     * Headers for authenticated requests (POST, PUT, DELETE).
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
     * Fetches all announcements (active and archived) for admin view.
     */
    async function fetchAnnouncements() {
        loadingAnnouncements.textContent = 'Loading announcements...';
        tableBody.innerHTML = '';
        
        try {
            // NOTE: Using a hypothetical admin endpoint that fetches ALL data
            const response = await fetch(`${API_BASE_URL}/admin/announcements/all`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('Unauthorized: Session expired or invalid token.');
                }
                throw new Error('Failed to fetch announcements.');
            }

            const announcements = await response.json();
            renderAnnouncementsTable(announcements);

        } catch (error) {
            console.error('Fetch Error:', error);
            displayMessage(error.message, 'error');
            loadingAnnouncements.textContent = 'Error loading announcements. Please log in again.';
            if (error.message.includes('Unauthorized')) {
                 setTimeout(() => { window.location.href = 'admin-login.html'; }, 2000);
            }
        }
    }

    /**
     * Handles form submission for both creation (POST) and update (PUT).
     */
    async function handleFormSubmit(e) {
        e.preventDefault();
        displayMessage('Saving...', 'info');

        const announcementData = {
            title: titleInput.value,
            category: categoryInput.value,
            snippet: snippetInput.value,
            content: contentInput.value,
            status: isActiveInput.value === 'true' ? 'active' : 'archived'
        };

        const id = announcementIdInput.value;
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing 
            ? `${API_BASE_URL}/admin/announcements/${id}`
            : `${API_BASE_URL}/admin/announcements`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders(),
                body: JSON.stringify(announcementData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} announcement.`);
            }

            const result = await response.json();
            displayMessage(`Announcement ${result.title} successfully ${isEditing ? 'updated' : 'published'}!`, 'success');
            
            resetForm();
            fetchAnnouncements(); // Refresh the list

        } catch (error) {
            console.error('Submit Error:', error);
            displayMessage(`Operation Failed: ${error.message}`, 'error');
        }
    }

    /**
     * Populates the form fields for editing an announcement.
     * @param {object} item Announcement data
     */
    function startEdit(item) {
        isEditing = true;
        
        // Populate Hidden ID and Fields
        announcementIdInput.value = item.announcement_id;
        titleInput.value = item.title;
        categoryInput.value = item.category;
        snippetInput.value = item.snippet;
        contentInput.value = item.content;
        isActiveInput.value = item.is_active.toString(); // Must be a string 'true' or 'false'
        
        // Update UI
        formTitle.textContent = `Editing: ${item.title}`;
        saveBtn.textContent = 'Update Announcement';
        cancelBtn.style.display = 'inline-block';
        
        // Scroll to the top of the form for better UX
        document.querySelector('.content-management-form').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Deletes an announcement permanently.
     * @param {string} id Announcement ID
     * @param {string} title Announcement Title
     */
    async function deleteAnnouncement(id, title) {
        if (!confirm(`Are you sure you want to PERMANENTLY DELETE the announcement: "${title}"?`)) {
            return;
        }
        displayMessage('Deleting...', 'info');

        try {
            const response = await fetch(`${API_BASE_URL}/admin/announcements/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete announcement.');
            }

            displayMessage(`Announcement "${title}" deleted successfully.`, 'success');
            fetchAnnouncements();

        } catch (error) {
            console.error('Delete Error:', error);
            displayMessage(`Deletion Failed: ${error.message}`, 'error');
        }
    }
    
    // -----------------------------------------------------------------
    // 4. Rendering and Event Listeners
    // -----------------------------------------------------------------

    function renderAnnouncementsTable(announcements) {
        tableBody.innerHTML = '';
        loadingAnnouncements.textContent = ''; // Hide loading message
        
        // Filter out archived announcements so they disappear from the admin view after deletion
        const activeAnnouncements = announcements.filter(item => item.status === 'active');
        
        if (activeAnnouncements.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No active announcements found.</td></tr>';
            return;
        }

        activeAnnouncements.forEach(item => {
            const is_active = item.status === 'active';
            const row = tableBody.insertRow();
            const statusText = is_active ? 'Active' : 'Archived';
            const statusClass = is_active ? 'status-active' : 'status-archived';

            row.insertCell().textContent = item.title;
            row.insertCell().textContent = item.category.toUpperCase();
            row.insertCell().innerHTML = `<span class="status-tag ${statusClass}">${statusText}</span>`;
            row.insertCell().textContent = new Date(item.date_posted).toLocaleDateString();
            
            // Actions Cell
            const actionsCell = row.insertCell();
            actionsCell.className = 'table-actions';
            
            // Edit Button
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => startEdit({
                ...item,
                is_active: is_active
            }));
            actionsCell.appendChild(editBtn);

            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteAnnouncement(item.announcement_id, item.title));
            actionsCell.appendChild(deleteBtn);
        });
    }

    // --- Attach Event Listeners ---
    form.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);

    // --- Initialization ---
    if (checkAdminAuthAndInit()) {
        fetchAnnouncements();
    }
});

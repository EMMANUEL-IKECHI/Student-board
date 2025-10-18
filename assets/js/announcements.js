document.addEventListener('DOMContentLoaded', () => {
    // API_BASE_URL is defined in assets/js/main.js
    const announcementsList = document.getElementById('announcements-list');
    const filterCategory = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    
    let allAnnouncements = []; // Stores the raw data from the API

    // 1. Fetch Data from Backend API
    async function fetchAnnouncements() {
        announcementsList.innerHTML = '<p>Loading announcements...</p>';

        try {
            // CALL: GET /api/announcements (Public endpoint for active notices)
            const response = await fetch(`${API_BASE_URL}/announcements`);
            
            if (!response.ok) {
                throw new Error('Failed to load active announcements.');
            }

            allAnnouncements = await response.json(); 
            
            // Display initial filtered/searched list
            handleFilteringAndDisplay(); 

        } catch (error) {
            console.error('Error fetching announcements:', error);
            announcementsList.innerHTML = '<p class="error-message">Failed to load announcements. Please check server status.</p>';
        }
    }

    // 2. Handle Client-Side Filtering and Search
    function handleFilteringAndDisplay() {
        const selectedCategory = filterCategory.value;
        const searchTerm = searchInput.value.toLowerCase();

        const filteredData = allAnnouncements.filter(item => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = item.title.toLowerCase().includes(searchTerm) || 
                                  item.snippet.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });

        displayAnnouncements(filteredData);
    }

    // 3. Render the List to the DOM
    function displayAnnouncements(items) {
        announcementsList.innerHTML = ''; // Clear previous content

        if (items.length === 0) {
            announcementsList.innerHTML = '<p class="empty-message">No announcements found matching your criteria.</p>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('article');
            card.className = 'content-card announcement';
            
            // Link to the detail page with the item type and ID from the database
            const detailLink = `detail.html?type=announcement&id=${item.announcement_id}`; 
            
            card.innerHTML = `
                <span class="category-tag ${item.category}">${item.category.toUpperCase()}</span>
                <h3>${item.title}</h3>
                <div class="card-meta">
                    Date Posted: ${new Date(item.date_posted).toLocaleDateString()}
                </div>
                <p>${item.snippet}</p>
                <a href="${detailLink}" class="read-more-link">Read More →</a>
            `;
            announcementsList.appendChild(card);
        });
    }

    // 4. Attach Event Listeners for Filters
    filterCategory.addEventListener('change', handleFilteringAndDisplay);
    searchInput.addEventListener('input', handleFilteringAndDisplay);

    // Initial load of data
    fetchAnnouncements();
});
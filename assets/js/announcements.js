document.addEventListener('DOMContentLoaded', () => {
    // API_BASE_URL is defined in assets/js/main.js
<<<<<<< HEAD
    const announcementsList = document.getElementById('full-announcement-list');
    const filterCategory = document.getElementById('filter-category');
    const searchInput = document.getElementById('search-input');
    const loadingMessage = document.getElementById('loading-message');
    const noResults = document.getElementById('no-results');
    
    let allAnnouncements = []; // Stores the raw data from the API

    // Parse URL params for global search
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('search')) {
        searchInput.value = urlParams.get('search');
    }
    if (urlParams.has('category')) {
        filterCategory.value = urlParams.get('category');
    }

    // 1. Fetch Data from Backend API
    async function fetchAnnouncements() {
        if (loadingMessage) loadingMessage.style.display = 'flex';
        if (noResults) noResults.style.display = 'none';
=======
    const announcementsList = document.getElementById('announcements-list');
    const filterCategory = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    
    let allAnnouncements = []; // Stores the raw data from the API

    // 1. Fetch Data from Backend API
    async function fetchAnnouncements() {
        announcementsList.innerHTML = '<p>Loading announcements...</p>';
>>>>>>> 5e48155f277d6e7aaee71554a605c108578a52f3

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
<<<<<<< HEAD
            if (loadingMessage) loadingMessage.style.display = 'none';
            announcementsList.innerHTML += '<p class="error-message">Failed to load announcements. Please check server status.</p>';
=======
            announcementsList.innerHTML = '<p class="error-message">Failed to load announcements. Please check server status.</p>';
>>>>>>> 5e48155f277d6e7aaee71554a605c108578a52f3
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
<<<<<<< HEAD
        // Clear previous content but keep the loading/no-results paragraphs by selecting only articles
        const existingArticles = announcementsList.querySelectorAll('article');
        existingArticles.forEach(a => a.remove());
        const errorMsgs = announcementsList.querySelectorAll('.error-message');
        errorMsgs.forEach(e => e.remove());

        if (loadingMessage) loadingMessage.style.display = 'none';

        if (items.length === 0) {
            if (noResults) noResults.style.display = 'block';
            return;
        } else {
            if (noResults) noResults.style.display = 'none';
=======
        announcementsList.innerHTML = ''; // Clear previous content

        if (items.length === 0) {
            announcementsList.innerHTML = '<p class="empty-message">No announcements found matching your criteria.</p>';
            return;
>>>>>>> 5e48155f277d6e7aaee71554a605c108578a52f3
        }

        items.forEach(item => {
            const card = document.createElement('article');
<<<<<<< HEAD
            card.className = 'full-notice-card';
            card.setAttribute('data-category', item.category);
            card.setAttribute('data-id', item.announcement_id);
            
            const detailLink = `detail.html?type=announcement&id=${item.announcement_id}`; 
            const categoryClass = item.category ? item.category.toLowerCase() : 'general';
            
            card.innerHTML = `
                <div class="card-header">
                    <h2>${item.title}</h2>
                    <span class="category-tag ${categoryClass}">${item.category.toUpperCase()}</span>
                </div>
                <div class="card-meta">
                    <span class="date"><i class="fa-regular fa-calendar"></i> Posted: ${new Date(item.date_posted).toLocaleDateString()}</span>
                    <span class="author"><i class="fa-regular fa-user"></i> ${item.author || 'Admin'}</span>
                </div>
                <div class="card-snippet">
                    <p>${item.snippet}</p>
                </div>
                <a href="${detailLink}" class="read-more-link">Read Full Notice →</a>
=======
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
>>>>>>> 5e48155f277d6e7aaee71554a605c108578a52f3
            `;
            announcementsList.appendChild(card);
        });
    }

    // 4. Attach Event Listeners for Filters
<<<<<<< HEAD
    if (filterCategory) filterCategory.addEventListener('change', handleFilteringAndDisplay);
    if (searchInput) searchInput.addEventListener('input', handleFilteringAndDisplay);
=======
    filterCategory.addEventListener('change', handleFilteringAndDisplay);
    searchInput.addEventListener('input', handleFilteringAndDisplay);
>>>>>>> 5e48155f277d6e7aaee71554a605c108578a52f3

    // Initial load of data
    fetchAnnouncements();
});
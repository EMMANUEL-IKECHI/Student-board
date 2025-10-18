document.addEventListener('DOMContentLoaded', () => {
    // API_BASE_URL is defined globally in main.js (e.g., http://localhost:8080/api)
    const archiveList = document.getElementById('archive-list');
    const filterType = document.getElementById('archive-filter-type');
    const searchInput = document.getElementById('archive-search');

    let allArchiveData = []; // Stores the combined data from the API

    // 1. Fetch Combined Archive Data from Backend API
    async function fetchArchive() {
        archiveList.innerHTML = '<p>Loading departmental archive...</p>';

        try {
            // CALL: GET /api/archive (Public endpoint that combines archived announcements and events)
            const response = await fetch(`${API_BASE_URL}/archive`);
            
            if (!response.ok) {
                throw new Error('Failed to load departmental archive.');
            }

            allArchiveData = await response.json(); 
            
            // Handle initial filtering and display
            handleFilteringAndDisplay(); 

        } catch (error) {
            console.error('Error fetching archive:', error);
            archiveList.innerHTML = '<p class="error-message">Failed to load the archive. Please check server status.</p>';
        }
    }

    // 2. Handle Client-Side Filtering and Search
    function handleFilteringAndDisplay() {
        const selectedType = filterType.value;
        const searchTerm = searchInput.value.toLowerCase();

        const filteredData = allArchiveData.filter(item => {
            // Filter by type ('announcement' or 'event') and by search term
            const matchesType = selectedType === 'all' || item.type === selectedType;
            const matchesSearch = item.title.toLowerCase().includes(searchTerm);
            return matchesType && matchesSearch;
        });

        displayArchive(filteredData);
    }

    // 3. Render the Archive List to the DOM
    function displayArchive(items) {
        archiveList.innerHTML = ''; // Clear previous content

        if (items.length === 0) {
            archiveList.innerHTML = '<p class="empty-message">No archived items found matching your criteria.</p>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('article');
            card.className = 'content-card archived';
            
            // Construct the detail link using the original item's ref_id and type
            const detailLink = `detail.html?type=${item.type}&id=${item.ref_id}`; 
            
            // Use the combined data structure from the API call (ref_id, type, title, date)
            const metaInfo = item.type === 'announcement' 
                             ? 'Notice Category: N/A' // Category isn't fetched on archive for simplicity
                             : 'Event Location: N/A';

            card.innerHTML = `
                <span class="archived-tag">ARCHIVED | ${item.type.toUpperCase()}</span>
                <h3>${item.title}</h3>
                <div class="card-meta">
                    ${metaInfo} | Date Archived: ${new Date(item.date).toLocaleDateString()}
                </div>
                <p>This item was archived automatically or manually.</p>
                <a href="${detailLink}" class="read-more-link">View Original Record →</a>
            `;
            archiveList.appendChild(card);
        });
    }

    // 4. Attach Event Listeners
    filterType.addEventListener('change', handleFilteringAndDisplay);
    searchInput.addEventListener('input', handleFilteringAndDisplay);

    // Initial load of data
    fetchArchive();
});
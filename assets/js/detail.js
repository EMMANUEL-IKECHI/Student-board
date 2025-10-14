document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the URL parameters (item_type and id)
    const urlParams = new URLSearchParams(window.location.search);
    const itemType = urlParams.get('type'); // e.g., 'announcement' or 'event'
    const itemId = parseInt(urlParams.get('id')); // e.g., 1 or 101

    // Elements
    const detailTitleEl = document.getElementById('detail-title');
    const detailMetaEl = document.getElementById('detail-meta');
    const detailBodyEl = document.getElementById('detail-body');
    const eventInfoEl = document.getElementById('event-specific-info');
    const errorEl = document.getElementById('error-message');
    const loadingEl = document.getElementById('loading-indicator');

    // Ensure we have necessary parameters
    if (!itemType || !itemId) {
        loadingEl.style.display = 'none';
        errorEl.textContent = 'Error: Missing type or ID in URL.';
        errorEl.style.display = 'block';
        document.getElementById('page-title').textContent = 'Error';
        return;
    }

    // 2. Fetch the corresponding item data (Simulated API Call)
    let item;
    let listData;

    if (itemType === 'announcement') {
        // Assume 'announcementsData' is loaded from data.js
        listData = announcementsData; 
    } else if (itemType === 'event') {
        // Assume 'eventsData' is loaded from data.js
        listData = eventsData;
    } else {
        loadingEl.style.display = 'none';
        errorEl.textContent = `Error: Invalid item type (${itemType}).`;
        errorEl.style.display = 'block';
        return;
    }

    // Find the item in the mock data
    item = listData.find(i => i.id === itemId);

    // 3. Render the content if found
    if (item) {
        loadingEl.style.display = 'none';
        
        // Set basic title and page title
        detailTitleEl.textContent = item.title;
        document.getElementById('page-title').textContent = item.title;
        
        // Populate Meta Data
        if (itemType === 'announcement') {
            detailMetaEl.innerHTML = `
                <p>
                    **Category:** <span class="category-tag ${item.category}">${item.category.toUpperCase()}</span> |
                    **Posted By:** **${item.author}** |
                    **Date:** ${item.date}
                </p>
            `;
            // For full announcements, we'll use a placeholder for full text
            detailBodyEl.innerHTML = `
                <p>${item.snippet}</p>
                <p>The full content of this **${item.category}** notice is displayed here. In a live system, this would be the detailed multi-paragraph body text fetched from the database, not just the snippet.</p>
                <p>Please ensure all students comply with the directives contained within this notice before the deadline.</p>
            `;

        } else if (itemType === 'event') {
            detailMetaEl.innerHTML = `
                <p>
                    **Date:** **${item.date}** |
                    **Time:** **${item.time}** |
                    **Location:** **${item.location}**
                </p>
            `;
            detailBodyEl.innerHTML = `
                <p>${item.snippet}</p>
                <p>This section provides the comprehensive description of the **${item.title}**. It would include agenda items, required attendance, expected outcomes, and any required registration links.</p>
                <p>The event is mandatory for all final-year students.</p>
            `;
            
            // Event Specific Info (e.g., location link)
            eventInfoEl.innerHTML = `
                <p>Find the location on Google Maps: <a href="#" target="_blank">View Map for ${item.location}</a></p>
            `;
        }

    } else {
        // Item not found error
        loadingEl.style.display = 'none';
        errorEl.textContent = `Error: ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} with ID ${itemId} not found.`;
        errorEl.style.display = 'block';
        document.getElementById('page-title').textContent = 'Item Not Found';
    }
});
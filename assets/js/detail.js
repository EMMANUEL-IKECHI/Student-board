document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the URL parameters (item_type and id)
    const urlParams = new URLSearchParams(window.location.search);
    const itemType = urlParams.get('type'); 
    const itemId = urlParams.get('id'); // ID is now a string/number from DB

    // ... (Elements remain the same)
    const detailTitleEl = document.getElementById('detail-title');
    const detailMetaEl = document.getElementById('detail-meta');
    const detailBodyEl = document.getElementById('detail-body');
    const eventInfoEl = document.getElementById('event-specific-info');
    const errorEl = document.getElementById('error-message');
    const loadingEl = document.getElementById('loading-indicator');

    if (!itemType || !itemId) {
        // ... (Error handling remains the same)
        return;
    }

    // 2. Define the API endpoint based on type
    const endpoint = `${API_BASE_URL}/${itemType}s/${itemId}`; // e.g., /api/announcements/1

    // 3. Fetch the data from the live API
    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                // Throw error if 404 Not Found or other server issues
                throw new Error('Item not found or server error');
            }
            return response.json();
        })
        .then(item => {
            loadingEl.style.display = 'none';
            
            // Set basic title and page title
            detailTitleEl.textContent = item.title;
            document.getElementById('page-title').textContent = item.title;

            // Populate Meta Data
            if (itemType === 'announcement') {
                detailMetaEl.innerHTML = `
                    <p>
                        **Category:** <span class="category-tag ${item.category}">${item.category.toUpperCase()}</span> |
                        **Date:** ${new Date(item.date_posted).toLocaleDateString()}
                    </p>
                `;
                detailBodyEl.innerHTML = `<p>${item.content}</p>`; // Use 'content' from DB
            } else if (itemType === 'event') {
                detailMetaEl.innerHTML = `
                    <p>
                        **Date:** **${item.event_date}** |
                        **Time:** **${item.event_time}** |
                        **Location:** **${item.location}**
                    </p>
                `;
                detailBodyEl.innerHTML = `<p>${item.description}</p>`; // Use 'description' from DB
                
                eventInfoEl.innerHTML = `<p>Find the location: ${item.location}</p>`;
            }
        })
        .catch(error => {
            console.error('Fetch detail error:', error);
            loadingEl.style.display = 'none';
            errorEl.textContent = `Error: ${error.message}. Item not found or connection failed.`;
            errorEl.style.display = 'block';
        });
});
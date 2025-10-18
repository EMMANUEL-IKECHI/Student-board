document.addEventListener('DOMContentLoaded', () => {
    // API_BASE_URL is assumed to be defined globally in main.js (e.g., http://localhost:8080/api)
    const eventsList = document.getElementById('events-list');
    const searchInput = document.getElementById('event-search');
    
    let allEvents = []; // Stores the raw data from the API

    // 1. Fetch Data from Backend API
    async function fetchEvents() {
        eventsList.innerHTML = '<p>Loading events calendar...</p>';

        try {
            // CALL: GET /api/events (Public endpoint for upcoming events)
            const response = await fetch(`${API_BASE_URL}/events`);
            
            if (!response.ok) {
                throw new Error('Failed to load upcoming events.');
            }

            allEvents = await response.json(); 
            
            // Display initial searched list
            handleSearchingAndDisplay(); 

        } catch (error) {
            console.error('Error fetching events:', error);
            eventsList.innerHTML = '<p class="error-message">Failed to load events calendar. Please check server status.</p>';
        }
    }

    // 2. Handle Client-Side Searching
    function handleSearchingAndDisplay() {
        const searchTerm = searchInput.value.toLowerCase();

        const filteredData = allEvents.filter(item => {
            // Search by title, snippet, or location
            return item.title.toLowerCase().includes(searchTerm) || 
                   item.snippet.toLowerCase().includes(searchTerm) ||
                   item.location.toLowerCase().includes(searchTerm);
        });

        displayEvents(filteredData);
    }

    // 3. Render the Event List to the DOM
    function displayEvents(items) {
        eventsList.innerHTML = ''; // Clear previous content

        if (items.length === 0) {
            eventsList.innerHTML = '<p class="empty-message">No upcoming events found.</p>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('article');
            card.className = 'content-card event';
            
            // Format date for better readability
            const formattedDate = new Date(item.event_date).toLocaleDateString('en-GB', { 
                weekday: 'short', month: 'short', day: 'numeric' 
            });

            // Link to the detail page with the item type and ID from the database
            const detailLink = `detail.html?type=event&id=${item.event_id}`; 
            
            card.innerHTML = `
                <span class="event-date-tag">${formattedDate}</span>
                <h3>${item.title}</h3>
                <div class="card-meta">
                    Time: ${item.event_time || 'N/A'} | Location: ${item.location}
                </div>
                <p>${item.snippet}</p>
                <a href="${detailLink}" class="read-more-link">View Event Details →</a>
            `;
            eventsList.appendChild(card);
        });
    }

    // 4. Attach Event Listeners for Search
    searchInput.addEventListener('input', handleSearchingAndDisplay);

    // Initial load of data
    fetchEvents();
});
document.addEventListener('DOMContentLoaded', () => {
    // API_BASE_URL is assumed to be defined globally in main.js (e.g., http://localhost:8080/api)
    const eventsList = document.getElementById('events-list');
<<<<<<< HEAD
    const searchInput = document.getElementById('event-search-input');
=======
    const searchInput = document.getElementById('event-search');
>>>>>>> 5e48155f277d6e7aaee71554a605c108578a52f3
    
    let allEvents = []; // Stores the raw data from the API

    // 1. Fetch Data from Backend API
    async function fetchEvents() {
<<<<<<< HEAD
        if (eventsList) eventsList.innerHTML = '<div class="loading-container"><div class="spinner"></div><p>Loading events calendar...</p></div>';
=======
        eventsList.innerHTML = '<p>Loading events calendar...</p>';
>>>>>>> 5e48155f277d6e7aaee71554a605c108578a52f3

        try {
            // CALL: GET /api/events (Public endpoint for upcoming events)
            const response = await fetch(`${API_BASE_URL}/events`);
            
            if (!response.ok) {
                throw new Error('Failed to load upcoming events.');
            }

            allEvents = await response.json(); 
            
            // Display initial searched list
<<<<<<< HEAD
            handleSearchingAndDisplay();
            renderCalendar(); 

        } catch (error) {
            console.error('Error fetching events:', error);
            if (eventsList) eventsList.innerHTML = '<p class="error-message">Failed to load events calendar. Please check server status.</p>';
=======
            handleSearchingAndDisplay(); 

        } catch (error) {
            console.error('Error fetching events:', error);
            eventsList.innerHTML = '<p class="error-message">Failed to load events calendar. Please check server status.</p>';
>>>>>>> 5e48155f277d6e7aaee71554a605c108578a52f3
        }
    }

    // 2. Handle Client-Side Searching
    function handleSearchingAndDisplay() {
<<<<<<< HEAD
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
=======
        const searchTerm = searchInput.value.toLowerCase();
>>>>>>> 5e48155f277d6e7aaee71554a605c108578a52f3

        const filteredData = allEvents.filter(item => {
            // Search by title, snippet, or location
            return item.title.toLowerCase().includes(searchTerm) || 
                   item.snippet.toLowerCase().includes(searchTerm) ||
                   item.location.toLowerCase().includes(searchTerm);
        });

        displayEvents(filteredData);
    }

<<<<<<< HEAD
    // Expose for the button click in HTML
    window.performEventSearch = handleSearchingAndDisplay;

    // 3. Render the Event List to the DOM
    function displayEvents(items) {
        if (!eventsList) return;
=======
    // 3. Render the Event List to the DOM
    function displayEvents(items) {
>>>>>>> 5e48155f277d6e7aaee71554a605c108578a52f3
        eventsList.innerHTML = ''; // Clear previous content

        if (items.length === 0) {
            eventsList.innerHTML = '<p class="empty-message">No upcoming events found.</p>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('article');
<<<<<<< HEAD
            card.className = 'event-card';
            
            const dateObj = new Date(item.event_date);
            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = dateObj.toLocaleString('en-GB', { month: 'short' }).toUpperCase();
            
            const detailLink = `detail.html?type=event&id=${item.event_id}`; 
            
            card.innerHTML = `
                <div class="event-date-box">
                    <span class="month">${month}</span>
                    <span class="day">${day}</span>
                </div>
                <div class="event-details">
                    <h3>${item.title}</h3>
                    <div class="time-location">
                        <span><i class="fa-regular fa-clock"></i> ${item.event_time || 'N/A'}</span> | 
                        <span><i class="fa-solid fa-thumbtack"></i> ${item.location}</span>
                    </div>
                    <p>${item.snippet}</p>
                </div>
                <a href="${detailLink}" class="details-link">Event Details →</a>
=======
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
>>>>>>> 5e48155f277d6e7aaee71554a605c108578a52f3
            `;
            eventsList.appendChild(card);
        });
    }

    // 4. Attach Event Listeners for Search
<<<<<<< HEAD
    if (searchInput) searchInput.addEventListener('input', handleSearchingAndDisplay);

    // Initial load of data
    fetchEvents();
    // Calendar Widget Logic
    let currentDate = new Date();
    
    function renderCalendar() {
        const monthYear = document.getElementById('month-year');
        const grid = document.getElementById('calendar-grid');
        if (!monthYear || !grid) return;
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        monthYear.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        grid.innerHTML = '';
        
        // Empty slots
        for (let i = 0; i < firstDay; i++) {
            grid.innerHTML += '<div class="calendar-cell empty"></div>';
        }
        
        // Days
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            
            // Check if there are events on this date
            const eventsOnDate = allEvents.filter(e => e.event_date.startsWith(dateStr));
            const hasEventClass = eventsOnDate.length > 0 ? 'has-event' : '';
            const titleAttr = eventsOnDate.length > 0 ? `title="${eventsOnDate.map(e => e.title).join(', ')}"` : '';
            
            grid.innerHTML += `<div class="calendar-cell ${hasEventClass}" ${titleAttr} data-date="${dateStr}">${i}</div>`;
        }
        
        // Add click listeners to event days
        document.querySelectorAll('.calendar-cell.has-event').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const date = e.target.getAttribute('data-date');
                if (searchInput) {
                    searchInput.value = date;
                    handleSearchingAndDisplay();
                }
            });
        });
    }

    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

});
=======
    searchInput.addEventListener('input', handleSearchingAndDisplay);

    // Initial load of data
    fetchEvents();
});
>>>>>>> 5e48155f277d6e7aaee71554a605c108578a52f3

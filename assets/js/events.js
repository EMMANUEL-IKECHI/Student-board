document.addEventListener('DOMContentLoaded', () => {
    // API_BASE_URL is assumed to be defined globally in main.js (e.g., http://localhost:8080/api)
    const eventsList = document.getElementById('events-list');
    const searchInput = document.getElementById('event-search-input');
    
    let allEvents = []; // Stores the raw data from the API

    // 1. Fetch Data from Backend API
    async function fetchEvents() {
        if (eventsList) eventsList.innerHTML = '<div class="loading-container"><div class="spinner"></div><p>Loading events calendar...</p></div>';

        try {
            // CALL: GET /api/events (Public endpoint for upcoming events)
            const response = await fetch(`${API_BASE_URL}/events`);
            
            if (!response.ok) {
                throw new Error('Failed to load upcoming events.');
            }

            allEvents = await response.json(); 
            
            // Display initial searched list
            handleSearchingAndDisplay();
            renderCalendar(); 

        } catch (error) {
            console.error('Error fetching events:', error);
            if (eventsList) eventsList.innerHTML = '<p class="error-message">Failed to load events calendar. Please check server status.</p>';
        }
    }

    // 2. Handle Client-Side Searching
    function handleSearchingAndDisplay() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        const filteredData = allEvents.filter(item => {
            // Search by title, snippet, or location
            return item.title.toLowerCase().includes(searchTerm) || 
                   item.snippet.toLowerCase().includes(searchTerm) ||
                   item.location.toLowerCase().includes(searchTerm);
        });

        displayEvents(filteredData);
    }

    // Expose for the button click in HTML
    window.performEventSearch = handleSearchingAndDisplay;

    // 3. Render the Event List to the DOM
    function displayEvents(items) {
        if (!eventsList) return;
        eventsList.innerHTML = ''; // Clear previous content

        if (items.length === 0) {
            eventsList.innerHTML = '<p class="empty-message">No upcoming events found.</p>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('article');
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
            `;
            eventsList.appendChild(card);
        });
    }

    // 4. Attach Event Listeners for Search
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

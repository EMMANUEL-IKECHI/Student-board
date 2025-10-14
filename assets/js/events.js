document.addEventListener('DOMContentLoaded', () => {
    // Check if the events list container exists before running
    if (document.getElementById('events-list')) {
        // Initial render of events
        renderEvents(getUpcomingEvents());
    }

    // Function to handle the search/filter on the events page
    window.performEventSearch = function() {
        const searchInput = document.getElementById('event-search-input').value.toLowerCase();
        const list = getUpcomingEvents(); // Get all active events
        
        const filteredList = list.filter(event => {
            const titleMatch = event.title.toLowerCase().includes(searchInput);
            const locationMatch = event.location.toLowerCase().includes(searchInput);

            return titleMatch || locationMatch;
        });

        renderEvents(filteredList);
    }
});

/**
 * Dynamically renders the list of events onto the page.
 */
function renderEvents(events) {
    const listContainer = document.getElementById('events-list');
    listContainer.innerHTML = ''; // Clear existing content

    if (events.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; padding: 20px;">No upcoming events match your criteria.</p>';
        return;
    }

    events.forEach(event => {
        // Split date for display: e.g., "2025-10-25" -> "OCT", "25"
        const eventDate = new Date(event.date);
        const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
        const day = eventDate.getDate();

        const cardHTML = `
            <article class="event-card" data-event-id="${event.id}">
                <div class="event-date-box">
                    <span class="month">${month}</span>
                    <span class="day">${day}</span>
                </div>
                <div class="event-details">
                    <h3>${event.title}</h3>
                    <p class="time-location">⏰ ${event.time} | 📍 ${event.location}</p>
                    <p class="snippet">${event.snippet}</p>
                </div>
                <a href="event-detail.html?id=${event.id}" class="details-link">Details →</a>
            </article>
        `;
        listContainer.innerHTML += cardHTML;
    });
}
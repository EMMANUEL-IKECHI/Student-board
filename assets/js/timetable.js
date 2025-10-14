document.addEventListener('DOMContentLoaded', () => {
    // Check if the timetable list container exists before running
    if (document.getElementById('timetable-list')) {
        // Initial render of all timetables
        renderTimetables(getActiveTimetables());
    }

    // Function to handle the filtering on the timetables page
    window.performTimetableFilter = function() {
        const filterLevel = document.getElementById('filter-level').value;
        const filterType = document.getElementById('filter-type').value;
        const list = getActiveTimetables();
        
        const filteredList = list.filter(timetable => {
            const levelMatch = filterLevel === 'all' || timetable.level === filterLevel;
            const typeMatch = filterType === 'all' || timetable.type === filterType;

            return levelMatch && typeMatch;
        });

        renderTimetables(filteredList);
    }
});

/**
 * Dynamically renders the list of timetables onto the page.
 */
function renderTimetables(timetables) {
    const listContainer = document.getElementById('timetable-list');
    listContainer.innerHTML = ''; // Clear existing content

    const noResults = document.getElementById('no-timetable-results');
    if (timetables.length === 0) {
        noResults.style.display = 'block';
        listContainer.appendChild(noResults);
        return;
    } else {
        noResults.style.display = 'none';
    }

    timetables.forEach(timetable => {
        const icon = timetable.type === 'exam' ? '📜' : '📄';
        
        const cardHTML = `
            <article class="timetable-card" data-level="${timetable.level}" data-type="${timetable.type}">
                <div class="file-icon">
                    <span class="material-icons">${icon}</span>
                </div>
                <div class="timetable-info">
                    <h2>${timetable.title}</h2>
                    <p class="meta">
                        <span>🗓️ **Type:** ${timetable.type.charAt(0).toUpperCase() + timetable.type.slice(1)} Roster</span> |
                        <span>🏷️ **Level:** ${timetable.level}</span> |
                        <span>📅 **Last Updated:** ${timetable.updated_date}</span>
                    </p>
                    <p class="description">${timetable.description}</p>
                </div>
                <div class="timetable-actions">
                    <a href="${timetable.file_url}" target="_blank" class="view-btn">View/Download PDF</a>
                </div>
            </article>
        `;
        listContainer.innerHTML += cardHTML;
    });
}
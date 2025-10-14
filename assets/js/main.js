document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // 2. Placeholder for Search/Filter functionality (requires backend/data)
    document.addEventListener('DOMContentLoaded', () => {
    // ... (Existing Mobile Menu Toggle and Set Current Year logic) ...

    // New logic to handle the full announcement list page
    if (document.getElementById('full-announcement-list')) {
        renderAnnouncements(getActiveAnnouncements());
    }

    // 2. Search/Filter functionality
    window.performSearchAndFilter = function() {
        const searchInput = document.getElementById('search-input').value.toLowerCase();
        const filterCategory = document.getElementById('filter-category').value;
        const list = getActiveAnnouncements();
        
        const filteredList = list.filter(announcement => {
            const titleMatch = announcement.title.toLowerCase().includes(searchInput);
            const categoryMatch = filterCategory === 'all' || announcement.category === filterCategory;

            return titleMatch && categoryMatch;
        });

        renderAnnouncements(filteredList);
    }
});

/**
 * Renders the list of announcements onto the page.
 * NOTE: You will eventually replace this with code that fetches from your Node.js API.
 */
function renderAnnouncements(announcements) {
    const listContainer = document.getElementById('full-announcement-list');
    const loadingMessage = document.getElementById('loading-message');
    const noResults = document.getElementById('no-results');

    // Clear previous content
    listContainer.innerHTML = '';
    if (loadingMessage) loadingMessage.style.display = 'none';

    if (announcements.length === 0) {
        noResults.style.display = 'block';
        listContainer.appendChild(noResults);
        return;
    } else if (noResults) {
        noResults.style.display = 'none';
    }

    announcements.forEach(announcement => {
        const categoryClass = announcement.category.toLowerCase();
        
        const cardHTML = `
            <article class="full-notice-card" data-category="${categoryClass}" data-id="${announcement.id}">
                <div class="card-header">
                    <h2>${announcement.title}</h2>
                    <span class="category-tag ${categoryClass}">${announcement.category}</span>
                </div>
                <div class="card-meta">
                    <span class="date">📅 Posted: ${announcement.date}</span>
                    <span class="author">👤 ${announcement.author}</span>
                </div>
                <div class="card-snippet">
                    <p>${announcement.snippet}</p>
                </div>
                <a href="notice-detail.html?id=${announcement.id}" class="read-more-link">Read Full Notice →</a>
            </article>
        `;
        listContainer.innerHTML += cardHTML;
    });
}

    // 3. Set Current Year in Footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});
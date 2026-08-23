// Use your local port during development
// const API_BASE_URL = 'http://localhost:8080/api'; 

// When deployed to Render, change this to:
const API_BASE_URL = 'https://student-board-backend-9f3a.onrender.com/api';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // 2. Set Current Year in Footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // 3. Homepage Logic (Fetching latest announcements and events)
    if (document.getElementById('announcements-list') && document.getElementById('events-preview')) {
        loadHomepageData();
    }
});

// Global Search Functionality for Homepage
window.performSearch = function() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('filter-category');
    
    if (!searchInput) return;

    const query = searchInput.value.trim();
    const category = categoryFilter ? categoryFilter.value : '';

    // Redirect to announcements page with search query
    let url = `announcements.html?search=${encodeURIComponent(query)}`;
    if (category) {
        url += `&category=${encodeURIComponent(category)}`;
    }
    window.location.href = url;
};

// Fetch and render data for the homepage
async function loadHomepageData() {
    const announcementsContainer = document.getElementById('announcements-list');
    const eventsContainer = document.getElementById('events-preview');

    // Fetch Announcements
    try {
        const annRes = await fetch(`${API_BASE_URL}/announcements`);
        if (annRes.ok) {
            const announcements = await annRes.json();
            renderHomepageAnnouncements(announcementsContainer, announcements.slice(0, 3)); // Top 3
        } else {
            announcementsContainer.innerHTML = '<p class="error-message">Failed to load announcements.</p>';
        }
    } catch (err) {
        console.error('Error fetching announcements:', err);
        announcementsContainer.innerHTML = '<p class="error-message">Server unavailable. Check connection.</p>';
    }

    // Fetch Events
    try {
        const eventsRes = await fetch(`${API_BASE_URL}/events`);
        if (eventsRes.ok) {
            const events = await eventsRes.json();
            renderHomepageEvents(eventsContainer, events.slice(0, 3)); // Top 3
        } else {
            eventsContainer.innerHTML = '<p class="error-message">Failed to load events.</p>';
        }
    } catch (err) {
        console.error('Error fetching events:', err);
        eventsContainer.innerHTML = '<p class="error-message">Server unavailable. Check connection.</p>';
    }
}

function renderHomepageAnnouncements(container, announcements) {
    container.innerHTML = '';
    if (announcements.length === 0) {
        container.innerHTML = '<p>No recent announcements.</p>';
        return;
    }

    announcements.forEach(ann => {
        const cardHTML = `
            <article class="notice-card">
                <h3>${ann.title}</h3>
                <p class="date">Posted: ${new Date(ann.date_posted).toLocaleDateString()} | Category: ${ann.category}</p>
                <p>${ann.snippet}</p>
                <a href="detail.html?type=announcement&id=${ann.announcement_id}" class="read-more">Read More</a>
            </article>
        `;
        container.innerHTML += cardHTML;
    });
}

function renderHomepageEvents(container, events) {
    container.innerHTML = '';
    if (events.length === 0) {
        container.innerHTML = '<p>No upcoming events.</p>';
        return;
    }

    events.forEach(event => {
        const dateObj = new Date(event.event_date);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = dateObj.toLocaleString('en-GB', { month: 'short' });

        const eventHTML = `
            <div class="event-card" style="margin-bottom:15px; border-left-color: var(--accent-color);">
                <div class="event-date-box">
                    <span class="month">${month.toUpperCase()}</span>
                    <span class="day">${day}</span>
                </div>
                <div class="event-details">
                    <h3>${event.title}</h3>
                    <div class="time-location" style="font-size:0.85em; color:#666; margin-bottom:5px;">
                        <span><i class="fa-regular fa-clock"></i> ${event.event_time || 'N/A'}</span> | 
                        <span><i class="fa-solid fa-thumbtack"></i> ${event.location || 'N/A'}</span>
                    </div>
                </div>
                <a href="detail.html?type=event&id=${event.event_id}" class="details-link" style="margin-left:auto;">View →</a>
            </div>
        `;
        container.innerHTML += eventHTML;
    });
}

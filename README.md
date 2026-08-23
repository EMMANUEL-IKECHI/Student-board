# Departmental Student Information Board

A modern, responsive, and fully functional web application designed to serve as the central information hub for university students (specifically built for the CIT department, FUTO). The platform allows students to easily access the latest announcements, interactive event calendars, and official timetables. 

This repository contains the **Frontend** of the application. It connects to a RESTful Node.js/PostgreSQL backend for dynamic data fetching.

---

## 🌟 Features

### 🎓 Student View (Public)
*   **Announcements Board**: Read the latest academic, general, and administrative notices in real-time.
*   **Interactive Events Calendar**: View upcoming departmental events, seminars, and activities with a dynamic calendar widget. Clicking on a date filters events.
*   **Official Timetables**: Quickly access and download the most current semester timetables.
*   **Archive System**: Browse past announcements, events, and timetables safely stored for reference.
*   **Modern UI/UX**: Sleek, fully responsive design using CSS variables, glassmorphism headers, and smooth transitions tailored to a university's brand colors (FUTO Emerald and Yellow).

### 🔒 Admin Dashboard (Protected)
*   **Secure Authentication**: JWT-based login system for authorized department administrators.
*   **Content Management System (CMS)**:
    *   **Manage Announcements**: Create, edit, and archive announcements.
    *   **Manage Events**: Schedule new events or modify existing ones; updates reflect instantly on the interactive calendar.
    *   **Manage Timetables**: Upload direct links to new timetables. Old timetables are automatically archived.

---

## 🛠️ Tech Stack

*   **HTML5 & CSS3**: Semantic markup and modern styling (Flexbox/Grid, CSS Variables, responsive media queries).
*   **Vanilla JavaScript (ES6+)**: Handles all client-side logic, DOM manipulation, asynchronous data fetching (`fetch` API), and interactive components (like the custom calendar widget).
*   **FontAwesome 6**: Scalable vector icons for a polished and professional look.

---

## 📁 Project Structure

```text
Student-board-main/
│
├── index.html                 # Homepage with latest notices & events
├── announcements.html         # Full announcements list
├── events.html                # Interactive events calendar
├── timetable.html             # Current & archived timetables
├── archive.html               # Archives for old notices/events
├── detail.html                # Dynamic detail view for specific items
│
├── admin-login.html           # Secure admin login portal
├── admin-dashboard.html       # Admin landing page
├── admin-announcements.html   # CMS for announcements
├── admin-events.html          # CMS for events
├── admin-timetables.html      # CMS for timetables
│
└── assets/
    ├── css/
    │   ├── style.css          # Global styles, variables, widgets, animations
    │   └── responsive.css     # Media queries for mobile/tablet optimization
    ├── images/
    │   └── logo.png           # Department/University Logo
    └── js/
        ├── main.js                  # Global logic & API config
        ├── announcements.js         # Fetch/render public announcements
        ├── events.js                # Render interactive calendar & events
        ├── archive.js               # Render archived items
        ├── timetable.js             # Render public timetables
        ├── admin-login.js           # JWT auth handling
        ├── admin-announcements.js   # Admin CRUD operations
        ├── admin-events.js          # Admin CRUD operations
        └── admin-timetables.js      # Admin CRUD operations
```

---

## 🚀 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/student-board-frontend.git
cd student-board-frontend
```

### 2. Configure the Backend API
The frontend relies on a Node.js/Express backend. You must configure the API URL so the frontend knows where to fetch data.

1. Open `assets/js/main.js`.
2. Locate the `API_BASE_URL` constant at the top of the file.
3. Update it to match your backend's URL:
   *   **Local Development**: `const API_BASE_URL = 'http://localhost:8080/api';`
   *   **Production**: `const API_BASE_URL = 'https://your-production-backend.com/api';`

### 3. Run the Application
Since this project uses Vanilla JS, HTML, and CSS without a build step (like Webpack or Vite), you can serve it directly using any lightweight development server.

*   **Using VS Code Live Server extension**: Right-click on `index.html` and select "Open with Live Server".
*   **Using Node/npx**:
    ```bash
    npx serve .
    ```
*   **Using Python**:
    ```bash
    python -m http.server 8000
    ```

Navigate to `http://localhost:8000` (or your respective port) in your browser.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).

const announcementsData = [
    {
        id: 1,
        title: "Final Exam Script Collection Schedule",
        snippet: "The collection of final year exam scripts for 300-level students will commence on November 1st. Please adhere strictly to the schedule posted below.",
        category: "academic",
        date: "2025-10-14",
        author: "HOD's Office",
        status: "active"
    },
    {
        id: 2,
        title: "Mandatory Departmental Town Hall",
        snippet: "All students are required to attend the Town Hall meeting to discuss the new departmental facilities and course registration issues.",
        category: "general",
        date: "2025-10-10",
        author: "CIT Welfare Committee",
        status: "active"
    },
    {
        id: 3,
        title: "New Course Registration Deadline",
        snippet: "The final deadline for all outstanding course registrations has been moved to October 30th. No further extensions will be granted.",
        category: "academic",
        date: "2025-10-05",
        author: "Academic Secretary",
        status: "active"
    },
    {
        id: 4,
        title: "Staff Office Relocation Notice",
        snippet: "Please note that the department administrative staff have been relocated to the new annex building. Student inquiries should be directed to the new location.",
        category: "admin",
        date: "2025-09-28",
        author: "Department Head",
        status: "active"
    }
];

// ... (Existing announcementsData array) ...

const eventsData = [
    {
        id: 101,
        title: "Departmental Career Seminar",
        snippet: "Guest speakers from major tech firms will discuss career pathways and industry requirements.",
        date: "2025-10-25",
        time: "10:00 AM",
        location: "ICT Auditorium",
        status: "upcoming"
    },
    {
        id: 102,
        title: "CIT Student Debate Finals",
        snippet: "The final round of the inter-level debate competition. All students are encouraged to attend.",
        date: "2025-11-03",
        time: "2:00 PM",
        location: "FUTO Senate Hall",
        status: "upcoming"
    },
    {
        id: 103,
        title: "Year 3 Induction Ceremony",
        snippet: "Mandatory induction for all third-year students entering the project stage.",
        date: "2025-11-15",
        time: "9:00 AM",
        location: "Lecture Hall A",
        status: "upcoming"
    }
];

// New function to simulate fetching upcoming events
function getUpcomingEvents() {
    // Sort events by date for the "Upcoming" list view
    return eventsData
        .filter(e => e.status === 'upcoming')
        .sort((a, b) => new Date(a.date) - new Date(b.date));
}

// ... (Existing announcementsData and eventsData arrays) ...

const timetablesData = [
    {
        id: 201,
        title: "300 Level Second Semester Class Schedule",
        description: "The final approved class schedule for all 300-level courses this semester.",
        level: "300",
        type: "class",
        updated_date: "2025-10-01",
        file_url: "assets/files/300-class-timetable.pdf", // Link to mock file
        status: "active"
    },
    {
        id: 202,
        title: "400 Level First Semester Examination Roster",
        description: "Contains dates, times, and halls for all scheduled 400-level examinations.",
        level: "400",
        type: "exam",
        updated_date: "2025-09-15",
        file_url: "assets/files/400-exam-timetable.pdf",
        status: "active"
    },
    {
        id: 203,
        title: "100 Level Class Schedule - Tentative",
        description: "The preliminary class schedule for the current 100-level students. Subject to change.",
        level: "100",
        type: "class",
        updated_date: "2025-10-12",
        file_url: "assets/files/100-class-timetable.pdf",
        status: "active"
    }
];

// New function to simulate fetching active timetables
function getActiveTimetables() {
    return timetablesData.filter(t => t.status === 'active');
}

// This function would be used to simulate fetching data
function getActiveAnnouncements() {
    return announcementsData.filter(a => a.status === 'active');
}
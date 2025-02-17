import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiClient from "../../utils/apiClient"; // Import instancji Axios
import "./CalendarPage.css";

function CalendarPage() {
    const { user } = useContext(AuthContext);
    const [schedule, setSchedule] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());

    if (!user) {
        return <div>Please log in to see your calendar.</div>;
    }

    useEffect(() => {
        if (!user || !user.id) {
            console.error("User ID is missing or invalid:", user);
            return;
        }
        const fetchSchedule = async () => {
            if (!user || !user.id) {
                console.error("User is not available");
                return;
            }

            try {
                const response = await apiClient.get(`/api/events/participants/${user.id}`);
                const events = response.data; // Odczyt danych z odpowiedzi

                // Grupowanie wydarzeń na podstawie dat
                const groupedEvents = events.reduce((acc, event) => {
                    if (event.startDatetime) {
                        const localDate = new Date(event.startDatetime);
                        localDate.setDate(localDate.getDate() - 1);
                        const date = localDate.toLocaleDateString("en-CA");
                        if (!acc[date]) {
                            acc[date] = [];
                        }
                        const time = localDate.toTimeString().split(" ")[0];
                        acc[date].push(`${event.name} - ${time}`);
                    }
                    return acc;
                }, {});

                setSchedule(groupedEvents);
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };

        if (user && user.id) {
            fetchSchedule();
        }
    }, [user, currentDate]);

    const changeMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const generateCalendarDays = () => {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const daysInMonth = [];
        const startDay = firstDayOfMonth.getDay();

        for (let i = 0; i < startDay; i++) {
            daysInMonth.push(null);
        }

        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            daysInMonth.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        }

        return daysInMonth;
    };

    const days = generateCalendarDays();

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={() => changeMonth(-1)} className="calendar-button">
                    &lt;
                </button>
                <h2>
                    {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
                </h2>
                <button onClick={() => changeMonth(1)} className="calendar-button">
                    &gt;
                </button>
            </div>
            <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="calendar-day-header">
                        {day}
                    </div>
                ))}
                {days.map((date, index) => (
                    <div key={index} className={`calendar-cell ${date ? "" : "empty-cell"}`}>
                        {date && (
                            <>
                                <div className="calendar-date">{date.getDate()}</div>
                                <div className="calendar-events">
                                    {(schedule[date.toISOString().split("T")[0]] || []).map((event, idx) => (
                                        <div key={idx} className="calendar-event">
                                            {event}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CalendarPage;

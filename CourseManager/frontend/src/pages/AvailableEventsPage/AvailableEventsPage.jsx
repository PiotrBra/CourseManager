import { useState, useEffect, useContext } from "react";
import "./AvailableEventsPage.css";
import CourseCard_2 from "../../components/CourseCard_2/CourseCard_2.jsx";
import { AuthContext } from "../../context/AuthContext";
import apiClient from "../../utils/apiClient";

function AvailableEventsPage() {
    const { user } = useContext(AuthContext); // Pobieramy dane użytkownika z kontekstu
    const [events, setEvents] = useState([]);
    const [tags, setTags] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Pobranie danych wydarzeń i tagów z backendu
                const [eventsResponse, tagsResponse] = await Promise.all([
                    apiClient.get("/api/events"),
                    apiClient.get("/api/tags"),
                ]);

                // Ustawienie wydarzeń
                setEvents(eventsResponse.data);

                // Mapowanie tagów na obiekt { id: nazwa }
                const tagsMap = tagsResponse.data.reduce((acc, tag) => {
                    acc[tag.id] = tag.name;
                    return acc;
                }, {});
                setTags(tagsMap);

                // Wyczyszczenie błędów, jeśli wszystko się uda
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load events or tags. Please try again later.");
            }
        };

        fetchData();
    }, []);

    return (
        <div className="AvailableCourses-container">
            <h1>Available Events</h1>
            {user && (
                <h2 className="welcome-message">
                    Witaj {user.firstname} {user.surname}!
                </h2>
            )}
            {error && <p className="error-message">{error}</p>}
            <div className="AvailableCourses-cards-container">
                {events.length > 0 ? (
                    events.map((event) => (
                        <CourseCard_2
                            key={event.id}
                            id={event.id}
                            title={event.name}
                            description={event.info}
                            organizer={event.organizerName}
                            classroom={event.classroomName}
                            startDatetime={event.startDatetime}
                            endDatetime={event.endDatetime}
                            tags={event.tagIds.map((id) => tags[id]).filter(Boolean)}
                        />
                    ))
                ) : (
                    <p>No events available.</p>
                )}
            </div>
        </div>
    );
}

export default AvailableEventsPage;

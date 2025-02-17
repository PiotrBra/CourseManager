import React, { useContext, useEffect, useState } from "react";
import "./MyEventsPage.css";
import { AuthContext } from "../../context/AuthContext";
import apiClient from "../../utils/apiClient";

function MyEventsPage() {
    const { user } = useContext(AuthContext); // Pobieramy dane użytkownika z kontekstu
    const [pastEvents, setPastEvents] = useState([]);
    const [futureEvents, setFutureEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user?.id) {
            console.error("Brakuje ID użytkownika.");
            return;
        }

        const fetchEvents = async () => {
            try {
                // Pobieranie przeszłych i przyszłych wydarzeń
                const [pastRes, futureRes] = await Promise.all([
                    apiClient.get(`/api/events/participants/${user.id}/past`),
                    apiClient.get(`/api/events/participants/${user.id}/future`),
                ]);

                // Ustawianie danych wydarzeń
                setPastEvents(pastRes.data);
                setFutureEvents(futureRes.data);
                setError(null);
            } catch (err) {
                console.error("Błąd podczas pobierania wydarzeń:", err);
                setError("Nie udało się załadować danych wydarzeń.");
            }
        };

        fetchEvents();
    }, [user]);

    return (
        <div className="MyCourses-container">
            <h1 className="MyCourses-greeting">
                Witaj {user?.firstname} {user?.surname}!
            </h1>

            {/* Sekcja przeszłych wydarzeń */}
            <div className="MyCourses-section">
                <h2>Wydarzenia, w których wziąłeś udział:</h2>
                <div className="MyCourses-list">
                    {error ? (
                        <p className="error-message">{error}</p>
                    ) : pastEvents.length > 0 ? (
                        pastEvents.map((event) => (
                            <div key={event.id} className="event-details">
                                <h2>{event.name}</h2>
                                <p><strong>Data rozpoczęcia:</strong> {event.startDatetime}</p>
                                <p><strong>Data zakończenia:</strong> {event.endDatetime}</p>
                                <p><strong>Maksymalna liczba uczestników:</strong> {event.maxParticipants}</p>
                                <p><strong>Minimalny wiek:</strong> {event.minAge}</p>
                                <p><strong>Opis:</strong> {event.info}</p>
                                <p><strong>Organizator:</strong> {event.organizerName}</p>
                                <p><strong>Sala:</strong> {event.classroomName}</p>
                                <p><strong>Tagi:</strong> {event.tagIds?.join(", ")}</p>
                            </div>
                        ))
                    ) : (
                        <p>Nie brałeś udziału w żadnych wydarzeniach.</p>
                    )}
                </div>
            </div>

            {/* Sekcja przyszłych wydarzeń */}
            <div className="MyCourses-section">
                <h2>Twoje nadchodzące wydarzenia:</h2>
                <div className="MyCourses-list">
                    {error ? (
                        <p className="error-message">{error}</p>
                    ) : futureEvents.length > 0 ? (
                        futureEvents.map((event) => (
                            <div key={event.id} className="event-details">
                                <h2>{event.name}</h2>
                                <p><strong>Data rozpoczęcia:</strong> {event.startDatetime}</p>
                                <p><strong>Data zakończenia:</strong> {event.endDatetime}</p>
                                <p><strong>Maksymalna liczba uczestników:</strong> {event.maxParticipants}</p>
                                <p><strong>Minimalny wiek:</strong> {event.minAge}</p>
                                <p><strong>Opis:</strong> {event.info}</p>
                                <p><strong>Organizator:</strong> {event.organizerName}</p>
                                <p><strong>Sala:</strong> {event.classroomName}</p>
                                <p><strong>Tagi:</strong> {event.tagIds?.join(", ")}</p>
                            </div>
                        ))
                    ) : (
                        <p>Nie jesteś zapisany na żadne nadchodzące wydarzenie.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyEventsPage;

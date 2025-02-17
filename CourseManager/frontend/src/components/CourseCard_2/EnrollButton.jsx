import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import apiClient from '../../utils/apiClient';

const EnrollButton = ({ eventId }) => {
    const { user } = useContext(AuthContext); // Pobieranie zalogowanego użytkownika z kontekstu
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false); // Dodajemy stan do sprawdzania zapisu

    useEffect(() => {
        // Sprawdzanie, czy użytkownik już zapisał się na to wydarzenie
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
        if (enrolledCourses.includes(eventId)) {
            setIsEnrolled(true); // Jeśli tak, ustawiamy stan
        }
    }, [eventId]);

    useEffect(() => {
        if (!user) {
            console.error("User is not logged in!");
            return;
        }
    }, [user]);

    const handleEnroll = async () => {
        console.log("User from AuthContext:", user);
        const userId = user?.id || user?.userId;
        if (!userId) {
            alert("Nie można pobrać identyfikatora użytkownika.");
            return;
        }

        if (!user) {
            alert("Musisz być zalogowany, aby zapisać się na wydarzenie.");
            return;
        }

        if (isEnrolled) {
            alert("Jesteś już zapisany na to wydarzenie!");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Wysyłanie zapytania POST do endpointa, używając `apiClient`
            const response = await apiClient.post(`/api/events/${eventId}/enroll/${userId}`);
            alert(response.data.message || "Zapisano na wydarzenie!"); // Wyświetl komunikat z odpowiedzi

            // Dodanie kursu do zapisanych w localStorage
            const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
            enrolledCourses.push(eventId);
            localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));

            // Ustawienie stanu po zapisaniu
            setIsEnrolled(true);
        } catch (err) {
            console.error("Error during enrollment:", err);
            setError(err.response?.data?.message || "Wystąpił problem z zapisaniem na wydarzenie.");
            // Obsługa błędów
            if (err.response) {
                setError(err.response.data.message || "Błąd serwera.");
            } else {
                setError("Wystąpił problem z połączeniem.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button
                className="card__enroll-button"
                onClick={handleEnroll}
                disabled={loading || isEnrolled || !user}
            >
                {loading ? 'Zapisuję...' : isEnrolled ? 'Jesteś zapisany' : 'Zapisz na wydarzenie'}
            </button>
        </div>
    );
};

export default EnrollButton;

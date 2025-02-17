import React, { useContext, useState } from "react";
import "./ProfilePage.css";
import { AuthContext } from "../../context/AuthContext";
import EditUsersForm from "../../components/EditUsersForm/EditUsersForm.jsx";
import EditPassword from "./EditPassword.jsx"; // Import komponentu do zmiany hasła
import axios from "axios";
import blankAvatar from "./blank_avatar.png";
import apiClient from "../../utils/apiClient";

function ProfilePage() {
    const { user, login } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Funkcja do ponownego pobrania danych użytkownika po zapisie
    const fetchUserData = async () => {
        if (!user || !user.id) return;
        setLoading(true);

        try {
            const response = await apiClient.get(`/api/users/${user.id}`);
            login(response.data); // Aktualizacja użytkownika w AuthContext
        } catch (error) {
            console.error("Błąd podczas ponownego pobierania danych użytkownika:", error);
            alert("Nie udało się odświeżyć danych użytkownika.");
        } finally {
            setLoading(false);
        }
    };


    // Funkcja wywoływana po zapisaniu zmian w profilu
    const handleSaveProfile = async () => {
        alert("Zmiany zostały zapisane.");
        await fetchUserData();
        setIsEditing(false);
    };

    // Funkcja wywoływana po zapisaniu zmiany hasła
    const handlePasswordChange = async () => {
        alert("Hasło zostało zmienione.");
        setIsChangingPassword(false);
    };

    if (!user) {
        return (
            <div className="profile-container">
                <p>Please log in to view your profile.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="profile-container">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {/* Widok podglądu profilu */}
            {!isEditing && !isChangingPassword && (
                <div className="profile-card">
                    <div className="profile-header">
                        <img src={blankAvatar} alt="Blank Avatar" className="blank-avatar" />
                        <h2 className="profile-name">
                            {user.firstname && user.surname
                                ? `${user.firstname} ${user.surname}`
                                : "Anonymous User"}
                        </h2>
                    </div>
                    <div className="profile-details">
                        <div className="profile-row">
                            <span className="profile-label">Email:</span>
                            <span className="profile-value">{user.email || "Not Provided"}</span>
                        </div>
                        <div className="profile-row">
                            <span className="profile-label">Role:</span>
                            <span className="profile-value">
                                {user.isOrganizer ? "Organizator" : "Zwykły użytkownik"}
                            </span>
                        </div>
                    </div>
                    <div className="profile-actions">
                        <button
                            className="profile-button"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                        <button
                            className="profile-button"
                            onClick={() => setIsChangingPassword(true)}
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            )}

            {/* Widok edycji profilu */}
            {isEditing && (
                <div className="profile-card">
                    <EditUsersForm
                        user={user}
                        onCancel={() => setIsEditing(false)}
                        onSave={handleSaveProfile}
                    />
                </div>
            )}

            {/* Widok zmiany hasła */}
            {isChangingPassword && (
                <div className="profile-card">
                    <EditPassword
                        user={user}
                        onCancel={() => setIsChangingPassword(false)}
                        onSave={handlePasswordChange}
                    />
                </div>
            )}
        </div>
    );
}

export default ProfilePage;

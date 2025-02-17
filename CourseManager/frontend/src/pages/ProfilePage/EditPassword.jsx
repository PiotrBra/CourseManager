import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function EditPassword({ user, onCancel }) {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        repeatNewPassword: "", // Dodane pole
    });
    const [isSaving, setIsSaving] = useState(false);

    function customHash(password) {
        if (!password) {
            return "";
        }

        const salt = "mySalt";
        let hash = 7;

        for (let i = 0; i < password.length; i++) {
            hash = (hash * 31 + password.charCodeAt(i)) | 0;
        }
        for (let i = 0; i < salt.length; i++) {
            hash = (hash * 31 + salt.charCodeAt(i)) | 0;
        }

        return (hash >>> 0).toString(16);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // 1. WALIDACJA FRONTENDOWA

            if (formData.newPassword.length < 8) {
                alert("Nowe hasło musi zawierać co najmniej 8 znaków.");
                return;
            }

            if (formData.newPassword !== formData.repeatNewPassword) {
                alert("Nowe hasła nie są identyczne. Spróbuj ponownie.");
                return;
            }

            // 2. HASHOWANIE AKTUALNEGO HASŁA
            const hashedCurrentPassword = customHash(formData.currentPassword);

            const response = await fetch(`/api/users/email/${user.email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                alert("Nie znaleziono użytkownika o podanym adresie email.");
                return;
            }

            const userFromDb = await response.json();

            // PORÓWNANIE ZAHASHOWANEGO HASŁA
            if (userFromDb.password !== hashedCurrentPassword) {
                alert("Podane aktualne hasło jest nieprawidłowe.");
                return;
            }

            // 3. HASHOWANIE NOWEGO HASŁA PRZED WYSŁANIEM DO BAZY
            const hashedNewPassword = customHash(formData.newPassword);

            const putResponse = await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password: hashedNewPassword,
                }),
            });

            if (!putResponse.ok) {
                alert("Nie udało się zaktualizować hasła. Spróbuj ponownie.");
                return;
            }

            alert("Hasło zostało zmienione. Zaloguj się ponownie.");

            logout();
            navigate("/login");

        } catch (error) {
            console.error("Błąd podczas zmiany hasła:", error);
            alert("Wystąpił błąd. Spróbuj ponownie.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <h2>Change Password</h2>
            <p>Po zmianie hasła należy się ponownie zalogować.</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Aktualne hasło:</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        minLength={8}
                    />
                </div>

                <div>
                    <label>Nowe hasło (min. 8 znaków):</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Powtórz nowe hasło:</label>
                    <input
                        type="password"
                        name="repeatNewPassword"
                        value={formData.repeatNewPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ marginTop: "1rem" }}>
                    <button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Change Password"}
                    </button>
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditPassword;
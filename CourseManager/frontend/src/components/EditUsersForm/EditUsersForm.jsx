// EditUsersForm.jsx
import React, { useState } from "react";
import apiClient from "../../utils/apiClient";
import "./EditUsersForm.css";

function EditUsersForm({ user, onCancel, onSave }) {
    const [formData, setFormData] = useState({
        firstname: user.firstname || "",
        surname: user.surname || "",
        age: user.age || "",
        email: user.email || "",
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseInt(value, 10) || "" : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await apiClient.put(`/api/users/${user.id}`, formData); // Zmieniono na `apiClient`
            onSave(); // Wywołujemy onSave po udanym PUT
        } catch (error) {
            console.error("Błąd podczas zapisywania danych:", error);
            alert("Nie udało się zapisać zmian.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="edit-user-form-container">
            <h2 className="edit-user-form-title">Edit Profile</h2>
            <form className="edit-user-form" onSubmit={handleSubmit}>
                <div className="edit-user-form-group">
                    <label className="edit-user-form-label">First Name:</label>
                    <input
                        className="edit-user-form-input"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="edit-user-form-group">
                    <label className="edit-user-form-label">Last Name:</label>
                    <input
                        className="edit-user-form-input"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="edit-user-form-group">
                    <label className="edit-user-form-label">Age:</label>
                    <input
                        className="edit-user-form-input"
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                    />
                </div>

                <div className="edit-user-form-group">
                    <label className="edit-user-form-label">Email:</label>
                    <input
                        className="edit-user-form-input"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="edit-user-form-actions">
                    <button
                        className="edit-user-form-button"
                        type="submit"
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                        className="edit-user-form-button"
                        type="button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditUsersForm;

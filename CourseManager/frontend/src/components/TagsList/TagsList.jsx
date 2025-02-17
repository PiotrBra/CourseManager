import React, { useState, useEffect } from "react";
import "./TagsList.css";
import apiClient from "../../utils/apiClient";

function TagsList({ visible }) {
    // --- STANY KOMPONENTU ---
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [addTagVisible, setAddTagVisible] = useState(false);

    const [selectedFilters, setSelectedFilters] = useState({
        alphabetical: false,
        byUsage: false,
    });

    const [newTag, setNewTag] = useState({ name: "" });

    const [tags, setTags] = useState([]);
    const [editingTagId, setEditingTagId] = useState(null);
    const [editingTagData, setEditingTagData] = useState({ id: null, name: "" });
    const [isUpdating, setIsUpdating] = useState(false);

    // --- FUNKCJE POMOCNICZE ---

    // Pobierz wszystkie tagi z backendu
    const fetchTags = () => {
        apiClient
            .get("/api/tags")
            .then((res) => {
                setTags(res.data);
            })
            .catch((err) => {
                console.error("Błąd podczas pobierania tagów:", err);
                alert("Nie udało się pobrać listy tagów. Spróbuj ponownie.");
            });
    };

    // Załaduj tagi przy pierwszym renderze
    useEffect(() => {
        if (visible) {
            fetchTags();
        }
    }, [visible]);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const toggleAddTagForm = () => {
        setAddTagVisible(!addTagVisible);
    };

    const handleFilterChange = (filter) => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            [filter]: !prevFilters[filter],
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTag((prevTag) => ({
            ...prevTag,
            [name]: value,
        }));
    };

    const handleSearchClick = () => {
        console.log("Applying filters:", selectedFilters);
        fetchTags();
    };

    const handleAddTagSubmit = (e) => {
        e.preventDefault();

        if (!newTag.name) {
            alert("Proszę wypełnić pole nazwy tagu.");
            return;
        }

        apiClient
            .post("/api/tags", { name: newTag.name })
            .then(() => {
                alert("Tag został pomyślnie dodany!");
                setNewTag({ name: "" });
                setAddTagVisible(false);
                fetchTags();
            })
            .catch((err) => {
                console.error("Błąd podczas dodawania tagu:", err);
                alert("Nie udało się dodać tagu. Spróbuj ponownie.");
            });
    };

    const startEditing = (tag) => {
        setEditingTagId(tag.id);
        setEditingTagData({ id: tag.id, name: tag.name });
    };

    const cancelEditing = () => {
        setEditingTagId(null);
        setEditingTagData({ id: null, name: "" });
        setIsUpdating(false);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingTagData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const saveTagChanges = () => {
        setIsUpdating(true);
        apiClient
            .put(`/api/tags/${editingTagData.id}`, { name: editingTagData.name })
            .then(() => {
                alert("Zmiany zostały zapisane.");
                setIsUpdating(false);
                cancelEditing();
                fetchTags();
            })
            .catch((err) => {
                console.error("Błąd podczas zapisywania zmian:", err);
                alert("Nie udało się zapisać zmian. Spróbuj ponownie.");
                setIsUpdating(false);
            });
    };

    const deleteTag = (tagId, tagName) => {
        if (window.confirm(`Czy na pewno chcesz usunąć tag "${tagName}"?`)) {
            apiClient
                .delete(`/api/tags/${tagId}`)
                .then(() => {
                    alert("Tag został usunięty.");
                    fetchTags();
                })
                .catch((err) => {
                    console.error("Błąd podczas usuwania tagu:", err);
                    alert("Nie udało się usunąć tagu. Spróbuj ponownie.");
                });
        }
    };

    if (!visible) return null;

    let displayedTags = [...tags];
    if (selectedFilters.alphabetical) {
        displayedTags.sort((a, b) => a.name.localeCompare(b.name));
    }

    return (
        <div className="edit-tags-subsite">
            <h2 className="edit-tags-subsite__title">Edit Tags</h2>
            <div className="edit-tags-subsite__content">
                <div className="edit-tags-subsite__controls">
                    <button
                        className="edit-tags-subsite__filter-button"
                        onClick={toggleFilters}
                    >
                        {filtersVisible ? "Hide Filters" : "Filter"}
                    </button>
                    <button
                        className="edit-tags-subsite__search-button"
                        onClick={handleSearchClick}
                    >
                        Search
                    </button>
                    <button
                        className={`edit-tags-subsite__add-button ${
                            addTagVisible ? "cancel" : "add"
                        }`}
                        onClick={toggleAddTagForm}
                    >
                        {addTagVisible ? "Cancel" : "Add Tag"}
                    </button>
                </div>

                {filtersVisible && (
                    <div className="edit-tags-subsite__filters">
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedFilters.alphabetical}
                                onChange={() => handleFilterChange("alphabetical")}
                            />
                            Sort Alphabetically
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedFilters.byUsage}
                                onChange={() => handleFilterChange("byUsage")}
                            />
                            Sort by Usage
                        </label>
                    </div>
                )}

                {addTagVisible && (
                    <form
                        className="edit-tags-subsite__add-tag-form"
                        onSubmit={handleAddTagSubmit}
                    >
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={newTag.name}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <button type="submit" className="edit-tags-subsite__submit-button">
                            Submit
                        </button>
                    </form>
                )}

                <div className="edit-tags-subsite__results">
                    {displayedTags.length === 0 ? (
                        <p>No tags found.</p>
                    ) : (
                        displayedTags.map((tag) => (
                            <div key={tag.id} className="singleTag">
                                {tag.id === editingTagId ? (
                                    <div className="editMode">
                                        <h2>Edit Tag</h2>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editingTagData.name}
                                            onChange={handleEditInputChange}
                                        />
                                        <button
                                            onClick={saveTagChanges}
                                            disabled={isUpdating}
                                        >
                                            {isUpdating ? "Saving..." : "Save"}
                                        </button>
                                        <button onClick={cancelEditing}>Cancel</button>
                                    </div>
                                ) : (
                                    <div className="viewMode">
                                        <h2>{tag.name}</h2>
                                        <button onClick={() => startEditing(tag)}>Edit</button>
                                        <button onClick={() => deleteTag(tag.id, tag.name)}>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default TagsList;

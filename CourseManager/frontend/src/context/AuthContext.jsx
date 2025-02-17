// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            console.log('User loaded from localStorage:', JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        const mappedUserData = {
            ...userData,
            id: userData.userId // Tworzymy alias, aby user.id działało
        };

        setUser(mappedUserData);
        localStorage.setItem('user', JSON.stringify(mappedUserData)); // Dane użytkownika
        localStorage.setItem('authToken', mappedUserData.token); // Token
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                localStorage.setItem('authUser', JSON.stringify(user))
                setCurrentUser(user);
            } else {
                localStorage.removeItem('authUser')
                setCurrentUser(null);
            }
        });
        const userLocal = JSON.parse(localStorage.getItem('authUser'))
        const expirationTime = (userLocal?.stsTokenManager?.expirationTime * 1000) - 60000
        if (Date.now() >= expirationTime) {
            navigate("/Login")
        }
    }, [currentUser, navigate]);

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Loader from '../components/Loader';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // 'user' or 'admin'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        if (!auth) {
            if (mounted) setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (mounted) setCurrentUser(user);
            if (user && db) {
                // Fetch user role from Firestore 'users' collection
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserRole(docSnap.data().role || 'user');
                    } else {
                        // Default to standard user if no doc exists
                        setUserRole('user');
                    }
                } catch (error) {
                    console.error("Error fetching user role", error);
                    setUserRole('user');
                }
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const value = {
        currentUser,
        userRole,
        isAdmin: userRole === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <Loader fullScreen /> : children}
        </AuthContext.Provider>
    );
};

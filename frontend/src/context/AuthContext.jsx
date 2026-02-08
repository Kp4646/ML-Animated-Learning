import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signup(email, password, additionalData = {}) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // If we have additional data, save it to Firestore
        if (Object.keys(additionalData).length > 0) {
            try {
                await setDoc(doc(db, "users", user.uid), {
                    email: email,
                    ...additionalData,
                    createdAt: new Date().toISOString()
                });
                // Set user profile state immediately after signup
                setUserProfile({ email, ...additionalData });
            } catch (error) {
                console.error("Error saving user data:", error);
            }
        }

        return userCredential;
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        console.log("AuthContext: Setting up auth state listener");
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("AuthContext: Auth state changed", user ? "User logged in" : "No user");
            setCurrentUser(user);

            if (user) {
                try {
                    console.log("AuthContext: Fetching user profile for", user.uid);
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        console.log("AuthContext: Profile found");
                        setUserProfile(docSnap.data());
                    } else {
                        console.log("AuthContext: No user profile found");
                        setUserProfile(null);
                    }
                } catch (error) {
                    console.error("AuthContext: Error fetching user profile:", error);
                    setUserProfile(null);
                }
            } else {
                setUserProfile(null);
            }

            console.log("AuthContext: Setting loading to false");
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

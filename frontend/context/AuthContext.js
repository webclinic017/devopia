'use client'
import React from 'react';
import {
    onAuthStateChanged,
    getAuth,
} from 'firebase/auth';
import firebase_app from '@/firebase/config';

import { collection, query, where,getFirestore,getDocs } from "firebase/firestore";

const db = getFirestore(firebase_app)
// Create a query against the collection.

const auth = getAuth(firebase_app);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
    children,
}) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user)  => {
            if (user) {


                const citiesRef = collection(db, "users");

                const q = query(citiesRef, where("email", "==", user.email));
                console.log(q)

                const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
  setUser(doc.data());
});

                
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);



    const logout = async () => {
        console.log('heyya')
        try {
          await auth.signOut();
          setUser(null);
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };


    return (
        <AuthContext.Provider value={{ user, logout }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};
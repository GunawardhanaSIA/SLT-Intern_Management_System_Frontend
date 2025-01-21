import axios from 'axios'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react'

const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [logUser, setLogUser] = useState();

    // Function to log out the user
    const logout = (navigate) => {
        setLogUser(null);
        localStorage.removeItem('logUser');
        localStorage.removeItem('token');
        navigate('/authenticate/signin');
    }

    // Load user data from localStorage when the app loads (on refresh)
    useEffect(() => {
        const savedUser = localStorage.getItem('logUser');

        if(savedUser) {
            setLogUser(JSON.parse(savedUser));
        } else {
            setLogUser(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{logUser, setLogUser, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext
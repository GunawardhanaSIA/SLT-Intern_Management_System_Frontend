import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token) {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch(error) {
        return true; // Treat token as expired if decoding fails
    }
}

export function getRole() {
    const token = localStorage.getItem('token');

    if(token && !isTokenExpired(token)) {
        try {
            const decoded = jwtDecode(token);
            return decoded.role;
        } catch (error) {
            return null;
        }
    }
    return null;
}

export function getUserId() {
    const token = localStorage.getItem('token');

    if(token && !isTokenExpired(token)) {
        try {
            const decoded = jwtDecode(token);
            return decoded.user_id;
        } catch (error) {
            return null;
        }
    }
    return null;
}

export function isAuthenticated() {
    const token = localStorage.getItem('token');
    return token && !isTokenExpired(token);
}
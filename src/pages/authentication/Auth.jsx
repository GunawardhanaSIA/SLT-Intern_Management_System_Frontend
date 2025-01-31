export const getToken = () => {
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    const now = new Date().getTime();
  
    if (token && tokenExpiration) {
      if (now > tokenExpiration) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        return null;
      }
      return token;
    }
    return null;
};
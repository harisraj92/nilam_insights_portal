export const getToken = () => {
    return sessionStorage.getItem('auth_token');
};

export const isAuthenticated = () => {
    return !!getToken();
};

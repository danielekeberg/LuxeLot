export const apiKey = 'c621a9e6-1acf-480f-81e1-8f3ec5f1337a';
export const apiUrl = 'https://v2.api.noroff.dev';
export const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGFuaWVsZWtlYmVyZyIsImVtYWlsIjoiZGFuZWtlNzUxNjBAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3NDQ0OTQyMDR9.trSh_Oto9_FEahwMuklpy3tHXPxOq3Qxu7TknSJRwyo';
export const auth = localStorage.getItem('auth');
export const username = localStorage.getItem('username');

export function isLoggedIn() {
    const userLoggedIn = localStorage.getItem('isLoggedIn');
    if(!userLoggedIn) {
        window.location.href = '../login'
    }
}
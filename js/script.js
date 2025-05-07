import { apiUrl, apiKey, isLoggedIn, auth } from './config.js';

isLoggedIn();

function getUsername() {
    const username = localStorage.getItem('username');
    document.getElementById('username').innerHTML = `<a href="../profile/?p=${username}">${username}</a>`
}

getUsername();
import { isLoggedIn, apiUrl, apiKey, auth, username } from './config.js';

isLoggedIn();

function getUsername() {
    const username = localStorage.getItem('username');
    document.getElementById('username').innerHTML = `<a href="../profile/?p=${username}">${username}</a>`
}

getUsername();

document.querySelector('.create').title = 'Create an auction!';

async function hoverTitle() {
    try {
        const response = await fetch(`${apiUrl}/auction/profiles/${username}`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`,
            }
        });
        const data = await response.json();
        document.querySelector('.credits').title = `${username} has ${data.data.credits} credits!`;
    } catch(error) {
        console.error(error);
    }
}

hoverTitle();

function search() {
    const searchInput = document.getElementById('searchInput').value;
    window.location.href = `../search/?q=${searchInput}`;
}

document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        search();
    }
})
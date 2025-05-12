import { apiUrl, apiKey, auth } from './config.js';
const params = new URLSearchParams(window.location.search);
const q = params.get('q');

async function searchUsers() {
    try {
        const response = await fetch(`${apiUrl}/auction/profiles/search?q=${q}`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`,
            }
        });
        const data = await response.json();
        const user = data.data;
        const errors = data.errors;
        if(errors) {
            errors.forEach(error => {
                document.getElementById('users').innerHTML = `
                <h3>${error.message}</h3>`;
                console.log(error.message);
            })
        } else {
            console.log(user);
            user.forEach(users => {
                const d = document.createElement('a');
                d.href = `../profile/?p=${users.name}`
                d.className = 'card';
                d.innerHTML = `
                <img src="${users.avatar.url}">
                <div class="card-title">
                    <h3>${users.name}</h3>
                </div>
                `;
                document.getElementById('users').appendChild(d);
            })
        }
    } catch(error) {
        console.error(error);
    }
}

async function searchListings() {
    try {
        const response = await fetch(`${apiUrl}/auction/listings/search?q=${q}`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`,
            }
        });
        const data = await response.json();
        const user = data.data;
        const errors = data.errors;
        if(errors) {
            errors.forEach(error => {
                document.getElementById('users').innerHTML = `
                <h3>${error.message}</h3>`;
                console.log(error.message);
            })
        } else {
            console.log(user);
            user.forEach(users => {
                const d = document.createElement('a');
                d.href = `../profile/?p=${users.name}`
                d.className = 'card';
                d.innerHTML = `
                <img src="${users.avatar.url}">
                <div class="card-title">
                    <h3>${users.name}</h3>
                </div>
                `;
                document.getElementById('users').appendChild(d);
            })
        }
    } catch(error) {
        console.error(error);
    }
}


searchUsers();
searchListings();
import { apiUrl, apiKey, auth } from './config.js';

function isLoggedIn() {
    const userLoggedIn = localStorage.getItem('isLoggedIn');
    if(!userLoggedIn) {
        window.location.href = './login'
    }
}

isLoggedIn();

async function fetchAll() {
    try {
        const response = await fetch(`${apiUrl}/auction/listings?&_tag=LuxeLot&_active=true`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
            }
        });
        const data = await response.json();
        const item = data.data;
        console.log(item);

        item.forEach(item => {
            const d = document.createElement('a');
            d.className = 'item';
            d.href = `./listing/?i=${item.id}`;
            d.innerHTML = `
            <div class="card">
                 <img src="${item.media[0].url}">
                 <div class="card-title">
                    <h3>${item.title}</h3>
                    <p>Bids: 29</p>
                 </div>
            </div>
            `;

            document.getElementById('listings').appendChild(d);
            console.log(response);
        })

    } catch(err) {
        console.log(err);
    }
}

fetchAll();

document.getElementById('rolex').addEventListener('click', fetchAll);

function hamburger() {
    const d = document.createElement('div');
    d.className = 'dropdown';
    d.innerHTML = `
    <a href="./?1">Profile</a>
    <a href="./?2">Create Auction</a>
    <a href="./?3">Logout</a>
    `;
    document.getElementById('hamburger').appendChild(d);
}

// document.getElementById('hamburger').addEventListener('click', hamburger);

const tempUsername = localStorage.getItem('username');

function getUsername() {
    document.getElementById('username').textContent = tempUsername;
}

getUsername();

document.getElementById('username').addEventListener('click', () => {
    window.location.href = `./profile/?q=${tempUsername}`;
});
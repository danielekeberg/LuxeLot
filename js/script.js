import { apiUrl, apiKey, auth } from './config.js';

async function fetchAll() {
    try {
        const response = await fetch(`${apiUrl}/auction/listings?_active=true`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
            }
        });
        const data = await response.json();
        const item = data.data;
        console.log(item);

        item.forEach(item => {
            const endTime = new Date(item.endsAt);
            const now = new Date();

            const diffsInMs = endTime - now;

            const totalSeconds = Math.floor(diffsInMs / 1000);
            const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
            const minutes = String(Math.floor(totalSeconds / 3600) / 60).padStart(2, '0');
            const seconds = String(totalSeconds % 60).padStart(2, '0');


            const d = document.createElement('a');
            d.className = 'item';
            d.href = `./listing/?i=${item.id}`;
            d.innerHTML = `
            <div class="item-img">
                <img src="${item.media[0].url}">
                <div class="time-left">
                    <p>${hours}:${minutes}:${seconds}</p>
                </div>
            </div>
            <div class="item-title">
                <h3>${item.title}</h3>
                <h4>CB: 300</h4>
            </div>
            `;

            document.getElementById('listings').appendChild(d);
        })

    } catch(err) {
        console.log(err);
    }
}

fetchAll();

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

document.getElementById('hamburger').addEventListener('click', hamburger);

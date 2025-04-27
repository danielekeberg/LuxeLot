import { apiUrl, auth } from './config.js';

const params = new URLSearchParams(window.location.search);
const id = params.get('i');

async function fetchListing() {
    try {
        const response = await fetch(`${apiUrl}/auction/listings/${id}?_bids=true&_seller=true`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
            }
        });
        const data = await response.json();
        console.log(data);
        document.getElementById('listed').innerHTML = `
        <img src="${data.data.media[0].url};">
        <div class="">
            <h1>${data.data.name}</h1>
            <p>${data.data._count.bids}</p>
        </div>
        <p id="timeLeft">0</p>
        `;
    } catch(err) {
        console.error(err);
    }
}

fetchListing();

async function timeLeft() {
    try {
        const response = await fetch(`${apiUrl}/auction/listings/${id}`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
            }
        });
        const data = await response.json();
        const endTime = new Date(data.data.endsAt);
        const now = new Date();
        const diffsInMs = endTime - now;
        const totalSeconds = Math.floor(diffsInMs / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor(totalSeconds / 3600) / 60).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        document.getElementById('timeLeft').textContent = `${hours}:${minutes}:${seconds}`
    } catch(err) {
        console.error(err);
    }
}

// timeLeft();
// setInterval(timeLeft, 1000)
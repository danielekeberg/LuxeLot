import { apiUrl, auth } from './config.js';

const params = new URLSearchParams(window.location.search);
const id = params.get('i');

async function fetchListing() {
    try {
        const response = await fetch(`${apiUrl}/auction/listings/${id}`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
            }
        });
        const data = await response.json();
        console.log(data);
        document.getElementById('listed').innerHTML = `
        <h1>${data.data.title}</h1>
        <img src="${data.data.media[0].url}">
        `;
    } catch(err) {
        console.error(err);
    }
}

fetchListing();
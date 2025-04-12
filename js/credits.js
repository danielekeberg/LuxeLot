import { apiKey, apiUrl, auth } from './config.js';

async function fetchCredits() {
    const username = localStorage.getItem('username');
    try {
        const response = await fetch(`${apiUrl}/auction/profiles/${username}`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`
            }
        });
        const data = await response.json();
        console.log(`${data.data.name} has ${data.data.credits} credits!`);
        document.getElementById('credits').textContent = data.data.credits;
    } catch(err) {
        console.error(err);
    }
}

fetchCredits();
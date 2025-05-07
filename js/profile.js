import { apiUrl, auth, apiKey } from './config.js';

const params = new URLSearchParams(window.location.search);
const user = params.get('p');

async function fetchProfile() {
    try {
        const response = await fetch(`${apiUrl}/auction/profiles/${user}`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-KEY': apiKey,
            }
        });
        if(!response.ok) {
            throw new Error(error);
        }
        const data = await response.json();
        console.log(data);
        document.getElementById('profilePicture').src = data.data.avatar.url;
        document.getElementById('profilePicture').alt = data.data.avatar.alt;

        document.getElementById('banner').src = data.data.banner.url;
        document.getElementById('banner').alt = data.data.banner.alt;

        document.getElementById('pUsername').textContent = data.data.name;

        document.getElementById('pDesc').textContent = data.data.bio;

        document.getElementById('totalListings').textContent = data.data._count.listings;
        document.getElementById('totalWins').textContent = data.data._count.wins;
        document.getElementById('totalCredits').textContent = data.data.credits;
    } catch(error) {
        console.error(error);
    }
}

fetchProfile();
// document.body.addEventListener('keypress', (e) => {
//     if(e.key === 'Enter') {
//         fetchProfile();
//     }
// });
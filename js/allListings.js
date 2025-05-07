import { apiUrl } from './config.js';

async function fetchListings() {
    try {
        const response = await fetch(`${apiUrl}/auction/listings?_tag=Test&_active=true`);
        const data = await response.json();
        const item = data.data;
        console.log(data);
        if(!response.ok) {
            data.forEach(data => {
                console.log(data.errors)
            })
        } else {
            item.forEach(item => {
                const d = document.createElement('a');
                d.className = 'item';
                d.href = `./listing/?i=${item.id}`;
                d.innerHTML = `
                <div class="card">
                     <img src="${item.media[0].url}">
                     <div class="card-title">
                        <h3>${item.title}</h3>
                        <p>${item._count.bids} bids</p>
                     </div>
                </div>
                `;
    
                document.getElementById('listings').appendChild(d);
            })
        }
    } catch(error) {
        console.error(error);
    }
}

fetchListings();
// document.body.addEventListener('keypress', (e) => {
//     if(e.key === 'Enter') {
//         fetchListings();
//     }
// });
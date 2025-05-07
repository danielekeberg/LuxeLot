import { apiUrl, apiKey, auth } from './config.js';

const params = new URLSearchParams(window.location.search);
const id = params.get('i');

async function fetchListing() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = `<h1>LOADING</h1>`
    document.body.appendChild(loading);
    try {
        const response = await fetch(`${apiUrl}/auction/listings/${id}?_bids=true&_seller=true`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
            }
        });
        const data = await response.json();
        console.log(data);
        const bidLength = data.data.bids.length;
        // document.getElementById('listed').innerHTML = `
        // <img src="${data.data.media[0].url};">
        // <div class="">
        //     <h1>${data.data.title}</h1>
        //     <p>Current bids: ${data.data._count.bids}</p>
        //     <p>${data.data.description ? data.data.description : 'This item does not have a description.'}</p>
        //     <p>Current bid: <span id="currentBid"></span></p>
        // </div>
        // `;

        const ending = data.data.endsAt;
        const date = new Date(ending)

        document.getElementById('title').textContent = data.data.title;
        document.getElementById('desc').textContent = data.data.description;
        document.getElementById('currentBid').textContent = data.data._count.bids;
        document.getElementById('itemImage').src = data.data.media[0].url;
        document.getElementById('endsAt').textContent = date.toLocaleString();

        if(!data.data.bids[bidLength-1]

        ) {
            console.log(data.data.bids)
            console.log('Ingen bids')
            document.getElementById('currentBid').textContent = 'No bids';

        } else {
            console.log(data.data.bids)
            console.log('bids')
            document.getElementById('currentBid').textContent = data.data.bids[bidLength-1].amount;
        }
        
        // document.getElementById('currentBid').textContent = currentBids;
        moreItems(data.data.seller.name)
        document.body.removeChild(loading);
    } catch(err) {
        console.error(err);
    }
}

fetchListing();
// document.body.addEventListener('keydown', (e) => {
//     if(e.key === 'Enter') {
//         fetchListing();
//     }
// })

async function moreItems(name) {
    try {
        const response = await fetch(`${apiUrl}/auction/profiles/${name}/listings`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`,
            }
        });
        const data = await response.json();

        if(!response.ok) {
            console.log(data.errors[0].message)
        }
        const items = data.data;
        console.log(data);
        items.forEach(item => {
            const d = document.createElement('a');
            d.className = 'aosdijasdo';
            d.href = `./?i=${item.id}`
            d.innerHTML = `
            <h1>${item.title}</h1>
            `;
            document.getElementById('moreItems').appendChild(d);
        });
    } catch(error) {
        console.error(error);
    }
}

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
import { apiUrl, apiKey, auth } from './config.js';

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
        const errors = data.errors;
        if(errors) {
            console.log('erroooor ');
            return;
        }
        console.log(data);
        const bidLength = data.data.bids.length;

        const ending = data.data.endsAt;
        const date = new Date(ending)

        document.getElementById('title').textContent = data.data.title;
        document.getElementById('desc').textContent = data.data.description;
        document.getElementById('currentBid').textContent = data.data._count.bids;
        document.getElementById('itemImage').src = data.data.media[0].url;
        document.getElementById('endsAt').textContent = date.toLocaleString();

        if(!data.data.bids[bidLength-1]) {
            console.log(data.data.bids)
            console.log('Ingen bids')
            document.getElementById('currentBid').textContent = 'No bids';

        } else {
            console.log(data.data.bids[bidLength-1])
            console.log(bidLength);
            document.getElementById('currentBid').textContent = data.data.bids[bidLength-1].amount;
        }
        
        document.getElementById('currentBids').textContent = bidLength;
        moreItems(data.data.seller.name)

        const bidInput = document.getElementById('bidInput').value;
        console.log(bidInput)
        document.getElementById('bidSubmit').addEventListener('click', () => {
            bid(data.data.id);
            document.getElementById('currentBid').textContent = data.data.bids[bidLength-1].amount;
        })
        document.getElementById('bidInput').addEventListener('keydown', (e) => {
            if(e.key === 'Enter') {
                bid(data.data.id);
            }
        })
        
    } catch(err) {
        console.error(err);
    }
}

fetchListing();

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

async function bid(id) {
    const bidInput = Number(document.getElementById('bidInput').value);
    try {
        const response = await fetch(`${apiUrl}/auction/listings/${id}/bids`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`,
            },
            body: JSON.stringify({ amount: bidInput }),
        });
        console.log(bidInput);
        const data = await response.json();
        const error = data.errors;
        if(!response.ok) {
            error.forEach(error => {
                // console.log(error);
                document.getElementById('error').style.opacity = 1;
                document.getElementById('error').textContent = error.message;
                setTimeout(() => {
                    document.getElementById('error').style.opacity = 0;
                }, 3000)
            })
            console.log(error);
        } else {
            console.log('Your bid of ' + bidInput + ' credits were accepted!');
            document.getElementById('bidInput').textContent = '';
            updateBalance();
            updateBids();
        }

        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

async function updateBids() {
    try {
        const response = await fetch(`${apiUrl}/auction/listings/${id}?_bids=true`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
            }
        })
        if(!response.ok) {
            throw new Error('Noe har skjedd: ' + error)
        }
        const data = await response.json();
        const bidLength = data.data.bids.length;
        console.log(data.data.bids[(bidLength-1)].amount);
        document.getElementById('currentBid').textContent = data.data.bids[(bidLength-1)].amount;
        document.getElementById('currentBids').textContent = bidLength;
    } catch(error) {
        console.error(error);
    }
}

async function updateBalance() {
    const getUsername = localStorage.getItem('username');
    try {
        const response = await fetch(`${apiUrl}/auction/profiles/${getUsername}`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`
            }
        })
        if(!response.ok) {
            throw new Error(`Error fetching ${getUsername}s balace! ` + error)
        }

        const data = await response.json();
        document.getElementById('credits').textContent = data.data.credits;
    } catch(error) {
        console.error(error);
    }
}

async function deleteListing() {
    try {
        const response = await fetch(`${apiUrl}/auction/listings/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`,
            }
        })
        const data = await response.json();
        if(!response.ok) {
            console.log('Error deleting list');
            console.error(data);
        } else {
            console.log('Success!');
        }
    } catch(error) {
        console.error(error);
    }
}

document.body.addEventListener('keypress', (e) => {
    if(e.key === 'd') {
        deleteListing();
    }
})
import { apiUrl, apiKey, auth, username } from './config.js';

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
        if(username === data.data.seller.name) {
            document.getElementById('hamburger').style.display = 'block';
            document.querySelector('.bid').style.display = 'none';
        }

        if(!response.ok) {
            console.log(data);
            return;
        } 
        const bidLength = data.data.bids.length;
        const allBids = data.data.bids;

        const ending = data.data.endsAt;
        const date = new Date(ending)
        const now = new Date();
        const hasEnded = now > date;

        document.getElementById('title').textContent = data.data.title;
        document.getElementById('desc').textContent = data.data.description;
        document.getElementById('currentBid').textContent = data.data._count.bids;
        document.getElementById('itemImage').src = data.data.media[0].url;
        document.getElementById('endsAt').textContent = hasEnded ? `Winner: ${data.data.bids[(bidLength-1)].bidder.name}` : `Ends: ${date.toLocaleString()}`;

        const getUser = data.data.seller.name;
        moreItems(getUser);

        if(!data.data.bids[bidLength-1]) {
            document.getElementById('currentBid').textContent = 'No bids';
        } else {
            document.getElementById('currentBid').textContent = data.data.bids[bidLength-1].amount;
            allBids.forEach(bid => {
                const bidTime = new Date(bid.created)
                const d = document.createElement('div');
                d.className = 'bidder';
                d.innerHTML = `
                    <div class="amount">
                        <img src="../assets/coin.svg">
                        <p>${bid.amount}</p>
                    </div>
                    <a href="../profile/?p=${bid.bidder.name}" id="bidder">${bid.bidder.name}</a>
                    <p>${bidTime.toLocaleString('en-GB', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
                    `;

                document.getElementById('bids').appendChild(d);
            })
        }
        
        document.getElementById('currentBids').textContent = bidLength;

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

        const sorted = data.data.sort((b, a) => new Date(b.created) - new Date(a.created));
        const lastThree = sorted.slice(0, 3);

        const container = document.getElementById('moreItemsContainer');
        container.innerHTML = '';

        document.getElementById('moreItemsUser').textContent = name;
        document.getElementById('moreItemsUser').href = `../profile/?p=${name}`;

        lastThree.forEach(item => {
            const d = document.createElement('a');
            d.className = 'item';
            d.href = `../listing/?i=${item.id}`;
            d.innerHTML = `
            <div class="card">
                 <img src="${item.media[0].url}">
                 <div class="card-title">
                    <h3>${item.title}</h3>
                    <p>${item._count.bids} bids</p>
                 </div>
            </div>
            `;
            document.getElementById('moreItemsContainer').appendChild(d);
        });
    } catch(error) {
        console.error(error);
    }
}

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
        const data = await response.json();
        const error = data.errors;
        if(!response.ok) {
            error.forEach(error => {
                document.getElementById('error').style.opacity = 1;
                document.getElementById('error').textContent = error.message;
                setTimeout(() => {
                    document.getElementById('error').style.opacity = 0;
                }, 3000)
            })
            console.log(error);
        } else {
            document.getElementById('bidInput').textContent = '';
            updateBalance();
            updateBids();
        }
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
        
        if(response.ok) {
            return window.location.href = '../';
        } else {
            const data = await response.json();
            alert(data.errors[0].message);
            return;
        }
    } catch(error) {
        console.error(error);
    }
}

async function edit() {
    const title = document.getElementById('newTitle').value;
    const desc = document.getElementById('newDesc').value;
    const img = document.getElementById('newImgUrl').value;

    const body = {
        title: `${title}`,
        description: `${desc}`,
        media: [{
            url: `${img}`,
            alt: `${title}`
        }]
    };

    try {
        const response = await fetch(`${apiUrl}/auction/listings/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        if(!response.ok) {
            const data = await response.json();
            console.warn(data);
        } else {
            window.location.reload();
        }
    } catch(error) {
        console.error(error);
    }
}

async function editListing() {
    try {
        const response = await fetch(`${apiUrl}/auction/listings/${id}`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`,
            }
        })
        const data = await response.json();
        if(!response.ok) {
            throw new Error(data)
        } else {
            const d = document.createElement('div');
            d.className = 'edit-profile';
            d.innerHTML = `
            <div class="edit-form">
                <input type="text" placeholder="Title" id="newTitle">
                <input type="text" placeholder="Description" id="newDesc">
                <input type="text" placeholder="Image URL" id="newImgUrl">
            </div>
            <div class="edit-btn">
                <button id="editProfile">Save changes</button>
            </div>
            `;
            
            document.getElementById('editInput').appendChild(d);

            document.getElementById('newTitle').value = data.data.title;
            document.getElementById('newDesc').value = data.data.description;
            document.getElementById('newImgUrl').value = data.data.media[0].url;

            document.getElementById('editProfile').addEventListener('click', edit);
        }
    } catch(error) {
        console.error(error);
    }
}

function hamburger() {
    if(document.querySelector('.hamburger')) {
        return document.querySelector('.hamburger').remove();
    }
    const d = document.createElement('div');
    d.className = 'hamburger';
    d.innerHTML = `
    <p id="edit">Edit</p>
    <p id="delete">Delete</p>
    `;
    document.querySelector('.title').appendChild(d);

    

    document.getElementById('delete').addEventListener('click', () => {
        deleteListing();
    });
    document.getElementById('edit').addEventListener('click', () => {
        if(document.querySelector('.edit-profile')) {
            return;
        }
        editListing();
    });
    
}

document.getElementById('hamburger').addEventListener('click', hamburger);
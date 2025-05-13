import { apiUrl, auth, apiKey, username } from './config.js';

const params = new URLSearchParams(window.location.search);
const user = params.get('p');
const tab = params.get('q');

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
        
        document.getElementById('profilePicture').src = data.data.avatar.url;
        document.getElementById('profilePicture').alt = data.data.avatar.alt;

        document.getElementById('banner').src = data.data.banner.url;
        document.getElementById('banner').alt = data.data.banner.alt;

        document.getElementById('pUsername').textContent = data.data.name;

        document.getElementById('pDesc').textContent = data.data.bio ? data.data.bio : 'This user does not have a BIO yet...';
        document.getElementById('totalCredits').textContent = data.data.credits;

        if(username != user) {
            document.getElementById('details').style.display = 'none';
        }
        

    } catch(error) {
        console.error(error);
    }
}

fetchProfile();
document.body.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        fetchProfile();
    }
});

async function details() {
    try {
        const response = await fetch(`${apiUrl}/auction/profiles/${user}`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`,
            }
        })
        const data = await response.json();
        document.getElementById('usernameInput').placeholder = data.data.name;
        document.getElementById('emailInput').placeholder = data.data.email;
        document.getElementById('avatarInput').value = data.data.avatar.url;
        document.getElementById('bannerInput').value = data.data.banner.url;
        document.getElementById('imagePlaceholder').src = data.data.avatar.url;
        document.getElementById('bioInput').value = data.data.bio ? data.data.bio : 'Enter a BIO';
    } catch(error) {
        console.error(error);
    }
}

async function listings() {
    try {
        const response = await fetch(`${apiUrl}/auction/profiles/${user}/listings`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`,
            }
        })
        const data = await response.json();
        const listings = data.data;
        listings.forEach(item => {
            const d = document.createElement('a');
            d.href = `../listing/?i=${item.id}`;
            d.className = 'card';
            d.innerHTML = `
            <img src="${item.media[0].url}">
            <div class="card-title">
                <h3>${item.title}</h3>
                <p>${item._count.bids} bids<p>
            </div>
            `;
        document.getElementById('displayListings').appendChild(d);
        })
    } catch(error) {
        console.error(error);
    }
}

async function wins() {
    try {
        const response = await fetch(`${apiUrl}/auction/profiles/${user}/wins`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`,
            }
        })
        const data = await response.json();
        const listings = data.data;

        listings.forEach(item => {
            const d = document.createElement('a');
            d.href = `../listing/?i=${item.id}`;
            d.className = 'card';
            d.innerHTML = `
            <img src="${item.media[0].url}">
            <div class="card-title">
                <h3>${item.title}</h3>
                <p>${item._count.bids} bids<p>
            </div>
            `;
        document.getElementById('displayWins').appendChild(d);
        })
    } catch(error) {
        console.error(error);
    }
}

async function history() {
    try {
        const response = await fetch(`${apiUrl}/auction/profiles/${user}`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`,
            }
        })
        const data = await response.json();
        console.log(data);

    } catch(error) {
        console.error(error);
    }
}

async function editProfile() {
    const bio = document.getElementById('bioInput').value;
    const avatar = document.getElementById('avatarInput').value;
    const banner = document.getElementById('bannerInput').value;

    const body = {
        bio: bio,
        avatar: {
            url: avatar,
            alt: `${user}s avatar`,
        },
        banner: {
            url: banner,
            alt: `${user}s banner`
        }
    }
    try {
        const response = await fetch(`${apiUrl}/auction/profiles/${user}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`,
            },
            body: JSON.stringify(body),
        })
        if(response.ok) {
            console.log('Success! Refresh the page to watch the changes!');
        } else {
            console.error('Error updating profile.. Try again');
        }
        const data = await response.json();
        console.log(data);
    } catch(error) {
        console.error(error);
    }
}

document.getElementById('details').addEventListener('click', () => {
    const d = document.getElementById('q')
        d.innerHTML = `
        <div class="profile-form">
            <h1>Account details</h1>
            <div class="form">
                <div class="idk">
                    <div class="idk2">
                        <input type="text" placeholder="Username" id="usernameInput" disabled>
                        <input type="text" placeholder="Email" id="emailInput" disabled>
                        <input type="text" placeholder="Avatar URL" id="avatarInput">
                        <input type="text" placeholder="Banner URL" id="bannerInput">
                    </div>
                    <textarea type="text" placeholder="BIO" id="bioInput"></textarea>
                </div>
                <div class="image">
                    <img src="" id="imagePlaceholder">
                </div>
            </div>
        </div>
        <div class="save">
            <button id="saveChanges">Save changes</button>
        </div>
        `;

        document.getElementById('saveChanges').addEventListener('click', () => {
            editProfile();
            setTimeout(() => {
                fetchProfile();
            }, 10)
        });
        const input = document.getElementById('avatarInput');
        const preview = document.getElementById('imagePlaceholder');
        input.addEventListener('input', () => {
            const url = input.value.trim();
        
            if(url) {
                preview.src = url;
            } else {
                preview.src = '';
            }
        });
        details();
})
document.getElementById('listings').addEventListener('click', () => {
    const d = document.getElementById('q')
        d.innerHTML = `
        <div class="profile-form">
            <h1>Listings</h1>
            <div id="displayListings">
            </div>
        </div>
        `;
    listings();
})
document.getElementById('wins').addEventListener('click', () => {
    const d = document.getElementById('q')
        d.innerHTML = `
        <div class="profile-form">
            <h1>Wins</h1>
            <div id="displayWins">
            </div>
        </div>
        `;
    wins();
})
document.getElementById('history').addEventListener('click', () => {
    const d = document.getElementById('q')
        d.innerHTML = `
        <div class="profile-form">
            <h1>History</h1>
            <div id="displayWins">
            </div>
        </div>
        `;
        history();
})
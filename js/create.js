import { auth, apiKey, apiUrl } from './config.js';

async function createListing() {
    const title = 'Celestique Noir';
    const tags = 'LuxeLot';
    const date = document.getElementById('date').value;
    const url = 'https://globalboutique.com/wp-content/uploads/2023/05/featured-gold-watches-800x600.jpg';
    const endsAt = new Date(date);
    const create = { 
        title: title,
        tags: [tags],
        media: [
            {
                url: url,
            },
        ],
        endsAt: endsAt.toISOString(),
     }
    try {
        const response = await fetch(`${apiUrl}/auction/listings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth}`,
                'X-Noroff-API-Key': `${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(create)
        });
        const data = await response.json();
        if(response.ok) {
            console.log('Listing successfully created!');
            console.log(data);
            window.location.href = `../listing/?i=${data.data.id}`
        } else {
            console.log(endsAt.toISOString());
            console.error(create);
        }
    } catch(error) {
        console.error(error);
    }
}

document.getElementById('createList').addEventListener('click', createListing);
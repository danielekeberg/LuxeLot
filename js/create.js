import { auth, apiKey, apiUrl } from './config.js';

async function createListing() {
    const now = new Date();
    const date = new Date(now.getTime() + 2 * 60000).toISOString();

    // Date er satt til 5 minutter fra bruker trykker på knappen. Endre denne til 1 dag før innlevering.
    // Dette er for å teste ting uten å spamme ned alle listings


    const title = document.getElementById('itemTitle').value;
    const tags = ['LuxeLot'];
    const url = document.getElementById('itemImg').value;
    const desc = document.getElementById('itemDesc').value;
    // const endsAt = new Date(date);
    const create = { 
        title: title,
        description: desc,
        tags: tags,
        media: [
            {
                url: url,
                alt: `Image for ${title}`
            },
        ],
        endsAt: date,
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
            console.error(data);
        }
    } catch(error) {
        console.error(error);
    }
}

document.getElementById('createListing').addEventListener('click', createListing);

const input = document.getElementById('itemImg');
const preview = document.getElementById('imagePlaceholder');
const text = document.getElementById('placeholderText');

input.addEventListener('input', () => {
    const url = input.value.trim();

    if(url) {
        preview.src = url;
        text.textContent = '';
    } else {
        preview.src = '';
        text.textContent = 'Preview';
    }
});
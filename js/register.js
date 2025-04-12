import { apiKey, apiUrl, authToken } from './config.js';

async function register() {
    // const name = document.getElementById('usernameInput').value;
    // const email = document.getElementById('emailInput').value;
    // const password = document.getElementById('passwordInput').value;

    const name = '8april';
    const email = '8april@stud.noroff.no';
    const password = '8aprilno';
    try {
        const response = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'X-Noroff-API-Key': `${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if(response.ok) {
            alert('Account successfully registered');
            window.location.href = '../login'
        } else {
            console.log('nai');
            throw new Error(data.message);
        }
    } catch(error) {
        console.error(error);
    }
}

document.getElementById('register').addEventListener('click', register);
import { apiKey, apiUrl, authToken } from './config.js';

async function login() {
    try {
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;

        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'X-Noroff-API-Key': `${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        const user = data.data;
        
        if(response.ok) {
            localStorage.setItem('username', user.name);
            localStorage.setItem('auth', user.accessToken)
            window.location.href = '../';
        } else {
            console.log(error + 'watfak');
            return;
        }
    } catch(err) {
        console.error(err);
    }
}

document.getElementById('login').addEventListener('click', login);

document.getElementById('forceLogin').addEventListener('click', login);
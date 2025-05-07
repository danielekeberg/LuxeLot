import { apiKey, apiUrl, authToken } from './config.js';

async function register() {
    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
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
        const error = data.errors;
        if(!response.ok) {
            if(document.querySelector('.errorMsg')) {
                console.log('Ikke spam');
                return;
            };
            document.querySelector('.error').style.opacity = 1;
            error.forEach(errorMsg => {
                console.log(errorMsg.message);
                const d = document.createElement('div');
                d.className = 'errorMsg';
                d.innerHTML = `${errorMsg.message}`;
                document.querySelector('.error').appendChild(d);
                setTimeout(() => {
                    document.querySelector('.error').style.opacity = 0;
                    setTimeout(() => {
                        document.querySelector('.error').removeChild(d);
                    }, 300);
                }, 3000);
            });
            return;
        } else {
            window.location.href = '../login/';
        }
    } catch(error) {
        console.error(error);
    }
}

document.getElementById('registerBtn').addEventListener('click', register);
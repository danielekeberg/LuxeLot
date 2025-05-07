import { apiKey, apiUrl, authToken } from './config.js';

async function login() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

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
        const error = data.errors;
        console.log(error);
        
        if(response.ok) {
            localStorage.setItem('username', user.name);
            localStorage.setItem('auth', user.accessToken);
            localStorage.setItem('isLoggedIn', true);
            window.location.href = '../';
        } else {
            if(document.querySelector('.errorMsg')) {
                return;
            }
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
        }
    } catch(err) {
        console.error(err);
    }
}

document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('password').addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        login();
    }
});
document.getElementById('email').addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        login();
    }
});
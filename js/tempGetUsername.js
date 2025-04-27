const tempUsername = localStorage.getItem('username');

function getUsername() {
    document.getElementById('username').textContent = tempUsername;
}

getUsername();

document.getElementById('username').addEventListener('click', () => {
    window.location.href = `./profile/?q=${tempUsername}`;
});

document.getElementById('profileInc').innerHTML = `
<h1>hei ${tempUsername} :)</h1>
<p>Denne siden er ikke ferdig, men den kommer snart!</p>
<p>hehe</p>`;

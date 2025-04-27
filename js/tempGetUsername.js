const tempUsername = localStorage.getItem('username');

function getUsername() {
    document.getElementById('username').textContent = tempUsername;
}

getUsername();

document.getElementById('username').addEventListener('click', () => {
    window.location.href = `./profile/?q=${tempUsername}`;
});

document.getElementById('pUsername').textContent = tempUsername;

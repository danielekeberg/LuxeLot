function logout() {
    console.log('rerer');
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
}

document.getElementById('logout').addEventListener('click', logout);
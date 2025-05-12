function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
}

document.getElementById('logout').addEventListener('click', logout);
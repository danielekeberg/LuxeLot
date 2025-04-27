document.getElementById('loginBtn').addEventListener('click', () => {
    const emailValue = document.getElementById('email').value;
    if(emailValue === '') {
        document.getElementById('error').style.opacity = '1';
        setTimeout(() => {
            document.getElementById('error').style.opacity = '0';
        }, 2500);
        return;
    }
    localStorage.setItem('username', emailValue)
    localStorage.setItem('isLoggedIn', true)
    window.location.href = '../';
});
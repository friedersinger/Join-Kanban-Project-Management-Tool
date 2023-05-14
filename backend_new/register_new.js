let users = [];


async function init(){
    loadUsers();
}

async function loadUsers(){
    let registeredUsers = document.getElementById('registeredUsers');

    try {
        users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }

    registeredUsers.innerHTML = 'Usermail: ' + users[0]['email'];
}


async function register() {
    registerBtn.disabled = true;
    users.push({
        email: email.value,
        password: password.value,
    });
    await setItem('users', JSON.stringify(users));
    resetForm();
}

function resetForm() {
    email.value = '';
    password.value = '';
    registerBtn.disabled = false;
}
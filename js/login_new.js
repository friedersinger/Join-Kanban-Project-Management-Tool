let users = [];

async function init(){
    loadUsers();
}

async function loadUsers(){
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}

/**
 * This function checks if the email and password from the input fields are found in the database.
 * If the credentials match, the user is redirected to summary.html.
 * Else -> a message is shown: "User not found".
 *
 * @returns {void}
 */
async function login() {
    let email = document.getElementById("emailLogin");
    let password = document.getElementById("passwordLogin");
    let user = users.find(
      (u) => u.email === email.value && u.password == password.value
    );
  
    if (user) {
      await localStorage.setItem("activeUser", JSON.stringify(user.name));
      window.location.href = "summary.html";
    } else {
      document.getElementById("userNotFound").classList.remove("d-none");
      email.value = "";
      password.value = "";
    }
    rememberMe(email, password);
  }

/**
 * Log in as a guest user for demo purposes and save it as active user in local storage
 *
 */
async function guestLogin() {
    let guest = { name: "Guest" };
    await localStorage.setItem("activeUser", JSON.stringify(guest.name));
    window.location.href = "summary.html";
  }


async function signUpNewUser() {
  let name = document.getElementById("nameSignup");
  let email = document.getElementById("emailSignup");
  let password = document.getElementById("passwordSignup");
  users.push({
    name: name.value,
    email: email.value,
    password: password.value,
  });
  await setItem('users', JSON.stringify(users));
    resetForm(name, email, password);
}

function resetForm(name, email, password) {
    email.value = '';
    password.value = '';
    name.value = '';
}


/**
 * This function displays the "sign up" section and hides the login section on the login screen
 *
 */
function openSignUp() {
    document.getElementById("login").classList.add("d-none");
    document.getElementById("signUp").classList.remove("d-none");
    document.getElementById("signUpMobileButton").classList.add("d-none");
    document.getElementById("signUpButton").classList.add("d-none");
  }


  /**
 * Check if the email entered by the user already exists in the database before adding a new user.
 * If the email doesn't exist, add the new user.
 * If the email already exists, show an error message and redirect the user to the login page.
 *
 * @returns {boolean} - Returns false if email already exists, true otherwise.
 */
function checkSignUp() {
    let email = document.getElementById("emailSignup");
    let user = users.find((u) => u.email === email.value);
    if (!user) {
      signUpNewUser();
      console.log(users);
    } else {
      document.getElementById("userExists").classList.remove("d-none");
      document.getElementById("goToLoginBtn").classList.remove("d-none");
      email.value = "";
      email.focus();
      return false;
    }
  }


  /**
 * This function hides the "sign up" section and shows the login section on the login screen
 *
 */
function closeSignUp() {
    document.getElementById("login").classList.remove("d-none");
    document.getElementById("signUp").classList.add("d-none");
    document.getElementById("signUpMobileButton").classList.remove("d-none");
    document.getElementById("signUpButton").classList.remove("d-none");
  }

  

  /**
 * This function displays the "forgot password" section and hides the login and sign-up sections on the login screen
 *
 */
function openForgotPassword() {
    document.getElementById("forgotPassword").classList.remove("d-none");
    document.getElementById("login").classList.add("d-none");
    document.getElementById("signUpMobileButton").classList.add("d-none");
    document.getElementById("signUpButton").classList.add("d-none");
  }
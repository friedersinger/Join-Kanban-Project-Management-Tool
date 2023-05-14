/**
 * This function checks if the email and password from the input fields are found in the database.
 * If the credentials match, the user is redirected to summary.html.
 * Else -> a message is shown: "User not found".
 *
 * @returns {void}
 */
async function login() {
  let email = document.getElementById("email-login");
  let password = document.getElementById("password-login");
  let user = users.find(
    (u) => u.email === email.value && u.password == password.value
  );

  if (user) {
    // Since localStorage.setItem() is an asynchronous operation, we use the "await" keyword to make
    // sure the operation finishes before proceeding with the rest of the code. However, in this
    // particular case, since we are not using the result of the operation, the "await" keyword
    // has no effect in an if-statement.
    await localStorage.setItem("activeUser", JSON.stringify(user.name));
    checkViewPortAndRedirect();
  } else {
    document.getElementById("user-not-found").classList.remove("d-none");
    email.value = "";
    password.value = "";
  }
  rememberMe(email, password);
}

/**
 * Stores the email and password in local storage for remembering the user login,
 * or removes them if the remember me checkbox is not checked.
 *
 * @param {HTMLElement} email - Input field for Email
 * @param {HTMLElement} password - Input field for Password
 */
function rememberMe(email, password) {
  let checkbox = document.getElementById("checkbox");
  if (checkbox.checked) {
    localStorage.setItem("rememberMeEmail", email.value);
    localStorage.setItem("rememberMePassword", password.value);
  } else if (!checkbox.checked) {
    localStorage.removeItem("rememberMeEmail");
    localStorage.removeItem("rememberMePassword");
  }
}

/**
 * Log in as a guest user for demo purposes and save it as active user in local storage
 *
 */
async function guestLogin() {
  let guest = { name: "Guest" };
  await localStorage.setItem("activeUser", JSON.stringify(guest.name));
  if (document.body.clientWidth > 1024) {
    window.location.href = "summary.html";
  } else {
    window.location.href = "hello_mobile.html";
  }
}

/**
 * Check if the email entered by the user already exists in the database before adding a new user.
 * If the email doesn't exist, add the new user.
 * If the email already exists, show an error message and redirect the user to the login page.
 *
 * @returns {boolean} - Returns false if email already exists, true otherwise.
 */
function checkSignUp() {
  let email = document.getElementById("email-signup");
  let user = users.find((u) => u.email === email.value);
  if (!user) {
    addUser();
  } else {
    document.getElementById("userExists").classList.remove("d-none");
    document.getElementById("goToLoginBtn").classList.remove("d-none");
    email.value = "";
    email.focus();
    return false;
  }
}

/**
 * This function adds a new user to the database by getting the user details from the signup form.
 *
 */
async function addUser() {
  let name = document.getElementById("name-signup");
  let email = document.getElementById("email-signup");
  let password = document.getElementById("password-signup");
  users.push({
    name: name.value,
    email: email.value,
    password: password.value,
  });
  await backend.setItem("users", JSON.stringify(users));
  window.location.href = "success_signup.html";
  name.value = "";
  email.value = "";
  password.value = "";
}

/**
 * This function checks if the user with the provided email exists in the database before sending a reset password email.
 * If the user exists, it returns true. If not, it prevents the default action and shows an error message.
 *
 * @param {Event} e - The event parameter is used to prevent sending the email if the user does not exist in the database.
 */
function checkIfUserExists(e) {
  let email = document.getElementById("forgot-pw-mail");
  let user = users.find((u) => u.email === email.value);
  if (user) {
    return true;
  } else {
    e.preventDefault();
    document.getElementById("forgot-user-not-found").classList.remove("d-none");
    email.value = "";
    return false;
  }
}

/**
 * This function retrieves the user's email from the URL and changes the password for that specific user.
 *
 */
function changePassword() {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");
  let newPassword = document.getElementById("new-password");
  let newPasswordConfirm = document.getElementById("new-password-confirm");
  let findMailInUsers = users.find((u) => u.email == email);
  if (newPassword.value == newPasswordConfirm.value) {
    settingNewPassword(newPassword, newPasswordConfirm, findMailInUsers);
  } else {
    document.getElementById("user-not-found").classList.remove("d-none");
    newPassword.value = "";
    newPasswordConfirm.value = "";
  }
}

/**
 * This function is used to set a new password for the user and update it in the database.
 *
 * @param {HTMLElement} newPassword - Input field for the new password
 * @param {HTMLElement} newPasswordConfirm - Input field to confirm the new password
 * @param {Object} findMailInUsers - The user object that contains the email address
 */
async function settingNewPassword(
  newPassword,
  newPasswordConfirm,
  findMailInUsers
) {
  findMailInUsers.password = newPassword.value;
  await backend.setItem("users", JSON.stringify(users));
  window.location.href = "success_reset_pw.html";
  newPassword.value = "";
  newPasswordConfirm.value = "";
}

/**
 * Redirects the user to the login page.
 *
 */
function goToLogin() {
  window.location.href = "index.html";
}

/**
 * Redirects to a certain page depending on the viewport width
 *
 */
function checkViewPortAndRedirect() {
  if (document.body.clientWidth > 1024) {
    window.location.href = "summary.html";
  } else {
    window.location.href = "hello_mobile.html";
  }
}

// ---------------- PASSWORD SHOW AND HIDE FUNCTIONS -------------------------

/**
 * This function is used to change the password icon to an eye icon when the password input field is focused
 *
 * @param  {string} id - The ID of the element to be targeted.
 * @param  {string} name -  The name of the section to be targeted (choose from: login, signup, reset, confirm).
 */
function checkInputType(id, name) {
  let typeIsPassword = document.getElementById(id).type == "password";
  if (typeIsPassword == true) changePwIconToEye(name);
}

/**
 * This function toggles the password icon to a show/hide button for better user experience.
 *
 * @param  {string} name -  The name of the section to be targeted (choose from: login, signup, reset, confirm).
 */
function changePwIconToEye(name) {
  document.getElementById(`pw-no-show-${name}`).classList.remove("d-none");
  document.getElementById(`pw-icon-${name}`).classList.add("d-none");
  document.getElementById(`pw-show-${name}`).classList.add("d-none");
}

/**
 * This function changes the type of the targeted input field from password to text, while also changing the toggle button.
 *
 * @param  {string} id - The ID of the element you want to target.
 * @param  {string} name - The name of the section to be targeted (choose from: login, signup, reset, confirm).
 */
function changePwToText(id, name) {
  document.getElementById(`pw-no-show-${name}`).classList.add("d-none");
  document.getElementById(`pw-show-${name}`).classList.remove("d-none");
  document.getElementById(id).type = "text";
}

/**
 * This function changes the type of the targeted input field from text to password, while also changing the toggle button.
 *
 * @param  {string} id - The ID of the element you want to target.
 * @param  {string} name - The name of the section to be targeted (choose from: login, signup, reset, confirm).
 */
function changeTextToPw(id, name) {
  document.getElementById(`pw-no-show-${name}`).classList.remove("d-none");
  document.getElementById(`pw-show-${name}`).classList.add("d-none");
  document.getElementById(id).type = "password";
}

// --------------- LOGIN SCREEN: SHOW AND HIDE SECTION  ----------------------

/**
 * This function displays the "forgot password" section and hides the login and sign-up sections on the login screen
 *
 */
function openForgotPassword() {
  document.getElementById("forgot-password").classList.remove("d-none");
  document.getElementById("login").classList.add("d-none");
  document.getElementById("signUp-mobile-button").classList.add("d-none");
  document.getElementById("signUp-button").classList.add("d-none");
}

/**
 * This function hides the "forgot password" section and shows the login and sign-up sections on the login screen
 *
 */
function closeForgotPassword() {
  document.getElementById("forgot-password").classList.add("d-none");
  document.getElementById("login").classList.remove("d-none");
  document.getElementById("signUp-mobile-button").classList.remove("d-none");
  document.getElementById("signUp-button").classList.remove("d-none");
}

/**
 * This function displays the "sign up" section and hides the login section on the login screen
 *
 */
function openSignUp() {
  document.getElementById("login").classList.add("d-none");
  document.getElementById("sign-up").classList.remove("d-none");
  document.getElementById("signUp-mobile-button").classList.add("d-none");
  document.getElementById("signUp-button").classList.add("d-none");
}

/**
 * This function hides the "sign up" section and shows the login section on the login screen
 *
 */
function closeSignUp() {
  document.getElementById("login").classList.remove("d-none");
  document.getElementById("sign-up").classList.add("d-none");
  document.getElementById("signUp-mobile-button").classList.remove("d-none");
  document.getElementById("signUp-button").classList.remove("d-none");
}

/**
 * This function redirects to the login page
 *
 */
function openIndex() {
  window.location.href = "index.html";
}

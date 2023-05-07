/**
 * This function checks if the email and password from the inputfields are existing in the database
 *      if found --> user proceeds to summary.html
 *               else --> showing message:"user not found"
 *
 */
async function login() {
  let email = document.getElementById("email-login");
  let password = document.getElementById("password-login");
  let user = users.find(
    (u) => u.email === email.value && u.password == password.value
  );

  if (user) {
    await localStorage.setItem("activeUser", JSON.stringify(user.name)); // saving active user in local storage
    checkViewPortAndRedirect();
  } else {
    document.getElementById("user-not-found").classList.remove("d-none");
    email.value = "";
    password.value = "";
  }
  rememberMe(email, password);
}

/**
 * Set the remembered email and password into the input fields
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
 * This function is used to log in as a guest. Mainly for demo purposes
 *
 */
async function guestLogin() {
  let guest = { name: "Guest" };
  await localStorage.setItem("activeUser", JSON.stringify(guest.name)); // saving guest as active user in local storage
  if (document.body.clientWidth > 1024) {
    window.location.href = "summary.html";
  } else {
    window.location.href = "hello_mobile.html";
  }
}

/**
 * This function checks if the email already exists in the database before adding a new user.
 *
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
 * This function adds a user to the database
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
 * This function is used to check if the user exists in the database before sending a reset password Email
 *
 * @param  {string} e - this event parameter is used to prevent sending the email if the user already exists
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
 * This function extracts users email out of the url and changes the password for this specific user
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
 * This function is used to overwrite the exsiting password in the database
 *
 * @param  {string} newPassword - inputfield for the new password
 * @param  {string} newPasswordConfirm - inputfield to confirm the new password
 * @param  {string} findMailInUsers - finding the email in the databse
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
 * This functions opens up the landing page
 *
 */
function goToLogin() {
  window.location.href = "index.html";
}

/**
 * This function checks viewport width and redirects to a certain page
 *
 */
function checkViewPortAndRedirect() {
  if (document.body.clientWidth > 1024) {
    window.location.href = "summary.html";
  } else {
    window.location.href = "hello_mobile.html";
  }
}

//-****************************PASSWORD SHOW AND HIDE FUNCTIONS*************************************

/**
 * This functions checks the input type onfocus of the inputfield
 *
 * @param  {string} id - id of the element you want to target
 * @param  {string} name - name of the section you want to target (select from: login, signup, reset, confirm)
 */
function checkInputType(id, name) {
  let typeIsPassword = document.getElementById(id).type == "password";
  if (typeIsPassword == true) changePwIconToEye(name);
}

/**
 * This function changes the password icon to a toggle button to show and hide the password
 *
 * @param  {string} name - name of the section you want to target (select from: login, signup, reset, confirm)
 */
function changePwIconToEye(name) {
  document.getElementById(`pw-no-show-${name}`).classList.remove("d-none");
  document.getElementById(`pw-icon-${name}`).classList.add("d-none");
  document.getElementById(`pw-show-${name}`).classList.add("d-none");
}

/**
 * This function changes the type of the targeted inpufield from password to text while also changing the toggle button
 *
 * @param  {string} id - id of the element you want to target
 * @param  {string} name - name of the section you want to target (select from: login, signup, reset, confirm)
 */
function changePwToText(id, name) {
  document.getElementById(`pw-no-show-${name}`).classList.add("d-none");
  document.getElementById(`pw-show-${name}`).classList.remove("d-none");
  document.getElementById(id).type = "text";
}

/**
 * This function changes the type of the targeted inpufield from text to password while also changing the toggle button
 *
 * @param  {string} id - id of the element you want to target
 * @param  {string} name - name of the section you want to target (select from: login, signup, reset, confirm)
 */
function changeTextToPw(id, name) {
  document.getElementById(`pw-no-show-${name}`).classList.remove("d-none");
  document.getElementById(`pw-show-${name}`).classList.add("d-none");
  document.getElementById(id).type = "password";
}

//-*********************SHOW AND HIDE SECTION ON LOGIN SCREEN ******************************************************************

/**
 * This function displays the "forgot password" section on the login screen
 *
 */
function openForgotPassword() {
  document.getElementById("forgot-password").classList.remove("d-none");
  document.getElementById("login").classList.add("d-none");
  document.getElementById("signUp-mobile-button").classList.add("d-none");
  document.getElementById("signUp-button").classList.add("d-none");
}

/**
 * This function closes the "forgot password" section on the login screen
 *
 */
function closeForgotPassword() {
  document.getElementById("forgot-password").classList.add("d-none");
  document.getElementById("login").classList.remove("d-none");
  document.getElementById("signUp-mobile-button").classList.remove("d-none");
  document.getElementById("signUp-button").classList.remove("d-none");
}

/**
 * This function displays the "sign up" section on the login screen
 *
 */
function openSignUp() {
  document.getElementById("login").classList.add("d-none");
  document.getElementById("sign-up").classList.remove("d-none");
  document.getElementById("signUp-mobile-button").classList.add("d-none");
  document.getElementById("signUp-button").classList.add("d-none");
}

/**
 * This function closes the "sign up" section on the login screen
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

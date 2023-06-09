/**
 * Toggles the display of the logout button and options mobile based on the window width.
 *
 */
function toggleLogout() {
  var logoutButton = document.getElementById("logout-button");
  var optionsMobile = document.getElementById("options-mobile");
  if (window.innerWidth > 756) {
    logoutButton.classList.toggle("d-none");
  } else {
    optionsMobile.classList.toggle("d-none");
  }
}

function logout() {
  window.location.href = "index.html";
}

function renderUsername() {
  document.getElementById("userName").innerHTML = `${activeUser}`;
}

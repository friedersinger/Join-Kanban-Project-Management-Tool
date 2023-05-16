function showLogout() {
  var logoutButton = document.getElementById("logout-button");
  if (logoutButton.classList.contains("d-none")) {
    logoutButton.classList.remove("d-none");
  } else {
    logoutButton.classList.add("d-none");
  }
}

function hideLogout() {
  var logoutButton = document.getElementById("logout-button");
  logoutButton.classList.add("d-none");
}

function logout() {
  window.location.href = "index.html";
}

/**
 *
 */
function renderUsername() {
  document.getElementById("userName").innerHTML = `${activeUser}`;
}

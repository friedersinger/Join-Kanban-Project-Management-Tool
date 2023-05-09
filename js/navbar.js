function showLogout() {
  var logoutButton = document.getElementById("logout-button");
  logoutButton.classList.remove("d-none");
}

function hideLogout() {
  var logoutButton = document.getElementById("logout-button");
  logoutButton.classList.add("d-none");
}

function logout() {
  window.location.href = "index.html";
}

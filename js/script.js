/**
 * defining global variables
 */
let activeUser;

/**
 * Initializes global variables and fetches data from server to populate arrays.
 */
async function init() {
  activeUser = JSON.parse(localStorage.getItem("activeUser")) || [];
  console.log("Active user:", activeUser);
}

/**
 *  waiting
 */
async function renderWithoutActiveSection() {
  await includeHTML();
  renderUsername();
}

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

async function deleteAllUsersFromServer(){
  try {
    users = JSON.parse(await getItem("users"));
    users = [];
    await setItem("users", JSON.stringify(users));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

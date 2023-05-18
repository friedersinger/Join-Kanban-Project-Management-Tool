let contacts = [];

function giveAlphabet() {
  let contactBox = document.getElementById("contactBox");

  for (let i = 0; i < alphabet.length; i++) {
    const letter = alphabet[i];
    contactBox.innerHTML += giveContactListHTML(letter); //
  }
}

async function createNewContact() {
  console.log("createNewContactclicked");
  let name = document.getElementById("addName");
  let email = document.getElementById("addMail");
  let phone = document.getElementById("addTel");
  await setNewID();
  contacts.push({
    name: name.value,
    email: email.value,
    phone: phone.value,
    id: currentUserID,
  });
  await setItem("contacts", JSON.stringify(contacts));
  resetForm(name, email, phone);
}

function resetForm(name, email, phone) {
  email.value = "";
  phone.value = "";
  name.value = "";

  window.location.href = "success_signup.html";
}

function showCard() {
  let overlay = document.getElementById("overlay-bg");
  overlay.classList.remove("d-none");
}

function hideCard() {
  let overlay = document.getElementById("overlay-bg");
  overlay.classList.add("d-none");
}

async function getContacts() {
  let contactBox = document.getElementById("contactBox");
  await loadUsers();
  for (let i = 0; i < users.length; i++) {
    const name = users[i]["name"];
    const mail = users[i]["email"];
    const id = users[i]["id"];
    contactBox.innerHTML += giveContactListHTML(name, mail, id);
  }
}

function renderContactCard(id) {
  let contactDetailsContainer = document.getElementById("contactDetails");
  let currentUser = users.find((user) => user.id === id);
  const name = currentUser["name"];
  const mail = currentUser["email"];
  initials = giveContactInitials(name);
  contactDetailsContainer.innerHTML = giveContactDetailsHTML(
    name,
    mail,
    initials
  );
}

function giveContactInitials(name) {
  let initials = name.match(/\b(\w)/g);
  initials = initials.join("");
  return initials;
}

async function deleteAllUsersFromServer() {
  try {
    users = JSON.parse(await getItem("users"));
    users = [];
    await setItem("users", JSON.stringify(users));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

function showRenderContact() {
  let contactDetailsContainer = document.getElementById("contactDetails");

  contactDetailsContainer.style.display = "flex";
  contactDetailsContainer.classList.remove("inner-content");
}

/**
 * This function returns the HTML for a single letter in the contact list
 */

function giveContactListHTML(name, mail, id) {
  return `
    <div class="contact-letter">
    <span class="contact-single-letter">A</span>
    <div class="contact-letter-container" id="letter" onclick = "renderContactCard(${id}), showRenderContact()">
        <div class="initials-image" id="contactInitials">
          AM
        </div>
        <div class="contact-name-mail">
          <span id="contactName">${name}</span>
          <a href="mailto:${mail}" id="contactMail">${mail}</a>
        </div>
    </div>
  </div>
    `;
}

function giveContactDetailsHTML(name, mail, initials) {
  return `
      <div class="flex-row gap-30 align-center">
          <div id="nameCircle">${initials}</div>
          <div class="flex-column">
            <span id="nameDetailCard">${name}</span>
            <div>
              <img src="assets/img/add_task_contacts.svg" alt="" class="cursor-pointer" />
            </div>
          </div>
        </div>

        <div class="flex-row gap-30 align-center">
          <span class="font-size-21">Contact Information</span>
          <div class="flex-row gap-5 align-center">
            <img src="assets/img/pen_black.svg" alt="" class="cursor-pointer" />
            <span class="cursor-pointer">Edit Contact</span>
          </div>
        </div>

        <div class="flex-column gap-15">
          <span class="font-weight-700">Email</span>
          <div id="mail">
            <a href="mailto:${mail}" id="contactMailDetail">${mail}</a>
          </div>
        </div>

        <div class="flex-column gap-15">
          <span class="font-weight-700">Phone</span>
          <div id="phone">
            <a href="+49 1111 1111 11" id="phoneDetail">+49 1111 1111 11</a>
          </div>
        </div>
  `;
}

contacts = [];

/**
 * Loads the contacts from the storage and assigns them to the 'contacts' array.
 * If there is an error while loading, it logs the error to the console.
 *
 */
async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Creates a new pseudo contact and adds it to the 'contacts' array.
 * Sets a new ID for the contact, marks it as a pseudo contact,
 * and stores the updated 'contacts' array in the storage.
 * Resets the form inputs.
 *
 * @param {HTMLElement} name - The input element for the contact's name.
 * @param {HTMLElement} email - The input element for the contact's email.
 * @param {HTMLElement} phone - The input element for the contact's phone number.
 */
async function createNewPseudoContact() {
  let name = document.getElementById("addName");
  let email = document.getElementById("addMail");
  let phone = document.getElementById("addTel");
  await setNewID();
  contacts.push({
    name: name.value,
    email: email.value,
    phone: phone.value,
    id: currentUserID,
    isPseudoContact: true,
  });
  await setItem("contacts", JSON.stringify(contacts));
  resetForm(name, email, phone);
}

/**
 * Resets the form inputs by clearing their values.
 * Reloads the page.
 *
 * @param {HTMLElement} name - The input element for the contact's name.
 * @param {HTMLElement} email - The input element for the contact's email.
 * @param {HTMLElement} phone - The input element for the contact's phone number.
 */
function resetForm(name, email, phone) {
  name.value = "";
  phone.value = "";
  email.value = "";
  window.location.reload();
}

/**
 * Shows the contact card overlay by removing the 'd-none' class from the 'overlay-bg' element.
 *
 */
function showCard() {
  let overlay = document.getElementById("overlay-bg");
  overlay.classList.remove("d-none");
}

/**
 * Hides the contact card overlay by adding the 'd-none' class to the 'overlay-bg' element.
 *
 */
function hideCard() {
  let overlay = document.getElementById("overlay-bg");
  overlay.classList.add("d-none");
}

/**
 * Retrieves contacts and renders them in the contact box.
 *
 */
async function getContacts() {
  await loadContacts();
  await sortContacts();
}

/**
 *
 * Sorts the contacts array by name in alphabetical order
 * by comparing the first letters
 *
 */
async function sortContacts() {
  contacts.sort(function (a, b) {
    let nameA = a.name.toLowerCase();
    let nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  createGroupsByInitialLetter(contacts);
}

/**
 * Creates groups of contacts based on the first letter of their names.
 * @param {Array} sortedArray - The array of contacts sorted by name.
 * @returns {Object} - The grouped contacts.
 */
let groupedContacts = {};
async function createGroupsByInitialLetter(sortedArray) {
  for (let i = 0; i < sortedArray.length; i++) {
    const name = sortedArray[i].name;
    const firstLetter = name[0].toUpperCase();

    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = [];
    }

    groupedContacts[firstLetter].push(sortedArray[i]);
  }
  console.log(groupedContacts);
  await renderSortedContactGroups();
  return groupedContacts;
}

/**
 * Renders the groups of contacts in the contact box.
 */
async function renderSortedContactGroups() {
  let contactBox = document.getElementById("contactBox");
  for (let i = 0; i < Object.keys(groupedContacts).length; i++) {
    const letter = Object.keys(groupedContacts)[i];
    console.log(letter);
    contactBox.innerHTML += `<div class="contact-letter">
      <span class="contact-single-letter">${letter}</span>
      <div class="contact-letter-container" id="group${letter}"></div>
    </div>`;
    showGroupedContacts(letter, i);
  }
}

/**
 * Renders the contacts within a group.
 * @param {string} letter - The letter representing the contact group.
 * @param {number} i - The index of the contact group.
 */
function showGroupedContacts(letter, i) {
  let groupBox = document.getElementById("group" + letter);
  for (let j = 0; j < Object.values(groupedContacts)[i].length; j++) {
    const contact = Object.values(groupedContacts)[i][j];
    const id = contact["id"];
    const name = contact["name"];
    const mail = contact["email"];
    const color = contact["color"];
    groupBox.innerHTML += `
    <div class="contact-item" onclick="renderContactCard(${id})">
      <div class="initials-image" id="contactInitials" style="background-color: ${color}">
        ${giveContactInitials(name)}
      </div>
      <div class="contact-name-mail">
        <span id="contactName">${name}</span>
        <a href="mailto:${mail}" id="contactMail">${mail}</a>
      </div>
    </div>`;
  }
}

/**
 * Renders the contact card based on the provided ID.
 * @param {*} id - The ID of the contact.
 */
function renderContactCard(id) {
  let contactDetailsContainer = document.getElementById("contactDetails");
  let contactDetailsMobileContainer = document.getElementById(
    "contactMobileDetails"
  );
  let currentContact = contacts.find((contact) => contact.id === id);
  const name = currentContact["name"];
  const mail = currentContact["email"];
  const color = currentContact["color"];
  const phone = currentContact["phone"];
  initials = giveContactInitials(name);
  if (document.body.clientWidth > 1024) {
    contactDetailsContainer.innerHTML = giveContactDetailsHTML(
      name,
      mail,
      initials,
      id,
      color,
      phone
    );
  } else {
    contactDetailsMobileContainer.innerHTML = giveContactDetailsMobileHTML(
      name,
      mail,
      initials,
      id,
      color,
      phone
    );
    document.getElementById("newContactMobile").classList.add("d-none");
    document.getElementById("contentMainContainer").classList.add("d-none");
  }
}

/**
 * Removes the "d-none" class from the newContactMobile and contentMainContainer elements, returning to the contact list view.
 *
 */
function returnToContactList() {
  document.getElementById("newContactMobile").classList.remove("d-none");
  document.getElementById("contentMainContainer").classList.remove("d-none");
}

/**
 * Generates initials based on the provided name.
 * @param {string} name - The name to generate initials from.
 * @returns {string} - The generated initials.
 */
function giveContactInitials(name) {
  let initials = name.match(/\b(\w)/g);
  initials = initials.join("").toUpperCase();
  return initials;
}

/**
 * Deletes all contacts from the server.
 */
async function deleteAllContactsFromServer() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
    contacts = [];
    await setItem("contacts", JSON.stringify(contacts));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Generates the HTML for a single contact in the contact list.
 * @param {string} name - The name of the contact.
 * @param {string} mail - The email of the contact.
 * @param {*} id - The ID of the contact.
 * @returns {string} - The generated HTML.
 */
function giveContactListHTML(name, mail, id) {
  return `
    <div class="contact-letter">
    <span class="contact-single-letter">A</span>
    <div class="contact-letter-container" id="letter" onclick = "renderContactCard(${id})">
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

/**
 * Generates the HTML for the contact details.
 * @param {string} name - The name of the contact.
 * @param {string} mail - The email of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} phone - The name of the contact.
 * @returns {string} - The generated HTML.
 */
function giveContactDetailsHTML(name, mail, initials, id, color, phone) {
  let phoneDisplay = ""; // Variable für das Display-Attribut des Telefonfelds

  if (phone !== undefined && phone !== "") {
    phoneDisplay = "block"; // Wenn das Telefonfeld nicht leer ist, anzeigen
  } else {
    phoneDisplay = "none"; // Wenn das Telefonfeld leer ist, ausblenden
  }

  return `
    <div class="flex-row gap-30 align-center">
      <div id="nameCircle" style="background-color: ${color}">${initials}</div>
      <div class="flex-column">
        <span id="nameDetailCard">${name}</span>
        <div id="addTaskPopUp" onclick="showAddTaskPopUp()">
          <img src="./assets/img/add_task_contacts.svg" alt="" class="cursor-pointer" />
        </div>
      </div>
    </div>

    <div class="flex-row gap-30 align-center">
    <span class="font-size-21">Contact Information</span>
    <div class="flex-row gap-5 align-center" onclick="showEditCard(${id})">
      <img src="./assets/img/pen_black.svg" alt="" class="cursor-pointer" />
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
    <div id="phone" style="display: ${phoneDisplay}">
      <a href="${phone || "add Details"}" id="phoneDetail">${
    phone || "add Details"
  }</a></div>     
  <div class="desktop-btn-column">
    <svg   onclick="deleteCard(${id}); returnToContactList() " width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 0.5H30C35.2467 0.5 39.5 4.75329 39.5 10V30C39.5 35.2467 35.2467 39.5 30 39.5H10C4.75329 39.5 0.5 35.2467 0.5 30V10C0.5 4.75329 4.75329 0.5 10 0.5Z" fill="url(#paint0_linear_48008_5258)"/>
      <mask id="mask0_48008_5258" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="4" y="4" width="32" height="32">
      <rect x="4" y="4" width="32" height="32" fill="#D9D9D9"/>
      </mask>
      <g mask="url(#mask0_48008_5258)">
      <path d="M13.333 32C12.5997 32 11.9719 31.7389 11.4497 31.2167C10.9275 30.6944 10.6663 30.0667 10.6663 29.3333V12H9.33301V9.33333H15.9997V8H23.9997V9.33333H30.6663V12H29.333V29.3333C29.333 30.0667 29.0719 30.6944 28.5497 31.2167C28.0275 31.7389 27.3997 32 26.6663 32H13.333ZM26.6663 12H13.333V29.3333H26.6663V12ZM15.9997 26.6667H18.6663V14.6667H15.9997V26.6667ZM21.333 26.6667H23.9997V14.6667H21.333V26.6667Z" fill="#2A3647"/>
      </g>
      <path d="M10 0.5H30C35.2467 0.5 39.5 4.75329 39.5 10V30C39.5 35.2467 35.2467 39.5 30 39.5H10C4.75329 39.5 0.5 35.2467 0.5 30V10C0.5 4.75329 4.75329 0.5 10 0.5Z" stroke="#2A3647"/>
      <defs>
      <linearGradient id="paint0_linear_48008_5258" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F9F9F9"/>
      <stop offset="1" stop-color="#F0F0F0"/>
      </linearGradient>
      </defs>
      </svg>
    </div>
  </div>
  `;
}

/**
 * Generates the HTML for the mobile contact details.
 * @param {string} name - The name of the contact.
 * @param {string} mail - The email of the contact.
 * @param {string} phone - The name of the contact.
 * @param {string} initials - The initials of the contact.
 * @returns {string} - The generated HTML.
 */
function giveContactDetailsMobileHTML(name, mail, initials, id, color, phone) {
  return /*html*/ `
  <div class="headline">

  <div class="headline-mobile-container">
  <span class="headline-text headline-text-container">Contacts</span>
  <div onclick="returnToContactList()"><svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.0682 16.9583H29.2917C30.1432 16.9583 30.8334 17.6486 30.8334 18.5C30.8334 19.3514 30.1432 20.0417 29.2917 20.0417H12.0682L19.2478 27.2212C19.8498 27.8232 19.8498 28.7992 19.2478 29.4011C18.6458 30.0031 17.6698 30.0031 17.0679 29.4011L7.58096 19.9142C6.79991 19.1332 6.79991 17.8668 7.58096 17.0858L17.0679 7.59887C17.6698 6.9969 18.6458 6.9969 19.2478 7.59887C19.8498 8.20084 19.8498 9.17682 19.2478 9.77879L12.0682 16.9583Z" fill="black"/>
    </svg></div>
  </div>

  <span class="headline-subtext headline-text-container font-size-27">
    Better with a team
  </span>


</div>

      <div class="flex-row gap-30 align-center margin-left-60 margin-bottom-20">
          <div id="nameCircle" style="background-color: ${color}">${initials}</div>
          <div class="flex-column">
            <span id="nameDetailCard">${name}</span>
            <div id="addTaskPopUp" onclick="checkScreenWidth()">
              <img src="./assets/img/add_task_contacts.svg" alt="" class="cursor-pointer" />
            </div>
          </div>
        </div>

        <div class="flex-row gap-30 align-center margin-left-60 margin-bottom-20">
          <span class="font-size-21">Contact Information</span>
        </div>

        <div class="flex-column gap-15 margin-left-60 margin-bottom-20">
          <span class="font-weight-700">Email</span>
          <div id="mail">
            <a href="mailto:${mail}" id="contactMailDetail">${mail}</a>
          </div>
        </div>

        <div class="flex-column gap-15 margin-left-60">
  <span class="font-weight-700">Phone</span>
  <div id="phone">
    <a href="${phone || "add Details"}" id="phoneDetail">${
    phone || "add Details"
  }</a>
  </div>
</div>


        <div class="mobile-btn-column">
  <svg   onclick="deleteCard(${id}); returnToContactList() " width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 0.5H30C35.2467 0.5 39.5 4.75329 39.5 10V30C39.5 35.2467 35.2467 39.5 30 39.5H10C4.75329 39.5 0.5 35.2467 0.5 30V10C0.5 4.75329 4.75329 0.5 10 0.5Z" fill="url(#paint0_linear_48008_5258)"/>
    <mask id="mask0_48008_5258" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="4" y="4" width="32" height="32">
    <rect x="4" y="4" width="32" height="32" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_48008_5258)">
    <path d="M13.333 32C12.5997 32 11.9719 31.7389 11.4497 31.2167C10.9275 30.6944 10.6663 30.0667 10.6663 29.3333V12H9.33301V9.33333H15.9997V8H23.9997V9.33333H30.6663V12H29.333V29.3333C29.333 30.0667 29.0719 30.6944 28.5497 31.2167C28.0275 31.7389 27.3997 32 26.6663 32H13.333ZM26.6663 12H13.333V29.3333H26.6663V12ZM15.9997 26.6667H18.6663V14.6667H15.9997V26.6667ZM21.333 26.6667H23.9997V14.6667H21.333V26.6667Z" fill="#2A3647"/>
    </g>
    <path d="M10 0.5H30C35.2467 0.5 39.5 4.75329 39.5 10V30C39.5 35.2467 35.2467 39.5 30 39.5H10C4.75329 39.5 0.5 35.2467 0.5 30V10C0.5 4.75329 4.75329 0.5 10 0.5Z" stroke="#2A3647"/>
    <defs>
    <linearGradient id="paint0_linear_48008_5258" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
    <stop stop-color="#F9F9F9"/>
    <stop offset="1" stop-color="#F0F0F0"/>
    </linearGradient>
    </defs>
    </svg>

    <svg onclick="showEditCard(${id})" width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="50" height="50" rx="10" fill="#2A3647"/>
      <path d="M17.4445 32.0155L22.2638 34.9404L34.907 14.1083C35.1935 13.6362 35.043 13.0211 34.5709 12.7346L31.4613 10.8474C30.9892 10.5608 30.3742 10.7113 30.0876 11.1834L17.4445 32.0155Z" fill="white"/>
      <path d="M16.8604 32.9794L21.6797 35.9043L16.9511 38.1892L16.8604 32.9794Z" fill="white"/>
      </svg>
</div>

  `;
}

function checkScreenWidth() {
  document
    .getElementById("addTaskPopUp")
    .addEventListener("click", checkScreenWidth);

  var screenWidth = window.innerWidth;

  // Definiere die gewünschte Bildschirmbreite, ab der weitergeleitet wird
  var targetWidth = 1351;

  // Überprüfe, ob die Bildschirmbreite größer oder gleich der Zielbreite ist
  if (screenWidth >= targetWidth) {
    // Öffne das Pop-up-Fenster hier
    showAddTaskPopUp();
  } else {
    // Leite zur anderen Seite weiter
    window.location.href = "task_form.html";
  }
}

async function deleteCard(id) {
  try {
    let contacts = await getItem("contacts");
    if (contacts) {
      contacts = JSON.parse(contacts);
      const updatedContacts = contacts.filter((contact) => contact.id !== id);
      await setItem("contacts", JSON.stringify(updatedContacts));
      location.reload();
    }
  } catch (e) {
    console.error("Deleting error:", e);
  }
}

/**
 * Shows the contact card overlay by removing the 'd-none' class from the 'overlay-bg' element.
 *
 */
function showEditCard(id) {
  let overlay = document.getElementById("overlay-edit-bg");
  overlay.classList.remove("d-none");
  loadContactToEditPopUp(id);
}

/**
 * Hides the contact card overlay by adding the 'd-none' class to the 'overlay-bg' element.
 *
 */
function hideEditCard() {
  let overlay = document.getElementById("overlay-edit-bg");
  overlay.classList.add("d-none");
}

function showAddTaskPopUp() {
  let overlay = document.getElementById("overlayPopUpbg");
  overlay.classList.remove("d-none");
}

function hideAddTaskPopUp() {
  let overlay = document.getElementById("overlayPopUpbg");
  overlay.classList.add("d-none");
}

/**
 * @param {string} name - The name of the contact.
 * @param {string} mail - The email of the contact.
 * @param {string} tel - The initials of the contact.
 * @returns {string} - The generated HTML.
 */
function loadContactToEditPopUp(id) {
  let overlayContainer = document.getElementById("overlay-edit-bg");
  let currentContact = contacts.find((contact) => contact.id == id);
  const name = currentContact["name"];
  const mail = currentContact["email"];
  let tel = currentContact["phone"];
  if (!tel) {
    tel = "nicht vergeben";
  } else {
    tel = currentContact["phone"];
  }
  overlayContainer.innerHTML = "";
  overlayContainer.innerHTML += getEditHTML(name, mail, tel, id);
}

function getEditHTML(name, mail, tel, id) {
  return /*html*/ `
    <div id="overlay">
      <div class="overlay-left">
        <img src="./assets/img/logo.svg" alt="" />
        <span class="font-size-61 font-weight-700 small-responsive">Edit contact</span>
        <div class="border-overlay"></div>
      </div>
      <div class="overlay-right">
        <div class="justify-end">
          <div class="close-btn cursor-pointer" onclick="hideEditCard()">
            <svg
              width="31"
              height="31"
              viewBox="0 0 31 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.9614 7.65381L7.65367 22.9616"
                stroke="#2A3647"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M22.8169 23.106L7.50914 7.7982"
                stroke="#2A3647"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
        <div class="form-Avatar">
          <img src="./assets/img/avatar_img.svg" class="avatar" />
          <div class="form center">
            <form onsubmit="saveEditContact('${id}'); return false">
              <div class="center">
                <input required type="text" class="addName" id="addNameID" placeholder="${name}" />
              </div>
              <div class="center">
                <input required type="email" class="addMail" id="addMailID" placeholder="${mail}" />
              </div>
              <div class="center">
                <input required type="number" class="addTel" id="addTelID" placeholder="${tel}" />
              </div>
              <div class="add-close-btn-container">
                <div class="cancel-btn" onclick="hideEditCard()">
                  <span class="font-size-21">Cancel</span>
                  <svg
                    width="31"
                    height="31"
                    viewBox="0 0 31 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.9614 7.65381L7.65367 22.9616"
                      stroke="#2A3647"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M22.8169 23.106L7.50914 7.7982"
                      stroke="#2A3647"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
                <button class="create-edit-btn" type="submit">
                  <span class="font-weight-700 font-size-21">Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Saves the edited contact details for the specified ID.
 *
 * @param {number} id - The ID of the contact to edit.
 * @returns {Promise<void>} A promise that resolves once the contact is successfully edited and saved.
 */
async function saveEditContact(id) {
  console.log("Saving contact");
  let currentContact = contacts.find((contact) => contact.id == id);

  console.log("contacts:", contacts);
  console.log("id:", id);

  if (currentContact) {
    let editedName = document.getElementById("addNameID").value;
    let editedMail = document.getElementById("addMailID").value;
    let editedTel = document.getElementById("addTelID").value;

    // Überprüfe, ob die Werte geändert wurden
    if (editedName.trim() !== "") {
      currentContact.name = editedName;
    }
    if (editedMail.trim() !== "") {
      currentContact.email = editedMail;
    }
    if (editedTel.trim() !== "") {
      currentContact.phone = editedTel;
    }

    try {
      await setItem("contacts", JSON.stringify(contacts));

      // Schließe das Editierungs-Popup
      hideEditCard();
      location.reload();
    } catch (error) {
      console.error("Fehler beim Speichern des Kontakts:", error);
    }
  } else {
    console.error(`Kontakt mit ID "${id}" wurde nicht gefunden.`);
  }
}

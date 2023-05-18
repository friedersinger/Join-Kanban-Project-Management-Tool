contacts = []

async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}


async function createNewPseudoContact(){
  let name = document.getElementById("addName");
  let email = document.getElementById("addMail");
  let phone = document.getElementById("addTel");
  await setNewID();
  contacts.push({
    name: name.value,
    email: email.value,
    phone: phone.value,
    id: currentUserID,
    isPseudoContact: true
  })
  await setItem("contacts", JSON.stringify(contacts));
  resetForm(name, email, phone);
}

function resetForm(name, email, phone) {
  name.value = "";
  phone.value = "";
  email.value = "";
  window.location.reload(); 
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
  await loadContacts();
  await sortContacts();
  for (let i = 0; i < contacts.length; i++) {
    const name = contacts[i]["name"];
    const mail = contacts[i]["email"];
    const id = contacts[i]["id"];
    contactBox.innerHTML += giveContactListHTML(name, mail,id);
  }
}

/**
 * This function sorts the contacts by name by comparing the first letters
 *
 */
async function sortContacts(){
  contacts.sort(function(a, b) {
    let nameA = a.name.toLowerCase();
    let nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  })
  createGroupsByInitialLetter(contacts)
}
let groupedContacts = {};
function createGroupsByInitialLetter(sortedArray) {
  for (let i = 0; i < sortedArray.length; i++) {
    const name = sortedArray[i].name;
    const firstLetter = name[0].toUpperCase();

    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = [];
    }

    groupedContacts[firstLetter].push(sortedArray[i]);
  }
  console.log(groupedContacts);
  console.log(Object.keys(groupedContacts).length);
  return groupedContacts;
}

//über object.keys(groupedContacts) lässt sich durch das array iterieren



function renderContactCard(id) {
  let contactDetailsContainer = document.getElementById("contactDetails");
  let currentContact = contacts.find((contact) => contact.id === id);
  const name = currentContact["name"];
  const mail = currentContact["email"];
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

async function deleteAllContactsFromServer(){
  try {
    contacts = JSON.parse(await getItem("contacts"));
    contacts = [];
    await setItem("contacts", JSON.stringify(contacts));
  } catch (e) {
    console.error("Loading error:", e);
  }
}



/**
 * This function returns the HTML for a single letter in the contact list
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

/*function showRenderContact() {
  let contactContainer = document.getElementById("contactRight");
  let innerContent = document.getElementById("inner-content");

  contactContainer.style.display = "flex";
  innerContent.style.display = "none";
}*/

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

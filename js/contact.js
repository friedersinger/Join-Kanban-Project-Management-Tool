
function giveAlphabet(){
    let contactBox = document.getElementById('contactBox');

    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        contactBox.innerHTML += giveContactListHTML(letter); //
    }
   
}

function showCard(){
  let overlay = document.getElementById('overlay-bg');
  overlay.classList.remove('d-none');
}

function hideCard(){
  let overlay = document.getElementById('overlay-bg');
  overlay.classList.add('d-none');
}

async function getContacts(){
  let contactBox = document.getElementById('contactBox');
  await loadUsers();
  for (let i = 0; i < users.length; i++) {
    const name = users[i]['name'];
    const mail = users[i]['email'];
    contactBox.innerHTML += giveContactListHTML(name, mail);
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


/**
 * This function returns the HTML for a single letter in the contact list
 */

function giveContactListHTML(name, mail){
    return `
    <div class="contact-letter">
    <span class="contact-single-letter">A</span>
    <div class="contact-letter-container" id="letter">
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
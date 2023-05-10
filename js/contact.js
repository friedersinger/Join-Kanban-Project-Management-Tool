let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


function giveAlphabet(){
    let contactBox = document.getElementById('contactBox');

    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        contactBox.innerHTML += giveContactListHTML(letter); //
    }
}

function giveContactListHTML(letter){
    return `
    <div class="contact-letter">
    <span class="contact-single-letter">${letter}</span>
    <div class="contact-letter-container" id="letter">
        <div class="initials-image" id="contactInitials">
          AM
        </div>
        <div class="contact-name-mail">
          <span id="contactName">Anton Mayer</span>
          <a href="mailto:anton@gmail.com" id="contactMail">anton@gmail.com</a>
        </div>
    </div>
  </div>
    `;
}
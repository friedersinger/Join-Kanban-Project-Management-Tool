/**
 * On mobile, users are greeted for 3 seconds and shown the topper and footer
 * as data is fetched. A personalized greeting with the user's name is then
 * displayed, followed by a quick 3-second redirect to summary.html.
 */
async function renderGreetingHello() {
  await init();
  renderWithoutActiveSection();
  document.getElementById("greeting-time-hello").innerText =
    getDaytimeGreeting();
  if (activeUser != "Guest") {
    document.getElementById("greeting-name-mobile").innerText = activeUser;
  }
  setTimeout(() => {
    window.location.href = "summary.html";
  }, 3000);
}

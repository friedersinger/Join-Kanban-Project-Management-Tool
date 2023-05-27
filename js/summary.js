document.addEventListener("DOMContentLoaded", function () {
  const BOTTOMCARD1 = document.getElementById("bottomCard1");
  const BOTTOMCARD2 = document.getElementById("bottomCard2");

  BOTTOMCARD1.addEventListener("mouseenter", function () {
    document
      .getElementById("penIcon")
      .setAttribute("src", "./assets/img/icon_pen_white.svg");
  });
  BOTTOMCARD1.addEventListener("mouseleave", function () {
    document
      .getElementById("penIcon")
      .setAttribute("src", "./assets/img/icon_pen.svg");
  });

  BOTTOMCARD2.addEventListener("mouseenter", function () {
    document
      .getElementById("checkIcon")
      .setAttribute("src", "./assets/img/icon_check_white.svg");
  });
  BOTTOMCARD2.addEventListener("mouseleave", function () {
    document
      .getElementById("checkIcon")
      .setAttribute("src", "./assets/img/icon_check.svg");
  });
});

async function initSummary(){
  await renderGreeting();
  await loadTasks();
  await loadtoDos();
  await loadInProgress();
  await loadFeedback();
  await loadDone();
  countTasks();
}

// /**
//  * shows name of logged in user at greeting
//  */
// function renderGreeting() {
//   document.getElementById("greeting-sentence").innerText = getDaytimeGreeting();
//   document.getElementById("greeting_name").innerText = "Guest";
//   if (activeUser != "Guest") {
//     document.getElementById("greeting_name").innerText = activeUser;
//   }
// }

async function renderGreeting() {
  document.getElementById("greeting_sentence").innerText = getDaytimeGreeting();
  document.getElementById("greeting_name").innerText = `Guest`;
  activeUser = JSON.parse(localStorage.getItem("activeUser")) || [];
  console.log("Active user:", activeUser);
  if (activeUser != "Guest") {
    document.getElementById("greeting_name").innerText = activeUser;
  }
}

/**
 * checks the time and depending on that return a greeting
 * @returns {string} greeting - greeting sentence
 */
function getDaytimeGreeting() {
  let hour = new Date().getHours();
  if (4 <= hour && hour <= 11) {
    return "Good morning,";
  }
  if (11 < hour && hour <= 19) {
    return "Good afternoon,";
  }
  if (19 < hour || hour < 4) {
    return "Good evening,";
  }
}


function redirectToBoard() {
  window.location.href = "board.html";
}


function countTasks() {
  
  let toDoVar = toDo.length;
  let inProgressVar = inProgress.length;
  let feedbackVar = feedback.length;
  let doneVar = done.length;

  let totalTasks = toDoVar + inProgressVar + feedbackVar + doneVar;

  // Anzeige der Variablen in HTML-Elementen
  document.getElementById("counterInProgress").innerHTML = inProgressVar;
  document.getElementById("counterFeedback").innerHTML = feedbackVar;
  document.getElementById("counterAll").innerHTML = totalTasks;
  document.getElementById("openToDo").innerHTML = toDoVar;
  document.getElementById("doneToDos").innerHTML = doneVar;
}

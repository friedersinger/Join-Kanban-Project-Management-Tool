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

async function initSummary() {
  await renderGreeting();
  await loadTasks();
  await loadtoDos();
  await loadInProgress();
  await loadFeedback();
  await loadDone();
  countTasks();
  countUrgent();
}

/**
 * Renders the greeting on the page based on the current user and time of day.
 *
 * @returns {Promise<void>} A promise that resolves once the greeting is rendered.
 */
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

  let totalTasks = tasks.length;

  // Anzeige der Variablen in HTML-Elementen
  document.getElementById("counterInProgress").innerHTML = inProgressVar;
  document.getElementById("counterFeedback").innerHTML = feedbackVar;
  document.getElementById("counterAll").innerHTML = totalTasks;
  document.getElementById("openToDo").innerHTML = toDoVar;
  document.getElementById("doneToDos").innerHTML = doneVar;
}

function countUrgent() {
  let urgentCount = 0;

  tasks.forEach(function (task) {
    if (task.prio === "up") {
      urgentCount++;
    }
  });

  document.getElementById("urgent-counter").innerHTML = urgentCount;
}

document.addEventListener("DOMContentLoaded", function () {
  getCurrentDay();
});

/**
 * users date today
 */
function getCurrentDay() {
  let currentDay = new Date().toLocaleString();
  currentDay = currentDay.slice(0, 10);
  let currentDayArray = currentDay.split(".");
  let currentMonth = getCurrentMonth(currentDayArray[1]);
  currentDay =
    currentMonth + " " + currentDayArray[0] + ", " + currentDayArray[2];

  document.getElementById(
    "currentDate"
  ).innerHTML = `<strong>${currentDay}</strong>`;
}

function getCurrentMonth(i) {
  const date = new Date();
  date.setMonth(i - 1);
  return date.toLocaleString("en-us", { month: "long" });
}

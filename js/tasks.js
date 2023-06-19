let tasks = [];
let subtasks = [];
let currentTaskID = 0;
let selectedCategory;
let currentPrioStatus;
let selectedColor;
let categories = [];

async function initTasks() {
  await loadTasks();
  await loadUsers();
  renderAssignableContacts();
  renderCategoryList();
}

async function addNewTask() {
  await setNewTaskID();
  await loadtoDos();
  let taskTitle = document.getElementById("title");
  let taskDescription = document.getElementById("description");
  let taskDueDate = document.getElementById("datePicker");
  let taskPriority = document.getElementById("priority");
  let taskSub = document.getElementById("subtaskContent");
  let buttonUrgent = document.getElementById("prioUrgent");
  let buttonMedium = document.getElementById("prioMedium");
  let buttonLow = document.getElementById("prioLow");

  tasks.push({
    title: taskTitle.value,
    description: taskDescription.value,
    category: selectedCategory,
    prio: currentPrioStatus,
    color: selectedColor,
    assignments: validateForm(),
    dueDate: taskDueDate.value,
    taskSub: subtasks,
    id: currentTaskID,

    /*assignName: assignName.value*/
  });

  toDo.push(currentTaskID);

  const taskAddedElement = document.getElementById("taskAdded");
  taskAddedElement.classList.remove("d-none"); // Entferne die Klasse "d-none", um das Element anzuzeigen

  setTimeout(() => {
    taskAddedElement.classList.add("d-none"); // Füge die Klasse "d-none" hinzu, um das Element auszublenden
    redirectToBoard(); // Rufe die Funktion zum Neuladen der Seite auf
  }, 1000); // Warte vier Sekunden (4000 Millisekunden) und führe dann den Code im setTimeout-Callback aus

  await setItem("tasks", JSON.stringify(tasks));
  await setItem("toDo", JSON.stringify(toDo));
}

async function subTasksLoad() {
  subtasks = [];
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
  }
}

async function setNewTaskID() {
  try {
    let res = JSON.parse(await getItem("currentTaskID"));
    currentTaskID = res + 1;
    await setItem("currentTaskID", JSON.stringify(currentTaskID));
  } catch (e) {
    currentTaskID = 1; //problem: if some network error occurs, the current task id is set to 1 --> try/catch? // alternative: if(tasks.length <=1 ....)
    await setItem("currentTaskID", JSON.stringify(currentTaskID));
  }
}

async function loadTasks() {
  try {
    tasks = JSON.parse(await getItem("tasks"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

async function subTaskAddToJson() {
  let task = document.getElementById("subtask-input-content");

  subtasks.push({
    task: task.value,
  });

  addNewSubTask();
  task.value = "";
}

async function addNewSubTask() {
  let subtaskContent = document.getElementById("subtaskContent");
  subtaskContent.innerHTML = "";

  for (let i = 0; i < subtasks.length; i++) {
    let task = subtasks[i]["task"];
    subtaskContent.innerHTML += `
    <div>${task}</div>`;
  }
}

async function editTaskBoard(id) {
  let currentTask = tasks.find((task) => task.id == id);
  let taskTitle = document.getElementById("title");
  let taskDescription = document.getElementById("description");
  let taskDueDate = document.getElementById("datePicker");

  currentTask["title"] = taskTitle.value;
  currentTask["description"] = taskDescription.value;
  currentTask["category"] = document.getElementById("categoryEdit").innerText;
  currentTask["prio"] = document.getElementById("prioValue").innerText;
  currentTask["color"] = selectedColor;
  currentTask["assignments"] = validateForm();
  currentTask["dueDate"] = taskDueDate.value;
  currentTask["taskSub"] = subtasks;

  const taskAddedElement = document.getElementById("taskAdded");
  taskAddedElement.classList.remove("d-none"); // Entferne die Klasse "d-none", um das Element anzuzeigen

  setTimeout(() => {
    taskAddedElement.classList.add("d-none"); // Füge die Klasse "d-none" hinzu, um das Element auszublenden
    reloadPage(); // Rufe die Funktion zum Neuladen der Seite auf
  }, 1000);

  await setItem("tasks", JSON.stringify(tasks));
  await setItem("toDo", JSON.stringify(toDo));
}

function setCategory() {}

async function deleteAllTasksFromServer() {
  try {
    tasks = JSON.parse(await getItem("tasks"));
    toDo = JSON.parse(await getItem("toDo"));
    inProgress = JSON.parse(await getItem("inProgress"));
    feedback = JSON.parse(await getItem("feedback"));
    done = JSON.parse(await getItem("done"));
    tasks = [];
    toDo = [];
    inProgress = [];
    feedback = [];
    done = [];
    await setItem("tasks", JSON.stringify(tasks));
    await setItem("toDo", JSON.stringify(toDo));
    await setItem("inProgress", JSON.stringify(inProgress));
    await setItem("feedback", JSON.stringify(feedback));
    await setItem("done", JSON.stringify(done));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

async function TaskButtonUrgent() {
  let buttonUrgent = document.getElementById("prioUrgent");
  let buttonMedium = document.getElementById("prioMedium");
  let buttonLow = document.getElementById("prioLow");
  buttonUrgent.style.backgroundColor = "#FF3D00";
  buttonUrgent.style.filter = "contrast(1)";
  buttonMedium.style.filter = "contrast(1)";
  buttonLow.style.filter = "contrast(1)";
  buttonMedium.style.backgroundColor = "white";
  buttonLow.style.backgroundColor = "white";
  buttonMedium.style.color = "black";
  buttonUrgent.style.color = "white";
  buttonLow.style.color = "black";

  // Setze das Bild für "Medium" zurück
  let imageMedium = document.getElementById("imgMedium");
  imageMedium.style.filter = "none";

  // Setze das Bild für "Low" zurück
  let imageLow = document.getElementById("imgLow");
  imageLow.style.filter = "none";

  let imageUrgent = document.getElementById("imgUrgent");
  imageUrgent.style.filter = "brightness(10000%) contrast(1000%)";
}

function getPrioStatus(prioStatus) {
  currentPrioStatus = prioStatus;
}

function setPrioStatus(prioStatus) {
  let prioValue = document.getElementById("prioValue");
  prioValue.innerText = prioStatus;
}

async function TaskButtonMedium() {
  let buttonUrgent = document.getElementById("prioUrgent");
  let buttonMedium = document.getElementById("prioMedium");
  let buttonLow = document.getElementById("prioLow");
  buttonUrgent.style.backgroundColor = "white";
  buttonMedium.style.backgroundColor = "#FFA800";
  buttonUrgent.style.filter = "contrast(1)";
  buttonMedium.style.filter = "contrast(1)";
  buttonLow.style.filter = "contrast(1)";
  buttonMedium.style.color = "white";
  buttonUrgent.style.color = "black";
  buttonLow.style.color = "black";
  buttonLow.style.backgroundColor = "white";

  // Setze das Bild für "Urgent" zurück
  let imageUrgent = document.getElementById("imgUrgent");
  imageUrgent.style.filter = "none";

  // Setze das Bild für "Low" zurück
  let imageLow = document.getElementById("imgLow");
  imageLow.style.filter = "none";

  let imageMedium = document.getElementById("imgMedium");
  imageMedium.style.filter = "brightness(10000%) contrast(1000%)";
}

async function TaskButtonLow() {
  let buttonUrgent = document.getElementById("prioUrgent");
  let buttonMedium = document.getElementById("prioMedium");
  let buttonLow = document.getElementById("prioLow");
  buttonUrgent.style.backgroundColor = "white";
  buttonMedium.style.backgroundColor = "white";
  buttonLow.style.backgroundColor = "#7AE229";
  buttonUrgent.style.filter = "contrast(1)";
  buttonMedium.style.filter = "contrast(1)";
  buttonLow.style.filter = "contrast(1)";
  buttonMedium.style.color = "black";
  buttonUrgent.style.color = "black";
  buttonLow.style.color = "white";

  // Setze das Bild für "Urgent" zurück
  let imageUrgent = document.getElementById("imgUrgent");
  imageUrgent.style.filter = "none";

  // Setze das Bild für "Medium" zurück
  let imageMedium = document.getElementById("imgMedium");
  imageMedium.style.filter = "none";

  let imageLow = document.getElementById("imgLow");
  imageLow.style.filter = "brightness(10000%) contrast(1000%)";
}

function reloadPage() {
  location.reload();
}

function redirectToBoard() {
  window.location.href = "board.html";
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

// Funktion, um das Pop-up-Fenster anzuzeigen
function showAddTaskPopUp() {
  var overlay = document.getElementById("addTaskPopUp");
  overlay.style.display = "block";
}

// Funktion, um das Pop-up-Fenster zu verstecken
function hideAddTaskPopUp() {
  var overlay = document.getElementById("addTaskPopUp");
  overlay.style.display = "none";
}

function checkScreenWidth() {
  document
    .getElementById("editTaskPopUp")
    .addEventListener("click", checkScreenWidth);

  var screenWidth = window.innerWidth;

  // Definiere die gewünschte Bildschirmbreite, ab der weitergeleitet wird
  var targetWidth = 1351;

  // Überprüfe, ob die Bildschirmbreite größer oder gleich der Zielbreite ist
  if (screenWidth >= targetWidth) {
    // Öffne das Pop-up-Fenster hier
    showEditTaskPopUp();
  } else {
    // Leite zur anderen Seite weiter
    window.location.href = "task_form.html";
  }
}

// Funktion, um das Pop-up-Fenster anzuzeigen
function showEditTaskPopUp() {
  var overlay = document.getElementById("editTaskPopUp");
  overlay.style.display = "block";
}

// Funktion, um das Pop-up-Fenster zu verstecken
function hideEditTaskPopUp() {
  var overlay = document.getElementById("editTaskPopUp");
  overlay.style.display = "none";
}

async function renderAssignableContacts() {
  let assignableContactsContainer = document.getElementById("dropdownContent");
  for (let i = 0; i < users.length; i++) {
    const name = users[i]["name"];
    const id = users[i]["id"];

    const div = document.createElement("div");
    div.className = "dropdown-object";
    div.addEventListener("click", function () {
      toggleCheckbox(id);
    });

    const span = document.createElement("span");
    span.innerText = name;
    div.appendChild(span);

    const checkbox = document.createElement("input");
    checkbox.id = id;
    checkbox.type = "checkbox";
    checkbox.value = name;
    checkbox.dataset.id = id;
    checkbox.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    div.appendChild(checkbox);
    assignableContactsContainer.appendChild(div);
  }
}

function toggleCheckbox(checkboxId) {
  var checkbox = document.getElementById(checkboxId);
  checkbox.checked = !checkbox.checked;
}

function renderCategoryList() {
  let categoryListContainer = document.getElementById(
    "dropdownCategoryContent"
  );
  categoryListContainer.innerHTML = "";
  categoryListContainer.innerHTML += `
    <div class="dropdown-object">
      <div onclick="renderNewCategoryField()" id="newCategory">New category</div>  
    </div>

    <div class="dropdown-object">
      <div onclick="saveSelectedCategory(this, '${"red"}')" class="flex-row">
        <span>Backoffice</span>
        <div class="category-color margin-left-10" style="background-color: red" id="backofficeField"></div>
      </div>
      
    </div>

    <div class="dropdown-object">
      <div onclick="saveSelectedCategory(this, '${"pink"}')" class="flex-row">
        <span>Sales</span>
        <div class="category-color margin-left-10" style="background-color: pink"></div>
      </div>
    </div>
  `;
}

function renderNewCategoryField() {
  let dropdownField = document.getElementById("dropdownMinCategory");
  document.getElementById("select-color-category").classList.remove("d-none");

  dropdownField.innerHTML = /*html*/ `
    <div class="flex-row space-between align-center">
    <input placeholder="Enter new category" id="new-category" class="category-input" onclick="stopDropdown(event)">

      <div class="flex-row align-center height-100">
      <img src="./assets/img/close-button-addtask.svg" onclick="clearSelections()">

        <div class="vert-border"></div>
        <button class="newCategory" onclick="checkNewCategory(); stopDropdown(event);" type="button"><img
        src="assets/img/check-addtask.svg"></button>
      </div>
    </div>
  `;
  toggleDropdownCategory();
}

function stopDropdown(event) {
  event.stopPropagation();
}

function clearSelections() {
  renderNormalCategoryField();
  renderCategoryList();
  toggleDropdownCategory();
  hideSelectColor();
  hideErrorMessage();
  hideCategoryDisplay();
}

function hideSelectColor() {
  document.getElementById("select-color-category").classList.add("d-none");
}

function hideErrorMessage() {
  document.getElementById("errorMessage").textContent = "";
}

function hideCategoryDisplay() {
  document.getElementById("categoryDisplay").style.display = "none";
  document.getElementById("categoryDisplay").textContent = "";
}

function renderNormalCategoryField() {
  document.getElementById("categoryDisplay").style.display = "none";

  let dropdownField = document.getElementById("dropdownMinCategory");
  dropdownField.innerHTML = `
    <span>Select category</span>
    <img src="./assets/img/arrow_down_black.svg" alt="">
  `;
}

function saveSelectedCategory(element, color) {
  selectedCategory = element.innerText;
  let dataField = document.getElementById("categoryEdit");
  dataField.innerText = selectedCategory;
  let dropdownMin = document.getElementById("dropdownMinCategory");
  dropdownMin.querySelector("span").innerText = selectedCategory;
  selectedColor = color;
  toggleDropdownCategory();
}

function toggleDropdown() {
  let dropdownContent = document.getElementById("dropdownContent");
  let dropdownMin = document.getElementById("dropdownMin");
  dropdownContent.classList.toggle("show");
  dropdownMin.classList.toggle("open");
}

function toggleDropdownCategory() {
  let dropdownContent = document.getElementById("dropdownCategoryContent");
  let dropdownMin = document.getElementById("dropdownMinCategory");
  dropdownContent.classList.toggle("show");
  dropdownMin.classList.toggle("open");
}

// Funktion zum Auslesen der ausgewählten Checkbox-Werte
function validateForm() {
  let selectedValues = [];
  let checkboxes = document.querySelectorAll(
    "#dropdownContent input[type=checkbox]:checked"
  );

  for (var i = 0; i < checkboxes.length; i++) {
    const value = checkboxes[i].value;
    const id = checkboxes[i].dataset.id;
    selectedValues.push({ id, name: value });
  }
  return selectedValues;
}

function clearCheckboxes() {
  let checkboxes = document.querySelectorAll(
    "#dropdownContent input[type=checkbox]:checked"
  );

  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
  toggleDropdown();
}

function updateTaskCardIcons(id) {
  const imgUrgentTask = document.getElementById("imgUrgentTask");
  const imgMediumTask = document.getElementById("imgMediumTask");
  const imgLowTask = document.getElementById("imgLowTask");

  if (imgUrgentTask && imgMediumTask && imgLowTask) {
    // Verstecke alle Icons
    imgUrgentTask.classList.add("d-none");
    imgMediumTask.classList.add("d-none");
    imgLowTask.classList.add("d-none");

    // Zeige das entsprechende Icon basierend auf prio
    if (id === "urgent") {
      imgUrgentTask.classList.remove("d-none");
    } else if (id === "medium") {
      imgMediumTask.classList.remove("d-none");
    } else if (id === "low") {
      imgLowTask.classList.remove("d-none");
    }
  }
}

/**
 * Selects a color.
 *
 * @param {number} id - The ID of the selected color.
 */
function selectColor(id) {
  // Remove "selected-color" class from all colors
  for (let i = 1; i < 8; i++) {
    document.getElementById(`color${i}`).classList.remove("selected-color");
  }
  // Add "selected-color" class to the chosen color
  document.getElementById(`color${id}`).classList.add("selected-color");
  selectedColor = document.getElementById(`color${id}`).style.backgroundColor;
}

/**
 * Checks if a new category can be created.
 * Calls createNewCategory() if a color is selected and a category name is entered.
 * Otherwise, displays an alert message and hides the label.
 */
function checkNewCategory() {
  const newCategoryInput = document.getElementById("new-category");
  const categoryDisplay = document.getElementById("categoryDisplay");
  const dataField = document.getElementById("categoryEdit");

  if (selectedColor && newCategoryInput.value !== "") {
    selectedCategory = newCategoryInput.value;
    dataField.innerText = newCategoryInput.value;
    displayCategory(selectedCategory);
  } else {
    displayErrorMessage("Please insert a category name and a color!");
  }

  // Clear category display if input is empty
  if (newCategoryInput.value === "") {
    hideCategoryDisplay(categoryDisplay);
  }
}

function displayCategory(category) {
  const categoryDisplay = document.getElementById("categoryDisplay");
  const selectedCategory = categoryDisplay.textContent;

  // Check if the selected category is different from the new category
  if (selectedCategory !== category) {
    hideCategoryDisplay(categoryDisplay);
  }

  categoryDisplay.style.display = "block";
  categoryDisplay.textContent = category;
}

function displayErrorMessage(message) {
  const errorMessage = document.createElement("span");
  errorMessage.textContent = message;
  document.getElementById("errorMessage").appendChild(errorMessage);
}

function hideLabel() {
  document.getElementById("errorMessage").textContent = "";
}

function hideCategoryDisplay() {
  const categoryDisplay = document.getElementById("categoryDisplay");
  categoryDisplay.style.display = "none";
  categoryDisplay.textContent = "";
}

// /**
//  * Hides the label by setting its display property to "none".
//  */
// function hideLabel() {
//   document.getElementById("toggleDrop").style.display = "none";
// }

document.addEventListener("DOMContentLoaded", function () {
  const datePicker = document.getElementById("datePicker");
  if (datePicker) {
    const currentDate = new Date().toISOString().split("T")[0];
    datePicker.setAttribute("min", currentDate);
  }
});

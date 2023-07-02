let tasks = [];
let subtasks = [];
let currentTaskID = 0;
let selectedCategory;
let currentPrioStatus;
let selectedColor;
let categories = [];

/**
 * Initializes the tasks by loading data, rendering assignable contacts, and rendering the category list.
 *
 * @returns {Promise<void>} A promise that resolves once the tasks are initialized.
 */
async function initTasks() {
  await loadTasks();
  await loadUsers();
  renderAssignableContacts();
  renderCategoryList();
}

/**
 * Adds a new task by setting its properties based on user input, updating relevant data,
 * and performing necessary actions like redirecting or reloading the page.
 *
 * @returns {Promise<void>} A promise that resolves once the new task is added.
 */
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

  // Überprüfung, ob alle Felder ausgefüllt sind
  if (
    taskTitle.value === "" ||
    taskDescription.value === "" ||
    taskDueDate.value === "" ||
    currentPrioStatus === undefined ||
    selectedCategory === undefined ||
    taskSub.value === ""
  ) {
    // Zeige den Text im Div an, welches Feld ausgefüllt werden muss
    let taskAlert = document.getElementById("taskAlert");
    taskAlert.innerHTML = ""; // Leere den vorherigen Text
    if (taskTitle.value === "")
      taskAlert.innerHTML += "Feld 'Titel' muss ausgefüllt werden.<br>";
    if (taskDescription.value === "")
      taskAlert.innerHTML += "Feld 'Beschreibung' muss ausgefüllt werden.<br>";
    if (taskDueDate.value === "")
      taskAlert.innerHTML +=
        "Feld 'Fälligkeitsdatum' muss ausgefüllt werden.<br>";
    if (currentPrioStatus === undefined)
      taskAlert.innerHTML += "Feld 'Priorität' muss ausgefüllt werden.<br>";
    if (selectedCategory === undefined)
      taskAlert.innerHTML += "Feld 'Category' muss ausgefüllt werden.<br>";
    if (taskSub.value === "")
      taskAlert.innerHTML += "Feld 'Unteraufgabe' muss ausgefüllt werden.<br>";
    return; // Beende die Funktion, da nicht alle Felder ausgefüllt sind
  }

  tasks.push({
    title: taskTitle.value,
    description: taskDescription.value,
    category: selectedCategory,
    prio: currentPrioStatus,
    color: selectedColor,
    assignments: validateAssignmentForm(),
    dueDate: taskDueDate.value,
    taskSub: subtasks,
    subtasksOpened: subtasks,
    subtasksClosed: [],
    id: currentTaskID,
  });

  let status = "toDo"; // Standardwert: toDo
  const urlParams = new URLSearchParams(window.location.search);
  const urlStatus = urlParams.get("status");
  if (
    urlStatus === "feedback" ||
    urlStatus === "inProgress" ||
    urlStatus === "done"
  ) {
    status = urlStatus;
  }

  eval(status).push(currentTaskID);

  const taskAddedElement = document.getElementById("taskAdded");
  taskAddedElement.classList.remove("d-none"); // Entferne die Klasse "d-none", um das Element anzuzeigen

  setTimeout(() => {
    taskAddedElement.classList.add("d-none"); // Füge die Klasse "d-none" hinzu, um das Element auszublenden
    redirectToBoard(); // Rufe die Funktion zum Neuladen der Seite auf
  }, 1000); // Warte vier Sekunden (4000 Millisekunden) und führe dann den Code im setTimeout-Callback aus

  await setItem("tasks", JSON.stringify(tasks));
  await setItem(status, JSON.stringify(eval(status)));
}

/**
 * Loads the subtasks from the subtasks array and performs actions on each subtask.
 *
 * @returns {Promise<void>} A promise that resolves once the subtasks are loaded.
 */
async function subTasksLoad() {
  subtasks = [];
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
  }
}

/**
 * Sets a new task ID by retrieving the current ID, incrementing it, and saving it.
 *
 * @returns {Promise<void>} A promise that resolves once the new task ID is set.
 */
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

/**
 * Loads tasks from storage by retrieving and parsing the "tasks" item.
 *
 * @returns {Promise<void>} A promise that resolves once the tasks are loaded.
 */
async function loadTasks() {
  try {
    tasks = JSON.parse(await getItem("tasks"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Adds a subtask to the subtasks array based on user input.
 *
 * @returns {Promise<void>} A promise that resolves once the new subtask is added.
 */
async function subTaskAddToJson() {
  let task = document.getElementById("subtask-input-content");

  subtasks.push({
    task: task.value,
  });

  addNewSubTask();
  task.value = "";
}

function subTaskDelete() {
  document.getElementById("subtask-input-content").value = "";
  subtasks = [];
  document.getElementById("subtaskContent").innerHTML = "";
}

/**
 * Adds a subtask to the subtasks and subtasksOpened arrays of a task specified by ID.
 *
 * @param {number} id - The ID of the task to add the subtask to.
 * @returns {Promise<void>} A promise that resolves once the new subtask is added.
 */
async function addSubtaskFromEdit(id) {
  let currentTask = tasks.find((task) => task.id == id);
  let task = document.getElementById("subtask-input-content");
  currentTask["taskSub"].push({
    task: task.value,
  });
  currentTask["subtasksOpened"].push({
    task: task.value,
  });
  await showTickableSubtasks(currentTask);
  task.value = "";
}

/**
 * Adds the newly created subtasks to the subtask content area.
 *
 * @returns {Promise<void>} A promise that resolves once the new subtasks are added.
 */
async function addNewSubTask() {
  let subtaskContent = document.getElementById("subtaskContent");
  subtaskContent.innerHTML = "";

  for (let i = 0; i < subtasks.length; i++) {
    let task = subtasks[i]["task"];
    subtaskContent.innerHTML += `
    <div>${task}</div>`;
  }
}

/**
 * Edits a task's properties based on user input and performs necessary actions like reloading the page.
 *
 * @param {number} id - The ID of the task to edit.
 * @returns {Promise<void>} A promise that resolves once the task is edited.
 */
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
  currentTask["assignments"] = validateAssignmentForm();
  currentTask["dueDate"] = taskDueDate.value;
  validateSubtasksForm(currentTask);

  const taskAddedElement = document.getElementById("taskAdded");
  taskAddedElement.classList.remove("d-none"); // Entferne die Klasse "d-none", um das Element anzuzeigen

  setCategoryForEdit(currentTask);

  setTimeout(() => {
    taskAddedElement.classList.add("d-none"); // Füge die Klasse "d-none" hinzu, um das Element auszublenden
    reloadPage(); // Rufe die Funktion zum Neuladen der Seite auf
  }, 1000);

  await setItem("tasks", JSON.stringify(tasks));
  await setItem("toDo", JSON.stringify(toDo));
}

/**
 * Sets the category for editing a task.
 *
 * @param {object} currentTask - The current task being edited.
 * @returns {Promise<void>} A promise that resolves once the category is set.
 */
async function setCategoryForEdit(currentTask) {
  document.getElementById("categoryEdit").innerText = currentTask["category"];
}

/**
 * Deletes all tasks from the server by clearing relevant data arrays and updating storage.
 *
 * @returns {Promise<void>} A promise that resolves once all tasks are deleted.
 */
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

/**
 * Sets the priority status of a task to "Urgent".
 *
 * @returns {void}
 */
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

/**
 * Sets the priority status of a task to "Medium".
 *
 * @returns {void}
 */
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

/**
 * Sets the priority status of a task to "Low".
 *
 * @returns {void}
 */
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

/**
 * Function to reload the current page.
 */
function reloadPage() {
  location.reload();
}

/**
 * Function to redirect to the "board.html" page.
 */
function redirectToBoard() {
  window.location.href = "board.html";
}

/**
 * Function to check the screen width and perform corresponding actions.
 */
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

/**
 * Function to show the add task pop-up window.
 */
function showAddTaskPopUp() {
  var overlay = document.getElementById("addTaskPopUp");
  overlay.style.display = "block";
}

/**
 * Function to hide the add task pop-up window.
 */
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

/**
 * Function to show the edit task pop-up window.
 */
function showEditTaskPopUp() {
  var overlay = document.getElementById("editTaskPopUp");
  overlay.style.display = "block";
}

/**
 * Function to hide the edit task pop-up window.
 */
function hideEditTaskPopUp() {
  var overlay = document.getElementById("editTaskPopUp");
  overlay.style.display = "none";
}

/**
 * Function to render the assignable contacts.
 */
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

/**
 * Function to toggle the state of a checkbox.
 *
 * @param {string} checkboxId - The ID of the checkbox.
 */
function toggleCheckbox(checkboxId) {
  var checkbox = document.getElementById(checkboxId);
  checkbox.checked = !checkbox.checked;
}

/**
 * Function to render the category list.
 */
function renderCategoryList() {
  let categoryListContainer = document.getElementById(
    "dropdownCategoryContent"
  );
  categoryListContainer.innerHTML = "";
  categoryListContainer.innerHTML += `
  <div class="dropdown-object" onclick="renderNewCategoryField()">
    <div id="newCategory">New category</div>  
  </div>


    <div class="dropdown-object" onclick="saveSelectedCategory(this, '${"red"}')">
    <div class="flex-row">
      <span>Backoffice</span>
      <div class="category-color margin-left-10" style="background-color: red" id="backofficeField"></div>
    </div>
  </div>
  
  <div class="dropdown-object" onclick="saveSelectedCategory(this, '${"pink"}')">
    <div class="flex-row">
      <span>Sales</span>
      <div class="category-color margin-left-10" style="background-color: pink"></div>
    </div>
  </div>
  
  `;
}

/**
 * Renders a new category field in the dropdown menu.
 */
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

/**
 * Stops the propagation of the event to parent elements.
 *
 * @param {Event} event - The event object.
 */
function stopDropdown(event) {
  event.stopPropagation();
}

/**
 * Clears the selections made in the dropdown menu.
 */
function clearSelections() {
  renderNormalCategoryField();
  renderCategoryList();
  toggleDropdownCategory();
  hideSelectColor();
  hideErrorMessage();
  hideCategoryDisplay();
}

/**
 * Hides the select color section in the dropdown menu.
 */
function hideSelectColor() {
  document.getElementById("select-color-category").classList.add("d-none");
}

/**
 * Hides the error message.
 */
function hideErrorMessage() {
  document.getElementById("errorMessage").textContent = "";
}

/**
 * Hides the category display section.
 */
function hideCategoryDisplay() {
  document.getElementById("categoryDisplay").style.display = "none";
  document.getElementById("categoryDisplay").textContent = "";
}

/**
 * Renders the normal category field in the dropdown menu.
 */
function renderNormalCategoryField() {
  document.getElementById("categoryDisplay").style.display = "none";

  let dropdownField = document.getElementById("dropdownMinCategory");
  dropdownField.innerHTML = `
    <span>Select category</span>
    <img src="./assets/img/arrow_down_black.svg" alt="">
  `;
}

/**
 * Saves the selected category and its color.
 *
 * @param {Element} element - The selected category element.
 * @param {string} color - The selected color.
 */
function saveSelectedCategory(element, color) {
  selectedCategory = element.innerText;
  let dataField = document.getElementById("categoryEdit");
  dataField.innerText = selectedCategory;
  let dropdownMin = document.getElementById("dropdownMinCategory");
  dropdownMin.querySelector("span").innerText = selectedCategory;
  selectedColor = color;
  toggleDropdownCategory();
}

/**
 * Toggles the visibility of the dropdown menu.
 */
function toggleDropdown() {
  let dropdownContent = document.getElementById("dropdownContent");
  let dropdownMin = document.getElementById("dropdownMin");
  dropdownContent.classList.toggle("show");
  dropdownMin.classList.toggle("open");
}

/**
 * Toggles the visibility of the category dropdown menu.
 */
function toggleDropdownCategory() {
  let dropdownContent = document.getElementById("dropdownCategoryContent");
  let dropdownMin = document.getElementById("dropdownMinCategory");
  dropdownContent.classList.toggle("show");
  dropdownMin.classList.toggle("open");
}

/**
 * Validates the assignment form and returns the selected checkbox values.
 *
 * @returns {Array} - An array of selected checkbox values.
 */
function validateAssignmentForm() {
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

/**
 * Clears the checked state of all checkboxes in the dropdown menu.
 */
function clearCheckboxes() {
  let checkboxes = document.querySelectorAll(
    "#dropdownContent input[type=checkbox]:checked"
  );

  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
  toggleDropdown();
}

/**
 * Updates the task card icons based on the provided ID.
 *
 * @param {string} id - The ID of the task.
 */
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

/**
 * Displays the selected category.
 *
 * @param {string} category - The selected category.
 */
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

/**
 * Displays an error message.
 *
 * @param {string} message - The error message to display.
 */
function displayErrorMessage(message) {
  const errorMessage = document.createElement("span");
  errorMessage.textContent = message;
  document.getElementById("errorMessage").appendChild(errorMessage);
}

function hideLabel() {
  document.getElementById("errorMessage").textContent = "";
}

/**
 * Hides the category display section.
 */
function hideCategoryDisplay() {
  const categoryDisplay = document.getElementById("categoryDisplay");
  categoryDisplay.style.display = "none";
  categoryDisplay.textContent = "";
}

/**
 * Event listener that executes the specified code when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  const datePicker = document.getElementById("datePicker");
  if (datePicker) {
    const currentDate = new Date().toISOString().split("T")[0];
    datePicker.setAttribute("min", currentDate);
  }
});

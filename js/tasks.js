let tasks = [];
let subtasks = [];
let currentTaskID = 0;

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
  // let ownCategory = document.getElementById("textInput");
  // let taskColor = document.getElementById("color");
  let taskDueDate = document.getElementById("datePicker");
  let taskPriority = document.getElementById("priority");
  let taskSub = document.getElementById("subtaskContent");
  let buttonUrgent = document.getElementById("prioUrgent");
  let buttonMedium = document.getElementById("prioMedium");
  let buttonLow = document.getElementById("prioLow");

  tasks.push({
    title: taskTitle.value,
    description: taskDescription.value,
    category: getSelectedOption(),
    assignments: validateForm(),
    dueDate: taskDueDate.value,
    taskSub: taskSub.value,
    id: currentTaskID,
  });

  toDo.push(currentTaskID);

  clearTaskForm();

  const taskAddedElement = document.getElementById("taskAdded");
  taskAddedElement.classList.remove("d-none"); // Entferne die Klasse "d-none", um das Element anzuzeigen

  setTimeout(() => {
    taskAddedElement.classList.add("d-none"); // Füge die Klasse "d-none" hinzu, um das Element auszublenden
  }, 3000); // Warte drei Sekunden (3000 Millisekunden) und führe dann den Code im setTimeout-Callback aus

  await setItem("tasks", JSON.stringify(tasks));
  await setItem("toDo", JSON.stringify(toDo));
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

function getSelectedOption() {
  var selectElement = document.querySelector(".form-select");
  var selectedOption = selectElement.options[selectElement.selectedIndex].text;
  return selectedOption;
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

async function TaskButtonMedium() {
  let buttonUrgent = document.getElementById("prioUrgent");
  let buttonMedium = document.getElementById("prioMedium");
  let buttonLow = document.getElementById("prioLow");
  buttonUrgent.style.backgroundColor = "white";
  buttonMedium.style.backgroundColor = "#FFA800";
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

async function clearTaskForm() {
  let taskTitle = document.getElementById("title");
  let taskDescription = document.getElementById("description");
  let taskCategory = document.getElementById("category");
  //let taskColor = document.getElementById("color");
  let taskDueDate = document.getElementById("datePicker");
  //let taskPriority = document.getElementById("priority");
  let taskSub = document.getElementById("subtaskContent");
  let buttonUrgent = document.getElementById("prioUrgent");
  let buttonMedium = document.getElementById("prioMedium");
  let buttonLow = document.getElementById("prioLow");

  taskTitle.value = "";
  taskDescription.value = "";
  taskCategory.value = "";
  //taskColor.value = "";
  clearCheckboxes(), (taskDueDate.value = "");
  //taskPriority.value = "";
  taskSub.value = "";

  buttonUrgent.style.backgroundColor = "white";
  buttonMedium.style.backgroundColor = "white";
  buttonLow.style.backgroundColor = "white";
}

function getSelectedOption() {
  var dropdown = document.querySelector(".form-select");
  var selectedValue = dropdown.value;

  var inputField = document.getElementById("inputField");

  if (selectedValue === "1") {
    inputField.style.display = "block";
  } else {
    inputField.style.display = "none";
  }
}

function pickedColor(colorId) {
  const selectedColorOption = document.getElementById(colorId);

  if (selectedColorOption.classList.contains("selected")) {
    // If the clicked color option is already selected, remove the class
    selectedColorOption.classList.remove("selected");
  } else {
    // Remove the class from the previously selected color option
    const prevSelectedColorOption = document.querySelector(
      ".color-option.selected"
    );
    if (prevSelectedColorOption) {
      prevSelectedColorOption.classList.remove("selected");
    }

    // Add the class to the clicked color option
    selectedColorOption.classList.add("selected");

    console.log("Chosen color:", {
      color: selectedColorOption.style.backgroundColor,
    });
  }

  let selectedColor = selectedColorOption.style.backgroundColor;

  return {
    selectedColor,
  };
}

// Überprüfe die Bildschirmbreite und öffne das Pop-up-Fenster oder leite weiter
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

async function renderAssignableContacts() {
  let assignableContactsContainer = document.getElementById("dropdownContent");
  for (let i = 0; i < users.length; i++) {
    const name = users[i]["name"];
    assignableContactsContainer.innerHTML += `
      <div class="dropdown-object">
        <span>${name}</span>
        <input type="checkbox" value="${name}">
      </div>
      `;
  }
}

function renderCategoryList(){
  let categoryListContainer = document.getElementById('dropdownCategoryContent');
  categoryListContainer.innerHTML += `
  <div class="dropdown-object">
        <div onclick="saveSelectedCategory(this) id="newCategory">New category</div>  
  </div>

  <div class="dropdown-object">
        <div onclick="saveSelectedCategory(this)">Backoffice</div>
  </div>

  <div class="dropdown-object">
        <div onclick="saveSelectedCategory(this)">Sales</div>
  </div>
  `
}

function saveSelectedCategory(element) {
  var selectedCategory = element.innerText;
  var dropdownMin = document.getElementById('dropdownMinCategory');
  dropdownMin.querySelector('span').innerText = selectedCategory;
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
    selectedValues.push(checkboxes[i].value);
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

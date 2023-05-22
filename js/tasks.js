let tasks = [];
let subtasks = [];
let currentTaskID = 0;

async function initTasks() {
  loadTasks();
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
    assignments: getSelectedAssignment(),
    dueDate: "taskDueDate.value",
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

function getSelectedAssignment() {
  selectElement = document.getElementById("assignMenu");
  var selectedAssignment =
    selectElement.options[selectElement.selectedIndex].text;
  return selectedAssignment;
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
  let image = document.getElementById("imgUrgent");
  image.style.filter = "brightness(10000%) contrast(1000%)";
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
}

async function clearTaskForm() {
  let taskTitle = document.getElementById("title");
  let taskDescription = document.getElementById("description");
  let taskCategory = document.getElementById("category");
  let taskColor = document.getElementById("color");
  let taskAssignments = document.getElementById("assignments");
  let taskDueDate = document.getElementById("datePicker");
  let taskPriority = document.getElementById("priority");
  let taskSub = document.getElementById("subtaskContent");
  let buttonUrgent = document.getElementById("prioUrgent");
  let buttonMedium = document.getElementById("prioMedium");
  let buttonLow = document.getElementById("prioLow");

  taskTitle.value = "";
  taskDescription.value = "";
  taskCategory.value = "";
  taskColor.value = "";
  taskAssignments.value = "";
  taskDueDate.value = "";
  taskPriority.value = "";
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

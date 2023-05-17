let tasks = [];
let subtasks = [];

async function initTasks() {
  loadTasks();
}

async function addNewTask() {
  let taskTitle = document.getElementById("title");
  let taskDescription = document.getElementById("description");
  let taskCategory = document.getElementById("category");
  let taskColor = document.getElementById("color");
  let taskAssignments = document.getElementById("assignments");
  let taskDueDate = document.getElementById("datePicker");
  let taskPriority = document.getElementById("priority");
  let taskSub = document.getElementById("subtaskContent");
  let buttonUrgent = document.getElementById('prioUrgent');
  let buttonMedium = document.getElementById('prioMedium');
  let buttonLow = document.getElementById('prioLow');

  tasks.push({
    title: taskTitle.value,
    description: taskDescription.value,
    category: 'taskCategory.value',
    color: 'taskColor.value',
    assignments: 'taskAssignments.value',
    dueDate: 'taskDueDate.value',
    taskSub: taskSub.value,
  });

  clearTaskForm();

  const taskAddedElement = document.getElementById('taskAdded');
  taskAddedElement.classList.remove('d-none'); // Entferne die Klasse "d-none", um das Element anzuzeigen

  setTimeout(() => {
  taskAddedElement.classList.add('d-none'); // Füge die Klasse "d-none" hinzu, um das Element auszublenden
}, 3000); // Warte drei Sekunden (3000 Millisekunden) und führe dann den Code im setTimeout-Callback aus


  await setItem("tasks", JSON.stringify(tasks));
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
  console.log("Selected value: " + selectedOption);
}

function getSelectedAssignment() {
  selectElement = document.getElementById("assignMenu");
  var selectedCategory = selectElement.options[selectElement.selectedIndex].text;
  console.log("Selected category: " + selectedCategory);
}



async function subTaskAddToJson() {
  let task = document.getElementById("subtask-input-content");

  subtasks.push({
    task: task.value,
  });

  addNewSubTask();
  task.value = '';
}


async function addNewSubTask() {
  let subtaskContent = document.getElementById('subtaskContent');
  subtaskContent.innerHTML = '';

  for (let i = 0; i < subtasks.length; i++) {
    let task = subtasks[i]['task'];
    subtaskContent.innerHTML += `
    <div>${task}</div>`;
  }
}

async function deleteAllTasksFromServer(){
  try {
    tasks = JSON.parse(await getItem("tasks"));
    tasks = [];
    await setItem("tasks", JSON.stringify(tasks));
  } catch (e) {
    console.error("Loading error:", e);
  }
}


async function TaskButtonUrgent(){
  let buttonUrgent = document.getElementById('prioUrgent');
  let buttonMedium = document.getElementById('prioMedium');
  let buttonLow = document.getElementById('prioLow');
  buttonUrgent.style.backgroundColor = "#FF3D00";
  buttonMedium.style.backgroundColor = "white";
  buttonLow.style.backgroundColor = "white";
  buttonMedium.style.color = "black";
  buttonUrgent.style.color = "white";
  buttonLow.style.color = "black";
  let image = document.getElementById('imgUrgent');
  image.style.filter = "brightness(10000%) contrast(1000%)";
}


async function TaskButtonMedium(){
  let buttonUrgent = document.getElementById('prioUrgent');
  let buttonMedium = document.getElementById('prioMedium');
  let buttonLow = document.getElementById('prioLow');
  buttonUrgent.style.backgroundColor = "white";
  buttonMedium.style.backgroundColor = "#FFA800";
  buttonMedium.style.color = "white";
  buttonUrgent.style.color = "black";
  buttonLow.style.color = "black";
  buttonLow.style.backgroundColor = "white";
}

async function TaskButtonLow(){
  let buttonUrgent = document.getElementById('prioUrgent');
  let buttonMedium = document.getElementById('prioMedium');
  let buttonLow = document.getElementById('prioLow');
  buttonUrgent.style.backgroundColor = "white";
  buttonMedium.style.backgroundColor = "white";
  buttonLow.style.backgroundColor = "#7AE229";
  buttonMedium.style.color = "black";
  buttonUrgent.style.color = "black";
  buttonLow.style.color = "white";
}


async function clearTaskForm(){
  let taskTitle = document.getElementById("title");
  let taskDescription = document.getElementById("description");
  let taskCategory = document.getElementById("category");
  let taskColor = document.getElementById("color");
  let taskAssignments = document.getElementById("assignments");
  let taskDueDate = document.getElementById("datePicker");
  let taskPriority = document.getElementById("priority");
  let taskSub = document.getElementById("subtaskContent");
  let buttonUrgent = document.getElementById('prioUrgent');
  let buttonMedium = document.getElementById('prioMedium');
  let buttonLow = document.getElementById('prioLow');

  taskTitle.value = '';
  taskDescription.value = '';
  taskCategory.value = '';
  taskColor.value = '';
  taskAssignments.value = '';
  taskDueDate.value = '';
  taskPriority.value = '';
  taskSub.value = '';
  buttonUrgent.style.backgroundColor = "white";
  buttonMedium.style.backgroundColor = "white";
  buttonLow.style.backgroundColor = "white";

}
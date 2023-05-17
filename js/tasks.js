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

  tasks.push({
    title: taskTitle.value,
    description: taskDescription.value,
    category: 'taskCategory.value',
    color: 'taskColor.value',
    assignments: 'taskAssignments.value',
    dueDate: 'taskDueDate.value',
    taskSub: taskSub.value,
  });

  taskTitle.value = '';
  taskDescription.value = '';
  //taskCategory.value = '';
  //taskColor.value = '';
  //taskAssignments.value = '';
  taskDueDate.value = '';
  //taskPriority.value = '';
  //taskSub.value = '';

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
  var selectedOption = selectElement.options[selectElement.selectedIndex];
  var selectedValue = selectedOption.value;
  console.log("Selected value: " + selectedValue);
}


async function subTaskAddToJson() {
  let task = document.getElementById("subtask-input-content");

  subtasks.push({
    task: task.value,
  });

  addNewSubTask();
}


async function addNewSubTask() {
  let subtaskContent = document.getElementById('subtaskContent');

  for (let i = 0; i < subtasks.length; i++) {
    let task = subtasks[i];
    subtaskContent.innerHTML += `
    
    <div>${task}</div>`;
  }
}
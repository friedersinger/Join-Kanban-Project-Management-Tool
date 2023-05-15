let tasks = [];

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
    category: "taskCategory.value",
    color: "taskColor.value",
    assignments: "taskAssignments.value",
    dueDate: taskDueDate.value,
    taskSub: taskSub.value,
  });
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

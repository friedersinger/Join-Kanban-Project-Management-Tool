//############### ONLOAD ###############//

let toDo = [];
let inProgress = [];
let feedback = [];
let done = [];
let currentDraggedElement;


async function initBoard() {
  await loadTasks();
  await loadtoDos();
  await loadInProgress();
  await loadFeedback();
  await loadDone();
  renderTaskCardToDo();
  renderTaskCardProgress();
}

//############### LOADING FUNCTIONS ###############//


async function loadtoDos() {
  try {
    toDo = JSON.parse(await getItem("toDo"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

async function loadInProgress() {
  try {
    inProgress = JSON.parse(await getItem("inProgress"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

async function loadFeedback() {
  try {
    feedback = JSON.parse(await getItem("feedback"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

async function loadDone() {
  try {
    done = JSON.parse(await getItem("done"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}


//############### RENDER FUNCTIONS ###############//

function renderTaskCardToDo() {
  let toDoContainer = document.getElementById("toDo");
  let renderedIDs = {};
  for (let i = 0; i < toDo.length; i++) {
    let currentTask = tasks.find((task) => task.id === toDo[i]);
    if (!renderedIDs[currentTask.id]) {
      toDoContainer.innerHTML += getTaskCardHTML(currentTask);
      renderedIDs[currentTask.id] = true;
    }
  }
}

function renderTaskCardProgress() {
  let progressContainer = document.getElementById("inProgress");
  let renderedIDs = {};
  for (let i = 0; i < inProgress.length; i++) {
    let currentTask = tasks.find((task) => task.id === inProgress[i]);
    if (!renderedIDs[currentTask.id]) {
      progressContainer.innerHTML += getTaskCardHTML(currentTask);
      renderedIDs[currentTask.id] = true;
    }
  }
}




//############### HELP FUNCTIONS ###############//

async function testPushToArrays() {
  inProgress.push("test");
  feedback.push("test");
  done.push("test");
  await setItem("inProgress", JSON.stringify(inProgress));
  await setItem("feedback", JSON.stringify(feedback));
  await setItem("done", JSON.stringify(done));
}

function redirectToAddTask() {
  window.location.href = "task_form.html";
}

function getTaskCardHTML(currentTask) {
  return `
  <div draggable="true" ondragstart="startDragging(${currentTask["id"]})" class="board-task-card">
    <div class="task-card-category" id="taskCategoryContainer">${currentTask["category"]}</div>
    <span class="task-card-title" id="taskTitleContainer">${currentTask["title"]}</span>
    <div class="task-card-description" id="taskDescriptionContainer">${currentTask["description"]}</div>
    <div class="progress">
      <div class="progress-bar w-75" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <div class="task-card-bottom-container">
      <div class="avatar-container">Test</div>
      <div class="task-card-prio">Urgent</div>
    </div>
  </div>`;
}

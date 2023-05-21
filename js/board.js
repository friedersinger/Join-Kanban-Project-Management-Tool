let toDo = [];
let inProgress = [];
let feedback = [];
let done = [];

function redirectToAddTask() {
  window.location.href = "task_form.html";
}

async function initBoard() {
  await loadTasks();
  await loadtoDos();
  await loadInProgress();
  await loadFeedback();
  await loadDone();
  renderTaskCardToDo();
}

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

function renderTaskCardToDo() {
  let toDoContainer = document.getElementById("toDoContainer");

  for (let i = 0; i < toDo.length; i++) {
    let currentTask = tasks.find((task) => task.id === toDo[i]);
    toDoContainer.innerHTML += `
      <div draggable="true" class="board-task-card">
        ${currentTask["category"]} ${currentTask["title"]}
        ${currentTask["description"]}
      </div>
    `;
  }
}

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
    renderTaskCardFeedback();
    renderTaskCardDone()
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
            toDoContainer.innerHTML += getTaskCardHTML(currentTask, 'toDo');
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
            progressContainer.innerHTML += getTaskCardHTML(currentTask, 'inProgress');
            renderedIDs[currentTask.id] = true;
        }
    }
}

function renderTaskCardFeedback() {
    let feedbackContainer = document.getElementById("feedback");
    let renderedIDs = {};
    for (let i = 0; i < feedback.length; i++) {
        let currentTask = tasks.find((task) => task.id === feedback[i]);
        if (!renderedIDs[currentTask.id]) {
            feedbackContainer.innerHTML += getTaskCardHTML(currentTask, 'feedback');
            renderedIDs[currentTask.id] = true;
        }
    }
}

function renderTaskCardDone() {
    let doneContainer = document.getElementById("done");
    let renderedIDs = {};
    for (let i = 0; i < done.length; i++) {
        let currentTask = tasks.find((task) => task.id === done[i]);
        if (!renderedIDs[currentTask.id]) {
            doneContainer.innerHTML += getTaskCardHTML(currentTask, 'done');
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

function getTaskCardHTML(currentTask, status) {
    return `
  <div draggable="true" ondragstart="startDragging(${currentTask["id"]},'${status}')" class="board-task-card">
    <div class="task-card-category" id="taskCategoryContainer">${currentTask["category"]}</div>
    <span class="task-card-title" id="taskTitleContainer">${currentTask["title"]}</span>
    <div class="task-card-description" id="taskDescriptionContainer">${currentTask["description"]}</div>
    <div class="task-card-bottom-container">
      <div class="avatar-container">AVATAR BILD</div>
      <div class="task-card-prio">Urgent</div>
    </div>
  </div>`;
}
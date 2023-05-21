let toDo = [];
let inProgress = [];
let feedback = [];
let done = [];
let currentDraggedElement;


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
  //renderTaskCardProgress()
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
  let toDoContainer = document.getElementById("toDo");
  for (let i = 0; i < toDo.length; i++) {
    let currentTask = tasks.find((task) => task.id === toDo[i]);  //bisher nur für todos korrekt!
    toDoContainer.innerHTML += getTaskCardHTML(currentTask);
  }
}

function renderTaskCardProgress(){
  let progressContainer = document.getElementById("inProgress");
  for (let i = 0; i < inProgress.length; i++) {
    let currentTask = tasks.find((task) => task.id === inProgress[i]);  //bisher nur für todos korrekt!
    progressContainer.innerHTML += getTaskCardHTML(currentTask);
  }
}

async function testPushToArrays(){
  inProgress.push('test');
  feedback.push('test');
  done.push('test');
  await setItem("inProgress", JSON.stringify(inProgress));
  await setItem("feedback", JSON.stringify(feedback));
  await setItem("done", JSON.stringify(done));
}

function startDragging(id){  
  currentDraggedElement = id;
  
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

async function moveTo(status){
  let targetArray;
  switch (status) {
    case "toDo":
      targetArray = toDo;
      break;
    case "inProgress":
      targetArray = inProgress;
      break;
    case "feedback":
      targetArray = feedback;
      break;
    case "done":
      targetArray = done;
      break;
    default:
      console.error("Invalid status:", status);
      return;
}
  targetArray.push(currentDraggedElement);
  await setItem(status, JSON.stringify(targetArray));
  console.log(targetArray);
  location.reload();
}


function getTaskCardHTML(currentTask){
  return `
  <div draggable="true" ondragstart="startDragging(${currentTask['id']})" class="board-task-card">
    <div class="task-card-category" id="taskCategoryContainer">${currentTask['category']}</div>
    <span class="task-card-title" id="taskTitleContainer">${currentTask['title']}</span>
    <div class="task-card-description" id="taskDescriptionContainer">${currentTask['description']}</div>
    <div class="progress">
      <div class="progress-bar w-75" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <div class="task-card-bottom-container">
      <div class="avatar-container">Test</div>
      <div class="task-card-prio">Urgent</div>
    </div>
  </div>`
}





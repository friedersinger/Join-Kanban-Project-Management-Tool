//############### ONLOAD ###############//
let toDo = [];
let inProgress = [];
let feedback = [];
let done = [];
let currentDraggedElement;
let users = [];
let currentUserID = 0;


async function initBoard() {
  clearTasksContainer();
  await loadTasks();
  await loadtoDos();
  await loadInProgress();
  await loadFeedback();
  await loadDone();
  await loadUsers();
  renderTaskCardToDo();
  renderTaskCardProgress();
  renderTaskCardFeedback();
  renderTaskCardDone();
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

async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
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
      toDoContainer.innerHTML += getTaskCardHTML(currentTask, "toDo");
      renderedIDs[currentTask.id] = true;
      renderAvatars(currentTask);
    }
  }
}

function renderTaskCardProgress() {
  let progressContainer = document.getElementById("inProgress");
  let renderedIDs = {};
  for (let i = 0; i < inProgress.length; i++) {
    let currentTask = tasks.find((task) => task.id === inProgress[i]);
    if (!renderedIDs[currentTask.id]) {
      progressContainer.innerHTML += getTaskCardHTML(currentTask, "inProgress");
      renderedIDs[currentTask.id] = true;
      renderAvatars(currentTask);
    }
  }
}

function renderTaskCardFeedback() {
  let feedbackContainer = document.getElementById("feedback");
  let renderedIDs = {};
  for (let i = 0; i < feedback.length; i++) {
    let currentTask = tasks.find((task) => task.id === feedback[i]);
    if (!renderedIDs[currentTask.id]) {
      feedbackContainer.innerHTML += getTaskCardHTML(currentTask, "feedback");
      renderedIDs[currentTask.id] = true;
      renderAvatars(currentTask);
    }
  }
}

function renderTaskCardDone() {
  let doneContainer = document.getElementById("done");
  let renderedIDs = {};
  for (let i = 0; i < done.length; i++) {
    let currentTask = tasks.find((task) => task.id === done[i]);
    if (!renderedIDs[currentTask.id]) {
      doneContainer.innerHTML += getTaskCardHTML(currentTask, "done");
      renderedIDs[currentTask.id] = true;
      renderAvatars(currentTask);
    }
  }
}

function clearTasksContainer() {
  let toDoContainer = document.getElementById("toDo");
  let progressContainer = document.getElementById("inProgress");
  let feedbackContainer = document.getElementById("feedback");
  let doneContainer = document.getElementById("done");

  toDoContainer.innerHTML = "";
  progressContainer.innerHTML = "";
  feedbackContainer.innerHTML = "";
  doneContainer.innerHTML = "";
}

async function renderAvatars(currentTask) {
  let avatarBox = document.getElementById("avatarBox" + currentTask["id"]);
  for (let i = 0; i < currentTask["assignments"].length; i++) {
    const name = currentTask["assignments"][i]['name'];
    let id = currentTask["assignments"][i]['id'];
    let color = await getUserColor(id);
    let initials = name.match(/\b(\w)/g);
    initials = initials.join("").toUpperCase();
    avatarBox.innerHTML += `       
            <div class="avatar-container" style="background-color:${color}">${initials}</div>
        `;
  }
}

async function getUserColor(id){
  let currentUser = users.find((user) => user.id === id);
  if (currentUser) {
    const color = currentUser.color;
    console.log(color);
    // Hier kannst du den Farbwert weiterverarbeiten oder verwenden
    // z.B. die Farbe einem HTML-Element zuweisen, etc.
    return color;
  } else {
    throw new Error(`Benutzer mit ID ${id} wurde nicht gefunden.`);
  }
}

function showDetailCard(id) {
  let overlay = document.getElementById("overlay");
  overlay.classList.remove("d-none");

  // Clear the content of the overlay before adding the new popup
  overlay.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      const task = tasks[i];
      console.log(task);
      overlay.innerHTML += getTaskDetailCardHTML(task);
    }
  }

  // Add an event listener to the overlay to close it when clicked
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      overlay.classList.add("d-none");
      overlay.innerHTML = ""; // Clear the content of the overlay
    }
  });
}

//############### HELP FUNCTIONS ###############//

function redirectToAddTask() {
  window.location.href = "task_form.html";
}

function getTaskCardHTML(currentTask, status) {
  return `
  <div draggable="true" ondragstart="startDragging(${currentTask["id"]},'${status}')" class="board-task-card" onclick="showDetailCard(${currentTask["id"]})">
    <div class="task-card-category" id="taskCategoryContainer" style="background-color:${currentTask["color"]} ">${currentTask["category"]}</div>
    <span class="task-card-title" id="taskTitleContainer">${currentTask["title"]}</span>
    <div class="task-card-description" id="taskDescriptionContainer">${currentTask["description"]}</div>
    <div class="task-card-bottom-container">
      <div class="avatar-Box" id="avatarBox${currentTask["id"]}">
        
      </div>
      <div class="task-card-prio">
      <img id="imgUrgentTask" src="./assets/img/icon_${currentTask["prio"]}.png" alt="" />
      </div>
    </div>
  </div>`;
}

function getTaskDetailCardHTML(task) {
  return /*html*/ `
    
      <div class="Task-Content">

        <div class="Task-Content-Top">
          <div class="flex-row justify-space-between">
            <div class="task-card-category" style="background-color:${task["color"]}">${task["category"]}</div>
            <button class="close-btn" onclick="closePopup()">X</button>
          </div>
          <span class="headline-text-popup">${task["title"]}</span>
          <span>${task["description"]}</span>
          <span class="font-weight-700">Due date: ${task["dueDate"]}</span>
          <span class="font-weight-700">Priority: </span>
          <span class="font-weight-700">Assigned To:</span>

          <div class="User-Area">User mit Avatar</div>
          <div class="avatar-Box" id="avatarBox${task.id}"></div>
        </div>
      
        <div class="Task-Bottom-Content">

          <svg class="trash-popUp" width="45" height="46" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_57121_3508" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
            <rect width="32" height="32" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_57121_3508)">
            <path d="M9.33289 28C8.59955 28 7.97177 27.7389 7.44955 27.2167C6.92733 26.6944 6.66622 26.0667 6.66622 25.3333V8H5.33289V5.33333H11.9996V4H19.9996V5.33333H26.6662V8H25.3329V25.3333C25.3329 26.0667 25.0718 26.6944 24.5496 27.2167C24.0273 27.7389 23.3996 28 22.6662 28H9.33289ZM22.6662 8H9.33289V25.3333H22.6662V8ZM11.9996 22.6667H14.6662V10.6667H11.9996V22.6667ZM17.3329 22.6667H19.9996V10.6667H17.3329V22.6667Z" fill="#2A3647"/>
            </g>
            </svg>

            
          <div class="task-popup-bottom-trash-edit-line"></div> 
            

          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="50" height="50" rx="10" fill="#2A3647"/>
            <path d="M17.4445 32.0155L22.2638 34.9404L34.907 14.1083C35.1935 13.6362 35.043 13.0211 34.5709 12.7346L31.4613 10.8474C30.9892 10.5608 30.3742 10.7113 30.0876 11.1834L17.4445 32.0155Z" fill="white"/>
            <path d="M16.8604 32.9794L21.6797 35.9043L16.9511 38.1892L16.8604 32.9794Z" fill="white"/>
            </svg>
            

        </div>
      </div>
    `;
}

function closePopup() {
  let overlay = document.getElementById("overlay");
  overlay.classList.add("d-none");
}

function searchForTaskByInput(){
  clearTasksContainer();
  let search = document.getElementById("search-input").value;
  search = search.toLowerCase();
  
  for (let i = 0; i < tasks.length; i++) {
    const title = tasks[i]['title'];
    const description = tasks[i]['description'];

    if(title.toLowerCase().includes(search) || description.toLowerCase().includes(search)){
      console.log(tasks[i]['id']);
    }
  }
}



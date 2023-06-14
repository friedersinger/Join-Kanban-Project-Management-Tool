//############### ONLOAD ###############//
let toDo = [];
let inProgress = [];
let feedback = [];
let done = [];
let currentDraggedElement;

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
    const name = currentTask["assignments"][i]["name"];
    let id = currentTask["assignments"][i]["id"];
    let color = getUserColor(id);
    let initials = name.match(/\b(\w)/g);
    initials = initials.join("").toUpperCase();
    avatarBox.innerHTML += `       
        <div class="avatar-container" style="background-color:${color}">${initials}</div>
    `;
  }
}

function getUserColor(id) {
  let currentUser = users.find((user) => user.id == id);
  if (currentUser) {
    const color = currentUser.color;
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
      overlay.innerHTML += getTaskDetailCardHTML(task);
      getTaskPrio(task);
      getAssignedToDetailCard(task, id);
      showSubtasks(task);
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

async function getTaskPrio(task) {
  let prioContainer = document.getElementById("prioDetail");
  switch (task["prio"]) {
    case "down":
      prioContainer.innerHTML += `
      <div
      class="prio-btn-low" 
    >
      Low
      <img id="imgUrgent" src="./assets/img/prioLow.svg" alt="" />
    </div>
      `;
      break;
    case "medium":
      prioContainer.innerHTML += `
      <div
      class="prio-btn-medium"
    >
      Medium
      <img id="imgUrgent" src="./assets/img/prioMedium.svg" alt="" />
    </div>
      `;
      break;
    case "up":
      prioContainer.innerHTML += `
      <div
      class="prio-btn-urgent"
    >
      Urgent
      <img id="imgUrgent" src="./assets/img/prioUrgent.svg" alt=""/>
    </div>
      `;
      break;
  }
}

function getAssignedToDetailCard(task) {
  let assignContainer = document.getElementById("assignDetail");
  for (let i = 0; i < task["assignments"].length; i++) {
    const contact = task["assignments"][i]["name"];
    const id = task["assignments"][i]["id"];
    let color = getUserColor(id);
    let initials = contact.match(/\b(\w)/g);
    initials = initials.join("").toUpperCase();
    assignContainer.innerHTML += `
    <div class="flex-row align-center gap-15">
      <div class="avatar-container" style="background-color:${color}">${initials}</div>
      <div class="font-weight-500">${contact}</div>
    </div>
    `;
  }
}

//############### HELP FUNCTIONS ###############//

function redirectToAddTask() {
  window.location.href = "task_form.html";
}

function getTaskCardHTML(currentTask, status) {
  return `
  <div draggable="true" ondragstart="startDragging(${currentTask["id"]},'${status}')" class="board-task-card" onclick="showDetailCard(${currentTask["id"]})" id="${currentTask["id"]}">
    <div class="task-card-category" id="taskCategoryContainer" style="background-color:${currentTask["color"]} ">${currentTask["category"]}</div>
    <span class="task-card-title" id="taskTitleContainer">${currentTask["title"]}</span>
    <div class="task-card-description" id="taskDescriptionContainer">${currentTask["description"]}</div>
    <div class="task-card-bottom-container">
      <div class="avatar-Box" id="avatarBox${currentTask["id"]}"></div>
      <div class="task-card-prio">
      <img id="imgUrgentTask" src="./assets/img/icon_${currentTask["prio"]}.png" alt="" />
      </div>
    </div>
  </div>`;
}

function getTaskDetailCardHTML(task) {
  return /*html*/ `
    
      <div class="Task-Content" id="taskContent">

        <div class="Task-Content-Top">
          <div class="flex-row justify-space-between">
            <div class="task-card-category" style="background-color:${task["color"]}">${task["category"]}</div>
            <button class="close-btn" onclick="closePopup()">X</button>
          </div>
          <span class="headline-text-popup">${task["title"]}</span>
          <span>${task["description"]}</span>
          <span class="font-weight-700">Due date: ${task["dueDate"]}</span>
          <div class="flex-row align-center gap-15" id="prioDetail">  
            <span class="font-weight-700">Priority: </span>
            
          </div>
          <span class="font-weight-700">Assigned To:</span>

          <div class="User-Area" id="assignDetail"></div>
          <div>
            <span class="font-weight-700">Subtasks:</span>
            <ul class="subtasks-container" id="subtasksContainer"></ul>
          </div>

        </div>
      
        <div class="Task-Bottom-Content">

          <svg onclick="deleteTask(${task.id})" class="trash-popUp" width="45" height="46" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_57121_3508" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
            <rect width="32" height="32" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_57121_3508)">
            <path d="M9.33289 28C8.59955 28 7.97177 27.7389 7.44955 27.2167C6.92733 26.6944 6.66622 26.0667 6.66622 25.3333V8H5.33289V5.33333H11.9996V4H19.9996V5.33333H26.6662V8H25.3329V25.3333C25.3329 26.0667 25.0718 26.6944 24.5496 27.2167C24.0273 27.7389 23.3996 28 22.6662 28H9.33289ZM22.6662 8H9.33289V25.3333H22.6662V8ZM11.9996 22.6667H14.6662V10.6667H11.9996V22.6667ZM17.3329 22.6667H19.9996V10.6667H17.3329V22.6667Z" fill="#2A3647"/>
            </g>
            </svg>

            
          <div class="task-popup-bottom-trash-edit-line"></div> 
            

          <svg  onclick="editTask(${task.id})" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
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

async function deleteTask(id) {
  deleteObjectById(id);
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i]["id"] == id) {
      tasks.splice(i, 1);
      await setItem("tasks", JSON.stringify(tasks));
      break;
    }
  }
  closePopup();
  initBoard();
}

function editTask(id) {
  currentTaskID = id;
  let currentTask = tasks.find((task) => task.id == id);

  document.getElementById("taskContent").innerHTML = /*html*/ `
  
  <div id="overlayPopUpbg" class="overlay-board-bg" style="padding:21px">
    
    <div class="overlayBoardBg">
      <div class="justify-end">
          <div class="margin-bottom-60">
            <span class="headline-text">Edit Task</span>
          </div>
          
          <div class="inner-content scroll">
      <div>
        <div id="taskAdded" class="taskAdded d-none">
          <img src="./assets/img/task_Added.svg" alt="" />
        </div>
      </div>

      <form class="column-container" onsubmit="editTaskBoard(currentTaskID) ; return false">
        <div class="column-left">
          <label>Title</label>

          <input type="text" id="title" placeholder="${
            currentTask["title"]
          }" value="${currentTask["title"]}" required />

          <label>Description</label>

          <textarea
            id="description"
            placeholder="${currentTask["description"]}"
          >${currentTask["description"]}</textarea>

          <label>Category</label>

          <label
            id="toggleDrop"
            for="dropdown"
            onclick="toggleDropdownCategory()"
          >
            <div class="dropdown-min" id="dropdownMinCategory">
              <span>${currentTask["category"]}</span>
              <img src="./assets/img/arrow_down_black.svg" alt="" />
            </div>
          </label>
          <div id="dropdownCategoryContent" class="dropdown-content"></div>

          <div id="select-color-category" class="select-color-category d-none">
            <div
              onclick="selectColor(1)"
              id="color1"
              style="background-color: red"
            ></div>
            <div
              onclick="selectColor(2)"
              id="color2"
              style="background-color: #fc71ff"
            ></div>
            <div
              onclick="selectColor(3)"
              id="color3"
              style="background-color: #ff7a00"
            ></div>
            <div
              onclick="selectColor(4)"
              id="color4"
              style="background-color: #1fd7c1"
            ></div>
            <div
              onclick="selectColor(5)"
              id="color5"
              style="background-color: #2ad300"
            ></div>
            <div
              onclick="selectColor(6)"
              id="color6"
              style="background-color: #8aa4ff"
            ></div>
            <div
              onclick="selectColor(7)"
              id="color7"
              style="background-color: blue"
            ></div>
          </div>
          <div id="errorMessage" style="color: red"></div>
          <div id="categoryDisplay" style="display: none; color: green"></div>

          <label>Assigned to</label>

          <label for="dropdown" onclick="toggleDropdown()">
            <div class="dropdown-min" id="dropdownMin">
              <span id="categoryTextField"> Select contacts to assign</span>
              <img src="./assets/img/arrow_down_black.svg" alt="" />
            </div>
          </label>
          <div id="dropdownContent" class="dropdown-content"></div>
        </div>

        <div class="border"></div>

        <div class="column-right">
          <label>Due Date</label>
          <input
            id="datePicker"
            type="date"
            value="${currentTask["dueDate"]}"
            min="${getCurrentDate()}"
            required
          /><br /><br />
        </div>


          <label>Prio</label>
          <div id="prioValue">${currentTask["prio"]}</div>

          <div id="prio" class="prio">
            <div class="prio-btn ${
              currentTask["prio"] === "up" ? "active" : ""
            }" id="prioUrgent" onclick="TaskButtonUrgent(); getPrioStatus('up')">
              Urgent
              <img id="imgUrgent" src="./assets/img/icon_up.png" alt="" />
            </div>
            <div class="prio-btn ${
              currentTask["prio"] === "medium" ? "active" : ""
            }" id="prioMedium" onclick="TaskButtonMedium(); getPrioStatus('medium')">
              Medium
              <img id="imgMedium" src="./assets/img/icon_medium.png" alt="" />
            </div>
            <div class="prio-btn ${
              currentTask["prio"] === "down" ? "active" : ""
            }" id="prioLow" onclick="TaskButtonLow(); getPrioStatus('down')">
              Low
              <img id="imgLow" src="./assets/img/icon_down.png" alt="" />
            </div>
          </div>

          <label class="subtask">Subtasks</label>
          <div class="subtask-container">
            <input type="text" id="subtask-input-content" />

            <div id="subtaskOninput" style="display: flex">
              <img src="./assets/img/X.png" id="clearSubtaskInput" />
              <div class="border-subtask"></div>
              <img
                src="./assets/img/icon_check.svg"
                onclick="subTaskAddToJson()"
                id="finishEditingSubtask"
              />
            </div>
          </div>

          <div id="subtaskContent"> test
          </div>

          <div class="action-button-container">
            <img
              id="clearTask"
              onclick="reloadPage()"
              src="./assets/img/cancel-task.svg"
            />
            <button id="addTask" class="add-task-btn" type="submit">
              Edit Task
            </button>
          </div>
        </form>
      </div>
    </div>`;
}

function getCurrentDate() {
  const today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  const year = today.getFullYear();

  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return `${year}-${month}-${day}`;
}

async function deleteObjectById(id) {
  for (var i = 0; i < toDo.length; i++) {
    if (toDo[i] == id) {
      toDo.splice(i, 1);
      await setItem("toDo", JSON.stringify(toDo));
      return;
    }
  }

  for (var i = 0; i < inProgress.length; i++) {
    if (inProgress[i] == id) {
      inProgress.splice(i, 1);
      await setItem("inProgress", JSON.stringify(inProgress));
      return;
    }
  }

  for (var i = 0; i < feedback.length; i++) {
    if (feedback[i] == id) {
      feedback.splice(i, 1);
      await setItem("feedback", JSON.stringify(feedback));
      return;
    }
  }

  for (var i = 0; i < done.length; i++) {
    if (done[i] == id) {
      done.splice(i, 1);
      await setItem("done", JSON.stringify(done));
      return;
    }
  }
}

function toggleDropdownCategory() {
  let dropdownContent = document.getElementById("dropdownCategoryContent");
  let dropdownMin = document.getElementById("dropdownMinCategory");
  dropdownContent.classList.toggle("show");
  dropdownMin.classList.toggle("open");
}

function showSubtasks(task) {
  let container = document.getElementById("subtasksContainer");
  for (let i = 0; i < task["taskSub"].length; i++) {
    const subTask = task["taskSub"][i]["task"];
    container.innerHTML += `<li>${subTask}</li>`;
  }
}

function searchForTaskByInput() {
  let search = document.getElementById("search-input").value;
  search = search.toLowerCase();

  if (search.trim() === "") {
    // Wenn das Suchfeld leer ist, zeige alle Aufgaben
    for (let i = 0; i < tasks.length; i++) {
      showHiddenTask(tasks[i]["id"]);
    }
  } else {
    for (let i = 0; i < tasks.length; i++) {
      const title = tasks[i]["title"];
      const description = tasks[i]["description"];

      if (
        title.toLowerCase().includes(search) ||
        description.toLowerCase().includes(search)
      ) {
        showHiddenTask(tasks[i]["id"]);
      } else {
        console.log("removed task" + tasks[i]["id"]);
        hideTask(tasks[i]["id"]);
      }
    }
  }
}

function hideTask(id) {
  let taskCardContainer = document.getElementById(id);

  if (taskCardContainer) {
    taskCardContainer.style.opacity = "0";
    setTimeout(() => {
      taskCardContainer.classList.add("d-none");
    }, 500);
  }
}

function showHiddenTask(id) {
  let taskCardContainer = document.getElementById(id);

  if (taskCardContainer) {
    taskCardContainer.classList.remove("d-none");
    setTimeout(() => {
      taskCardContainer.style.opacity = "1";
    }, 100);
  }
}

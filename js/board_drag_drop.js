let isDropSuccessful = false;
let sourceID;
let sourceArray;

async function startDragging(id, status) {
  currentDraggedElement = id;
  await showDropArea(status);
  await getSourceArrayByStatus(status, id);
  //await hideDraggedOrigin(currentDraggedElement);
}

async function hideDraggedOrigin(currentDraggedElement) {
  let element = document.getElementById(currentDraggedElement);
  if (element) {
    element.classList.add("d-none");
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

async function moveTo(status) {
  let targetArray;
  switch (status) {
    case "toDo":
      targetArray = toDo;
      getBorderRemoveFunctions();
      isDropSuccessful = true;
      deleteTaskFromDragged();
      initBoard();
      break;
    case "inProgress":
      targetArray = inProgress;
      getBorderRemoveFunctions();
      isDropSuccessful = true;
      deleteTaskFromDragged();
      initBoard();
      break;
    case "feedback":
      targetArray = feedback;
      getBorderRemoveFunctions();
      isDropSuccessful = true;
      deleteTaskFromDragged();
      initBoard();
      break;
    case "done":
      targetArray = done;
      getBorderRemoveFunctions();
      isDropSuccessful = true;
      deleteTaskFromDragged();
      initBoard();
      break;
    default:
      console.log("Invalid status:", status);
      return;
  }
  await checkTargetArrayForID(targetArray, status);
}

async function checkTargetArrayForID(targetArray, status) {
  const elementExists = targetArray.includes(currentDraggedElement);
  if (elementExists) {
    console.log("Element already exists in the array.");
    return;
  }
  targetArray.push(currentDraggedElement);
  await setItem(status, JSON.stringify(targetArray));
}

function getTaskById(id) {
  // Durchsuche alle Aufgaben nach der übergebenen ID
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      return tasks[i]; // Rückgabe des gefundenen Aufgabenobjekts
    }
  }
  // Wenn keine Übereinstimmung gefunden wurde, gib null zurück oder wirf eine entsprechende Fehlermeldung
  return null;
}

async function getSourceArrayByStatus(status, id) {
  switch (status) {
    case "toDo":
      sourceID = id;
      sourceArray = "toDo"
      //await deleteTaskFromDragged(id, "toDo");
      break;
    case "inProgress":
      sourceID = id;
      sourceArray = "inProgress"  
    //await deleteTaskFromDragged(id, "inProgress");
      break;
    case "feedback":
      sourceID = id;
      sourceArray = "feedback"  
      //await deleteTaskFromDragged(id, "feedback");
      break;
    case "done":
      sourceID = id;
      sourceArray = "done"  
      //await deleteTaskFromDragged(id, "done");
      break;
    default:
      console.error("Invalid status:", status);
      return null;
  }
}

async function deleteTaskFromDragged() {
  if (isDropSuccessful == true) {
    switch (sourceArray) {
      case "toDo":
        let toDoIndex = toDo.indexOf(sourceID);
        toDo.splice(toDoIndex, 1);
        await setItem("toDo", JSON.stringify(toDo));
        isDropSuccessful = false;
        break;
      case "inProgress":
        let inProgressIndex = inProgress.indexOf(sourceID);
        inProgress.splice(inProgressIndex, 1);
        await setItem("inProgress", JSON.stringify(inProgress));
        isDropSuccessful = false;

        break;
      case "feedback":
        let feedbackIndex = feedback.indexOf(sourceID);
        feedback.splice(feedbackIndex, 1);
        await setItem("feedback", JSON.stringify(feedback));
        isDropSuccessful = false;

        break;
      case "done":
        let doneIndex = done.indexOf(sourceID);
        done.splice(doneIndex, 1);
        await setItem("done", JSON.stringify(done));
        isDropSuccessful = false;

        break;
    }
  }
}

async function showDropArea(status) {
  //console.log(status);
  switch (status) {
    case "toDo":
      document.getElementById("inProgress").classList.add("add-border");
      document.getElementById("feedback").classList.add("add-border");
      document.getElementById("done").classList.add("add-border");
      break;
    case "inProgress":
      document.getElementById("toDo").classList.add("add-border");
      document.getElementById("feedback").classList.add("add-border");
      document.getElementById("done").classList.add("add-border");
      break;
    case "feedback":
      document.getElementById("toDo").classList.add("add-border");
      document.getElementById("inProgress").classList.add("add-border");
      document.getElementById("done").classList.add("add-border");
      break;
    case "done":
      document.getElementById("toDo").classList.add("add-border");
      document.getElementById("feedback").classList.add("add-border");
      document.getElementById("inProgress").classList.add("add-border");
      break;
  }
}

function getBorderRemoveFunctions() {
  document.getElementById("toDo").classList.remove("add-border");
  document.getElementById("inProgress").classList.remove("add-border");
  document.getElementById("feedback").classList.remove("add-border");
  document.getElementById("done").classList.remove("add-border");
}
function startDragging(id, status) {
  currentDraggedElement = id;
  getSourceArrayByStatus(status, id);
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

async function moveTo(status) {
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

function getSourceArrayByStatus(status, id) {
  let originArray;
  switch (status) {
    case 'toDo':
      originArray = toDo;
      deleteTaskFromDragged(id, originArray);
    case 'inProgress':
      originArray = inProgress;
      deleteTaskFromDragged(id, originArray);
    case "feedback":
      originArray = feedback;
      deleteTaskFromDragged(id, originArray);
    case "done":
      originArray = done;
      deleteTaskFromDragged(id, originArray);
    default:
      console.error("Invalid status:", status);
      return null;
  }
}

function deleteTaskFromDragged(id, sourceArray){
  let index = sourceArray.indexOf(id);
    if (index !== -1) {
      sourceArray.splice(index, 1);
    } else {
      console.warn("No matching ID found in the array.");
    }
}

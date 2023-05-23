async function startDragging(id, status) {
  currentDraggedElement = id;
  await getSourceArrayByStatus(status, id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text/plain"); // Retrieve the data transfer value (ID)
  var element = document.getElementById(data); // Get the element using the ID
  ev.target.appendChild(element); // Append the element to the drop target
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
      console.log("targetArray: feedback");
      break;
    case "done":
      targetArray = done;
      console.log("targetArray: done");
      break;
    default:
      console.error("Invalid status:", status);
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
      await deleteTaskFromDragged(id, "toDo");
      break;
    case "inProgress":
      await deleteTaskFromDragged(id, "inProgress");
      break;
    case "feedback":
      await deleteTaskFromDragged(id, "feedback");
      break;
    case "done":
      await deleteTaskFromDragged(id, "done");
      break;
    default:
      console.error("Invalid status:", status);
      return null;
  }
}

async function deleteTaskFromDragged(id, sourceArray) {
  console.log("deleted id: " + id);
  console.log("source array:", sourceArray);

  switch (sourceArray) {
    case "toDo":
      let toDoIndex = toDo.indexOf(id);
      console.log(toDo.indexOf(id));
      toDo.splice(toDoIndex, 1);
      await setItem("toDo", JSON.stringify(toDo));
      break;
    case "inProgress":
      let inProgressIndex = inProgress.indexOf(id);
      console.log(inProgress.indexOf(id));
      inProgress.splice(inProgressIndex, 1);
      await setItem("inProgress", JSON.stringify(inProgress));
      break;
    case "feedback":
      let feedbackIndex = feedback.indexOf(id);
      console.log(feedback.indexOf(id));
      feedback.splice(feedbackIndex, 1);
      await setItem("feedback", JSON.stringify(feedback));
      break;
    case "done":
      let doneIndex = done.indexOf(id);
      console.log(done.indexOf(id));
      done.splice(doneIndex, 1);
      await setItem("done", JSON.stringify(done));
      break;
  }
}

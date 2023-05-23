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
          break;
      case "done":
          targetArray = done;
          break;
      default:
          console.error("Invalid status:", status);
          return;
  }
  await checkTargetArrayForID(targetArray, status)
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
      await deleteTaskFromDragged(id, toDo);
      break;
    case "inProgress":
      await deleteTaskFromDragged(id, inProgress);
      break;
    case "feedback":
      await deleteTaskFromDragged(id, feedback);
      break;
    case "done":
      await deleteTaskFromDragged(id, done);
      break;
    default:
      console.error("Invalid status:", status);
      return null;
  }
}

async function deleteTaskFromDragged(id, sourceArray) {
  console.log("deleted id: " + id);
  console.log("source array:", sourceArray);
  console.log(sourceArray.indexOf(id));
  let index = sourceArray.indexOf(id);
  if (index !== -1) {
    sourceArray.splice(index, 1);
    await updateArrayInStorage(sourceArray); // Update the array in storage
  } else {
    console.warn("No matching ID found in the array.");
  }
}

async function updateArrayInStorage(array) {
  // Logic to update the array in your storage (e.g., using setItem)
  // Replace the following line with your actual implementation
  await setItem(array, JSON.stringify(array));
}

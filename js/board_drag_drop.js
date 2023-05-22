function startDragging(id) {
  currentDraggedElement = id;
  //let task = getTaskById(id);
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
  console.log(targetArray);
  location.reload();
}

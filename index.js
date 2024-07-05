const form = document.querySelector("#submit-form");
const input = document.querySelector("#text-input");
const todoList = document.querySelector("#task-list");
const statusId = document.querySelector("#status-id")
form.addEventListener("submit", submitForm);
todoList.addEventListener("click", operations);
statusId.addEventListener("change",filterTasks)
function submitForm(event) {
  event.preventDefault();
  const taskName = input.value;
  createTask(taskName);
  input.value = "";
}
function createTask(taskName) {
  const taskCard = createTaskCard(taskName);
  todoList.append(taskCard);
}

function createTaskCard(taskName) {
  const taskCard = document.createElement("div");
  taskCard.classList.add("todo-card");
  const checkBoxContainer = createCheckbox();
  const taskNameContainer = createTaskName(taskName);
  const btnGroup = createToDoButtons();
  taskCard.append(checkBoxContainer, taskNameContainer, btnGroup);
  return taskCard;
}
function createToDoButtons() {
  const btnGroup = document.createElement("div");
  btnGroup.classList.add("btn-group");
  const editButton = createIconButton(
    "edit",
    "edit-btn-id",
    "./Images/edit.png",
    "edit icon"
  );
  const deleteButton = createIconButton(
    "delete",
    "delete-btn-id",
    "./Images/trash.png",
    "delete button"
  );
  btnGroup.append(editButton, deleteButton);
  return btnGroup;
}

function createIconButton(className, id, iconImageSource, alternateText) {
  const divContainer = document.createElement("div");
  divContainer.classList.add(className);
  const img = document.createElement("img");
  img.src = iconImageSource;
  img.alt = alternateText;
  img.setAttribute("id", id);
  divContainer.append(img);
  return divContainer;
}
function createTaskName(taskName) {
  const taskNameContainer = document.createElement("div");
  taskNameContainer.classList.add("task-name-container");
  const taskNameInput = document.createElement("input");
  taskNameInput.value = taskName;

  taskNameInput.classList.add("task-name");
  taskNameInput.setAttribute("id", "task-name-id");
  taskNameContainer.append(taskNameInput);
  return taskNameContainer;
}

function createCheckbox() {
  const checkBoxContainer = document.createElement("div");
  checkBoxContainer.classList.add("checkbox-container");

  const checkInput = document.createElement("input");
  checkInput.type = "checkbox";
  checkInput.setAttribute("id", "completed-checkebox");
  checkInput.classList.add("completed");
  checkBoxContainer.append(checkInput);
  return checkBoxContainer;
}
function operations(e) {
  const target = e.target;
  console.log(target.id);
  if (target.id === "completed-checkebox") {
    taskCompleted(e.target);
  }

  //   if(target.id === "task-name-id"){

  //   }
//   if (target.id === "edit-btn-id") {
//   }

  if (target.id === "delete-btn-id") {
    const todoCard = target.parentNode.parentNode.parentNode;
    todoCard.remove();
  }
}


function taskCompleted(target) {
  const todoCard = target.parentNode.parentNode;
  const taskName = todoCard.querySelector(".task-name");

  taskName.classList.toggle("line-through");
}


function filterTasks(e){
const list = todoList.children
const listArray = Array.from(list)
listArray.forEach(list=>{
console.log(list)



})

}
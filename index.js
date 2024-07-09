import { validateText } from "./validation.js";

const form = document.querySelector("#submit-form");
const input = document.querySelector("#text-input");
const todoList = document.querySelector("#task-list");
const statusId = document.querySelector("#status-id");
const inputError = document.querySelector("#input-error");
const completeAllCheckbox = document.querySelector("#complete-all");
const deleteButton = document.querySelector("#delete-all");
const taskCards = [];

document.addEventListener("DOMContentLoaded", renderTasks);
form.addEventListener("submit", submitForm);
todoList.addEventListener("click", operations);
statusId.addEventListener("change", filterTodos);
completeAllCheckbox.addEventListener("change", completeAll);
deleteButton.addEventListener("click", deleteAll);
let counter = getNextIndexFromLocalStorage();
function submitForm(event) {
//to submit the valid input task based on edit the task or creating the task it will be obtained from input form attribute
  event.preventDefault();
  const inputValue = getValidInputValue();
  if (inputValue) {
    const isEdit = input.getAttribute("edit");
    const editIndex = input.getAttribute("edit-index");
    if (isEdit) {
      submitEditForm(inputValue, editIndex);
    } else {
      createTask(inputValue);
    }
    input.value = "";
  }

}

function getValidInputValue() {
//get the input and trim the white spaces and validate the input and return the valid input
  const taskName = input.value;
  const trimmedInput = taskName.trim();
  const isValidinput = validateText(trimmedInput);
  if (isValidinput === true) {
    inputError.classList.add("hide");
    return trimmedInput;
  } else {
    inputError.classList.remove("hide");
    inputError.innerText = isValidinput;
    return null;
  }
}

function submitEditForm(trimmedInput, editIndex) {
  //to submit the form based on edit fuctionality for the todo and set the edit flag false when its completed
  const editTask = {
    taskId: editIndex,
    taskName: trimmedInput,
    completed: false,
  };
  updateTodotoLocalStorage(editTask);
  renderTasks();
  input.setAttribute("edit",false)
}

function renderTasks() {
  //get the tasks from localstorage and create the taskcards and append into todolist container
  todoList.innerHTML = "";
  const todos = getTodoFromLocalStorage();
  if (todos.length === 0) {
    noTaskFound();
  } else {
    removeNoTaskFound();
    todos.forEach((todo) => {
      const taskCard = createTaskCard(
        todo.taskName,
        todo.taskId,
        todo.completed
      );
      taskCards.push(taskCard);

      todoList.append(taskCard);
    });
  }
}

function noTaskFound() {
  //to append the paragraph tag content having "no tasks found" 
  const p = document.createElement("p");
  p.classList.add("no-task-found");
  p.setAttribute("id", "no-tasks-id");
  p.innerText = "No Task Found";
  todoList.append(p);
}
function removeNoTaskFound() {
  //to remove the paragraph tag if its exists in the todolist container
  const p = document.querySelector("#no-tasks-id");
  if (p) {
    todoList.removeChild(p);
  }
}

function createTask(taskName) {
  //to create the task with given task name and save it to the local storage and if paragraph exists it will remove and render the all tasks elements
  const task = {
    taskId: counter++,
    taskName,
    completed: false,
    created_at:getCurrentTime(),
    updated_at:getDefaultTime()
  };

  saveTodoToLocalStorage(task);
  removeNoTaskFound();
  renderTasks();
}

function getCurrentTime(){
  return new Date()
}
function getDefaultTime(){
  return new Date(0)
}

function createTaskCard(taskName, taskId, isCompleted) {
  //to create one task card which consists of checkbox and task name and group of buttons which contain delete ,edit button and return task card
  const taskCard = document.createElement("div");
  taskCard.classList.add("todo-card");
  taskCard.setAttribute("index", taskId);
  const checkBoxContainer = createCheckbox(isCompleted);
  const taskNameContainer = createTaskName(taskName, isCompleted);
  const btnGroup = createToDoButtons();
  taskCard.append(checkBoxContainer, taskNameContainer, btnGroup);
  return taskCard;
}
function createToDoButtons() {
  //to create the button group which consists of edit button and delete button for each individual task card
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
  //to create a button which contains icon image and append the image into button container
  const divContainer = document.createElement("div");
  divContainer.classList.add(className);
  const img = document.createElement("img");
  img.src = iconImageSource;
  img.alt = alternateText;
  img.setAttribute("id", id);
  divContainer.append(img);
  return divContainer;
}
function createTaskName(taskName, isCompleted) {
  //to create task name or edit the task name if its already completed it will have line through
  const taskNameContainer = document.createElement("div");
  taskNameContainer.classList.add("task-name-container");
  const taskNameInput = document.createElement("input");
  taskNameInput.value = taskName;
  taskNameInput.readOnly = true;
  taskNameInput.classList.add("task-name");
  if (isCompleted) {
    taskNameInput.classList.add("line-through");
  }
  taskNameInput.setAttribute("id", "task-name-id");
  taskNameContainer.append(taskNameInput);
  return taskNameContainer;
}

function createCheckbox(isCompleted) {
  //to create a checkbox input if it is already completed then assigned checked symbol to it
  const checkBoxContainer = document.createElement("div");
  checkBoxContainer.classList.add("checkbox-container");

  const checkInput = document.createElement("input");

  checkInput.type = "checkbox";
  checkInput.setAttribute("id", "completed-checkbox");
  checkInput.classList.add("completed");
  checkInput.checked = isCompleted;
  checkBoxContainer.append(checkInput);
  return checkBoxContainer;
}
function operations(e) {
//to handle the buttons that clicked in the todo card 

  const target = e.target;

  if (target.id === "completed-checkbox") {
//to handle the clicking complete button behvaiour if its already completed then uncheck on the todo card     
    const isChecked = target.checked;
    if (isChecked) {
      isTaskCompleted(target, true);
    } else {
      isTaskCompleted(target, false);
    }
  }
  if (target.id === "edit-btn-id") {
//to handle the clicking edit button behaviour     
    editTask(target)
  }

  if (target.id === "delete-btn-id") {
    //to handle the delete button behaviour     
    deleteTask(target)
  }
}
function editTask(target){
  //to traverse the parent element todo card from edit button and queryselect the form input and get the value of the form input and setting attributes for editing and which todo card is editing by setting todo card index 
  const todoCard = target.parentNode.parentNode.parentNode;
  const taskName = todoCard.querySelector("#task-name-id");
  const editIndex = todoCard.getAttribute("index");
  input.value = taskName.value;
  input.setAttribute("edit", true);
  input.setAttribute("edit-index", editIndex);
  input.focus();
}
function deleteTask(target){
  // to traverse the parent element todo card from the delete button and get the index attribute from todo card and delete it from the local storage and render the all tasks
  const todoCard = target.parentNode.parentNode.parentNode;

  const index = todoCard.getAttribute("index");

  deleteTodofromLocalStorage(index);
  renderTasks();
}


function isTaskCompleted(target, isCompleted) {
  // traverse the parent element from the checkbox completed and query select the task name element set the respective attributes if its completed or not and edit and update in the local storage
  const todoCard = target.parentNode.parentNode;
  const taskName = todoCard.querySelector("#task-name-id");
  input.setAttribute("completed", isCompleted);
  taskName.classList.toggle("line-through");
  const taskNameValue = taskName.value;
  const taskId = todoCard.getAttribute("index");
  const editTask = {
    taskId,
    taskName: taskNameValue,
    completed: isCompleted,
  };
  updateTodotoLocalStorage(editTask);
}

function filterTodos() {
  //to handle the select functionality with 3 states "completed" ,"assigned","all" 
  const selectedValue = statusId.value;

  if (selectedValue === "completed") {
    renderCompletedTodos();
  }
  if (selectedValue === "assigned") {
    renderAssignedTodos();
  }

  if (selectedValue === "all") {
    renderAllTodos();
  }
}
function renderAllTodos() {
  //to render all the tasks when select state is "all"
  const completedCheckboxes = document.querySelectorAll("#completed-checkbox");

  completedCheckboxes.forEach((checkbox) => {
    const checkBoxContainer = checkbox.parentElement;
    const todoCard = checkBoxContainer.parentElement;
    todoCard.classList.add("flex");
    todoCard.classList.remove("hide");
  });
}

function renderAssignedTodos() {
   //to render only the assigned tasks and not completed when select state is "assigned"
  const completedCheckboxes = document.querySelectorAll("#completed-checkbox");

  completedCheckboxes.forEach((checkbox) => {
    const checkBoxContainer = checkbox.parentElement;
    const todoCard = checkBoxContainer.parentElement;
    todoCard.classList.remove("hide");
    todoCard.classList.add("flex");
    if (checkbox.checked) {
      todoCard.classList.remove("flex");
      todoCard.classList.add("hide");
    }
  });
}

function renderCompletedTodos() {
  //to render only the completed tasks when select state is "completed"
  const completedCheckboxes = document.querySelectorAll("#completed-checkbox");

  completedCheckboxes.forEach((checkbox) => {
    const checkBoxContainer = checkbox.parentElement;
    const todoCard = checkBoxContainer.parentElement;
    todoCard.classList.remove("flex");
    todoCard.classList.add("hide");

    if (checkbox.checked) {
      todoCard.classList.remove("hide");
      todoCard.classList.add("flex");
    }
  });
}
function getTodoFromLocalStorage() {
  //to get the todos from local stoarge with the key "todos" if there no todo in the local storage then it will be empty array
  let todos = [];
  if (localStorage.getItem("todos") == null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

function saveTodoToLocalStorage(task) {
  //to get the todos from localstorage and add new task and save to the local storage with key "todos"
  const todos = getTodoFromLocalStorage();
  todos.push(task);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateTodotoLocalStorage(task) {
  //to update the existing todo in the local storage 
  const todos = JSON.parse(localStorage.getItem("todos"));

  const updatedTodos = updateTask(todos, task);
  localStorage.removeItem("todos");
  localStorage.setItem("todos", JSON.stringify(updatedTodos));
}

function deleteTodofromLocalStorage(index) {
  // to delete the todo if its exist on the local storage 
  const todos = getTodoFromLocalStorage();

  const isTaskExist = checkTaskExist(todos, Number(index));
  console.log(isTaskExist, index);
  if (isTaskExist) {
    const todosWithnoGivenTask = todos.filter(
      (todo) => Number(index) !== todo.taskId
    );

    const newTodos = todosWithnoGivenTask.map((todo) => {
      if (todo.taskId >= Number(index)) {
        return {
          ...todo,
          taskId: todo.taskId - 1,
        };
      }
      return todo;
    });
  
    localStorage.removeItem("todos");
    localStorage.setItem("todos", JSON.stringify(newTodos));
  }
}

function checkTaskExist(todos, index) {
  //to check whether the todo is exist or not 
  const number = todos.findIndex((todo) => index === todo.taskId);

  if (number >= 0) {
    return true;
  } else {
    return false;
  }
}

function updateTask(todos, task) {
//to update the existing task from todos which is obtained from local storage and return updated todos
  const newTodos = todos.map((todo) => {
    if (todo.taskId === Number(task.taskId)) {
      todo.taskName = task.taskName;
      todo.completed = task.completed;
      todo.updated_at = getCurrentTime()
    }
    return todo;
  });

  return newTodos;
}

function getNextIndexFromLocalStorage() {
  //to get the next index of the last index in the local storage
  const todos = getTodoFromLocalStorage();
  if (todos.length === 0) {
    return 0;
  } else {
    return todos.length;
  }
}

function completeAll(e) {
  //to assign every tasks completed by clicking click all check box
  const isChecked = e.target.checked;

  const todos = getTodoFromLocalStorage();
  todos.forEach((todo) => {
    const completedTodo = {
      ...todo,
      completed: isChecked,
    };
    updateTodotoLocalStorage(completedTodo);
  });

  renderTasks();
}
function deleteAllTasksfromLocalStorage() {
  //to delete every tasks from local storage by values of the key "todos"
  localStorage.removeItem("todos");
}
function deleteAll() {
  //to delete the every tasks from local storage by clicking delete all button and then the tasks to check
  deleteAllTasksfromLocalStorage();
  renderTasks();
}

const form = document.querySelector("#submit-form");
const input = document.querySelector("#text-input");
const todoList = document.querySelector("#task-list");
const statusId = document.querySelector("#status-id");
const taskCards = [];
const tasks = [];

form.addEventListener("submit", submitForm);
todoList.addEventListener("click", operations);
statusId.addEventListener("change", filterTodos);
document.addEventListener("DOMContentLoaded", renderTasks);
let counter = getNextIndexFromLocalStorage();
function submitForm(event) {
  event.preventDefault();
  const taskName = input.value;
  createTask(taskName);
  input.value = "";
}

function renderTasks() {
  const todos = getTodoFromLocalStorage();

  todos.forEach((todo) => {
    const taskCard = createTaskCard(todo.taskName, todo.taskId, todo.completed);
    taskCards.push(taskCard);
    todoList.append(taskCard);
  });
}

function createTask(taskName) {
  const task = {
    taskId: counter++,
    taskName,
    completed: false,
  };

  const taskCard = createTaskCard(task.taskName, task.taskId, task.completed);
  saveTodoToLocalStorage(task);
  taskCards.push(taskCard);
  todoList.append(taskCard);
}

function createTaskCard(taskName, taskId, isCompleted) {
  const taskCard = document.createElement("div");
  taskCard.classList.add("todo-card");
  taskCard.setAttribute("index", taskId);
  const checkBoxContainer = createCheckbox(isCompleted);
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
  taskNameInput.readOnly = true;
  taskNameInput.classList.add("task-name");
  taskNameInput.setAttribute("id", "task-name-id");
  taskNameContainer.append(taskNameInput);
  return taskNameContainer;
}

function createCheckbox(isCompleted) {
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
  const target = e.target;
  const todoCard = target.parentNode.parentNode.parentNode;
  const taskName = todoCard.querySelector("#task-name-id");

  console.log(target);
  if (target.id === "completed-checkbox") {
    taskCompleted(e.target);
  }
  if (target.id === "edit-btn-id") {
    taskName.readOnly = false;
    taskName.focus();
  }

  if (target.id === "delete-btn-id") {
    const todoCard = target.parentNode.parentNode.parentNode;

    const index = todoCard.getAttribute("index");

    deleteTodofromLocalStorage(index);
    todoCard.remove();
  }
  if (target.id !== "edit-btn-id" && target.id !== "delete-btn-id") {
    taskName.readOnly = true;
  }
}

function taskCompleted(target) {
  const todoCard = target.parentNode.parentNode;
  const taskName = todoCard.querySelector(".task-name");

  taskName.classList.toggle("line-through");
}

function filterTodos() {
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
  const completedCheckboxes = document.querySelectorAll("#completed-checkbox");

  completedCheckboxes.forEach((checkbox) => {
    const checkBoxContainer = checkbox.parentElement;
    const todoCard = checkBoxContainer.parentElement;
    todoCard.classList.add("flex");
    todoCard.classList.remove("hide");
  });
}

function renderAssignedTodos() {
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
  let todos = [];
  if (localStorage.getItem("todos") == null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

function saveTodoToLocalStorage(task) {
  const todos = getTodoFromLocalStorage();
  todos.push(task);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateTodotoLocalStorage(task) {
  const todos = JSON.parse(localStorage.getItem("todos"));

  const updatedTodos = updateTask(todos, task);
  localStorage.setItem("todos", JSON.stringify(updatedTodos));
}

function deleteTodofromLocalStorage(index) {
  const todos = getTodoFromLocalStorage();

  const isTaskExist = checkTaskExist(todos, Number(index));
  console.log(isTaskExist);
  if (isTaskExist) {
    const todosWithnoGivenTask = todos.filter(
      (todo) => Number(index) !== todo.taskId
    );

    const newTodos = todosWithnoGivenTask.map((todo) => {
      if (todo.taskId > Number(index)) {
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
  const number = todos.findIndex((todo) => index === todo.taskId);
  if (number > 0) {
    return true;
  } else {
    return false;
  }
}

function updateTask(todos, task) {
  const newTodos = todos.map((todo) => {
    if (todo.taskId === task.taskId) {
      todo.taskName = task.taskName;
      todo.completed = task.completed;
    }
    return todo;
  });
  return newTodos;
}

function getNextIndexFromLocalStorage() {
  const todos = getTodoFromLocalStorage();
  if (todos.length === 0) {
    return 0;
  } else {
    return todos.length;
  }
}

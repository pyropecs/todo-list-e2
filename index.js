const form = document.querySelector("#submit-form");
const input = document.querySelector("#text-input");
const todoList = document.querySelector("#task-list");
const statusId = document.querySelector("#status-id");
const inputError = document.querySelector("#input-error");
const saveBtn = document.querySelector("#save-btn-id");
const deleteButton = document.querySelector("#delete-all");
const cancelBtn = document.querySelector("#cancel-btn");
const radio_btns = document.querySelectorAll(
  `input[type='radio'][name='radio_choices']`
);
let selectedTasks = [];
let selectedValue = "all";
document.addEventListener("DOMContentLoaded", renderTasks);
form.addEventListener("submit", submitForm);

// statusId.addEventListener("change", filterTodos);
cancelBtn.addEventListener("click", cancelEditTask);
cancelBtn.title = "Cancel the edit";
deleteButton.addEventListener("click", deleteAll);
saveBtn.addEventListener("click", submitForm);
input.addEventListener("input", removeError);
input.addEventListener("focus", removeError);

// to add event listeners to select radio buttons
for (let target of radio_btns) {
  target.addEventListener(`change`, () => {
    selectedValue = target.value;
    renderTasks();
  });
}

function submitForm(event) {
  //to submit the valid input task based on edit the task or creating the task it will be obtained from input form attribute
  event.preventDefault();
  removeError();

  const inputValue = getValidInputValue();

  if (inputValue) {
    const isEdit = input.getAttribute("edit");

    if (isEdit === "true") {
      console.log(inputValue, "edit");
      const editIndex = input.getAttribute("edit-index");
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
    inputError.textContent = isValidinput;
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
  input.setAttribute("edit", false);
  saveBtn.textContent = "Add";

  cancelBtn.classList.remove("block");
  cancelBtn.classList.add("hide");
}

function renderTasks() {
  //get the tasks from localstorage and create the taskcards and append into todolist container according to the selected value
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

      todoList.append(taskCard);
    });
  }

  filterTodos(selectedValue);
  noneSelected();
}

function removeError(e) {
  //to remove already error in the input box

  inputError.textContent = "";
}

function noTaskFound() {
  //to append the paragraph tag content having "no tasks found"
  const p = document.createElement("p");
  p.classList.add("no-task-found");
  p.setAttribute("id", "no-tasks-id");
  p.textContent = "You didnt have any tasks";

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
  const newTaskNumber = getNextIndexFromLocalStorage();

  const task = {
    taskId: newTaskNumber,
    taskName,
    completed: false,
    // created_at: getCurrentTime(),
    // updated_at: getDefaultTime(),
  };
  selectedTasks = [];
  saveTodoToLocalStorage(task);
  removeNoTaskFound();
  renderTasks();
}

function createTaskCard(taskName, taskId, isCompleted) {
  //to create one task card which consists of checkbox and task name and group of buttons which contain delete ,edit button and return task card
  const taskCard = document.createElement("div");
  taskCard.classList.add("todo-card");
  taskCard.setAttribute("index", taskId);
  taskCard.setAttribute("id", "#task-card");
  if (isCompleted) {
    taskCard.setAttribute("completed", isCompleted);
  }

  const checkBoxContainer = createCheckbox();
  const taskNameContainer = createTaskName(taskName, isCompleted);
  const btnGroup = createToDoButtons(isCompleted);
  taskCard.append(checkBoxContainer, taskNameContainer, btnGroup);
  return taskCard;
}
function createToDoButtons(isCompleted) {
  //to create the button group which consists of edit button and delete button and complete button for each individual task card
  const btnGroup = document.createElement("div");
  btnGroup.classList.add("btn-group");
  const editButton = createIconButton(
    "edit",
    "edit-btn-id",
    "./Images/edit.png",
    "edit icon",
    "Edit task",
    checkAndEditTask
  );
  const deleteButton = createIconButton(
    "delete",
    "delete-btn-id",
    "./Images/trash.png",
    "delete button",
    "Delete task",
    confirmAndDeleteTask
  );
  if (isCompleted) {
    const completedButton = createIconButton(
      "complete",
      "complete-btn-id",
      "./Images/checked.png",
      "completed icon",
      "Undo the completed task",
      completeTask
    );
    btnGroup.append(completedButton, editButton, deleteButton);
  } else {
    const completeBtn = createIconButton(
      "complete",
      "complete-btn-id",
      "./Images/checkFill.png",
      "complete icon",
      "Complete task",
      completeTask
    );
    btnGroup.append(completeBtn, editButton, deleteButton);
  }

  return btnGroup;
}

function createIconButton(
  className,
  id,
  iconImageSource,
  alternateText,
  title,
  eventListener
) {
  //to create a button which contains icon image and append the image into button container
  const divContainer = document.createElement("div");
  divContainer.classList.add(className);
  const img = document.createElement("img");
  img.src = iconImageSource;
  img.alt = alternateText;
  img.setAttribute("id", id);
  img.addEventListener("click", eventListener);
  img.title = title;
  divContainer.append(img);
  return divContainer;
}
function createTaskName(taskName, isCompleted) {
  //to create task name or edit the task name if its already completed it will have line through
  const taskNameContainer = document.createElement("div");
  taskNameContainer.classList.add("task-name-container");

  const taskNameInput = document.createElement("p");
  taskNameInput.textContent = taskName;

  taskNameInput.readOnly = true;
  taskNameInput.classList.add("task-name");
  taskNameInput.setAttribute("id", "task-name-id");
  if (isCompleted) {
    taskNameInput.classList.add("opacity");
  }

  taskNameContainer.append(taskNameInput);
  return taskNameContainer;
}

function createCheckbox() {
  //to create a checkbox input if it is already completed then assigned checked symbol to it
  const checkBoxContainer = document.createElement("div");
  checkBoxContainer.classList.add("checkbox-container");

  const checkInput = document.createElement("input");

  checkInput.type = "checkbox";
  checkInput.setAttribute("id", "select-checkbox");
  checkInput.addEventListener("click", selectTask);
  checkInput.classList.add("completed");
  checkInput.title = "Select the task";
  checkBoxContainer.append(checkInput);
  return checkBoxContainer;
}
function noneSelected() {
  if (selectedTasks.length === 0) {
    deleteButton.disabled = true;
  } else {
    deleteButton.disabled = false;
  }
}

function selectTask(e) {
  const todoCard = e.target.parentNode.parentNode;
  const selectedIndex = todoCard.getAttribute("index");
  const checkBox = todoCard.querySelector("#select-checkbox");
  const isChecked = checkBox.checked;

  if (isChecked) {
    selectedTasks.push(selectedIndex);
  } else {
    selectedTasks = selectedTasks.filter(
      (selectedTask) => selectedTask !== selectedIndex
    );
  }

  noneSelected();
}
function checkAndEditTask(e) {
  const target = e.target;
 
  if (checkInputNotExist()) {
    editTask(target);
  }
}
function confirmAndDeleteTask(e) {
  const target = e.target;
  if (confirm("Do you want to delete the mentioned task")) {
    deleteTask(target);
  }
}
function completeTask(e) {
  const target = e.target;
  isTaskCompleted(target);
}

function checkInputNotExist() {
  // to check that confirmation pop up will be shown when user clicks edit button when input field has some value
  const value = input.value;
  if (value.length > 0) {
    return confirm(
      "The input value will be erased if you click the edit button"
    );
  }
  return true;
}
function editTask(target) {
  //to traverse the parent element todo card from edit button and queryselect the form input and get the value of the form input and setting attributes for editing and which todo card is editing by setting todo card index
  const todoCard = target.parentNode.parentNode.parentNode;
  
  const completed = todoCard.getAttribute("completed");
  
  if (completed === null) {
    saveBtn.textContent = "Save";
    saveBtn.title = "Save the task";
    const taskName = todoCard.querySelector("#task-name-id");
   
    const editIndex = todoCard.getAttribute("index");
    input.value = taskName.textContent;
    input.setAttribute("edit", true);
    input.setAttribute("edit-index", editIndex);
    input.focus();
    cancelBtn.classList.remove("hide");
    cancelBtn.classList.add("block");
  }
}
function cancelEditTask(e) {
  if (confirm("Do you want to cancel the edit")) {
    input.value = "";
    input.setAttribute("edit", false);
    input.removeAttribute("edit-index");
    cancelBtn.classList.remove("block");
    cancelBtn.classList.add("hide");
    saveBtn.textContent = "Add";
    saveBtn.title = "Add the task";
  }

  // e.stopPropagation()
}
function deleteTask(target) {
  // to traverse the parent element todo card from the delete button and get the index attribute from todo card and delete it from the local storage and render the all tasks
  const todoCard = target.parentNode.parentNode.parentNode;

  const index = todoCard.getAttribute("index");
  const isEdit = input.getAttribute("edit");
  if (isEdit === "true") {
    input.value = "";
    input.setAttribute("edit", false);
    saveBtn.textContent = "Add";
    input.removeAttribute("edit-index");
    cancelBtn.classList.remove("block");
    cancelBtn.classList.add("hide");
  }
  deleteTodofromLocalStorage(index);
  renderTasks();
}

function isTaskCompleted(target) {
  // traverse the parent element from the checkbox completed and query select the task name element set the respective attributes if its completed or not and edit and update in the local storage
  const todoCard = target.parentNode.parentNode.parentNode;

  const taskId = todoCard.getAttribute("index");
  const taskName = todoCard.querySelector("#task-name-id");

  const currentTodo = getTodoFromLocalStorageUsingIndex(taskId);
  const isCompleted = currentTodo.completed;

  const newTodo = {
    ...currentTodo,
    completed: !isCompleted,
  };
  const newCompleted = !isCompleted;

  if (newCompleted) {
    taskName.classList.add("opacity");
  } else {
    taskName.classList.remove("opacity");
  }
  updateTodotoLocalStorage(newTodo);
  renderTasks();
}

function filterTodos() {
  //to handle the select functionality with 3 states "completed" ,"assigned","all"

  const todoCards = document.querySelectorAll(".todo-card");
  const p = document.querySelector("#no-tasks-id");
  if (todoCards.length !== 0) {
    removeNoTaskFound();
  }
  if (p && selectedValue !== "all") {
    removeNoTaskFound();
  }

  if (selectedValue === "completed") {
    renderCompletedTodos(todoCards);
  }
  if (selectedValue === "assigned") {
    renderAssignedTodos(todoCards);
  }

  if (selectedValue === "all") {
    renderAllTodos(todoCards);
  }
}
function renderAllTodos(todoCards) {
  //to render all the tasks when select state is "all"

  todoCards.forEach((todoCard) => {
    todoCard.classList.add("flex");
    todoCard.classList.remove("hide");
  });
}

function renderAssignedTodos(todoCards) {
  //to render only the assigned tasks and not completed when select state is "assigned" and to check the assigned tasks whether it is empty or not

  let assignedTasks = 0;
  todoCards.forEach((todoCard) => {
    const completed = todoCard.getAttribute("completed");
    todoCard.classList.remove("hide");
    todoCard.classList.add("flex");
    if (completed == "true") {
      todoCard.classList.remove("flex");
      todoCard.classList.add("hide");
    } else {
      assignedTasks += 1;
    }
  });
  if (assignedTasks === 0) {
    noTaskFound();
  }
}

function renderCompletedTodos(todoCards) {
  //to render only the completed tasks when select state is "completed" and to check the completed tasks whether it is empty or not

  let completedTask = 0;
  todoCards.forEach((todoCard) => {
    todoCard.classList.remove("flex");
    todoCard.classList.add("hide");
    const isCompleted = todoCard.getAttribute("completed");

    if (isCompleted === "true") {
      todoCard.classList.remove("hide");
      todoCard.classList.add("flex");
      completedTask += 1;
    }
  });

  if (completedTask === 0) {
    noTaskFound();
  }
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

  if (isTaskExist) {
    const todosWithnoGivenTask = todos.filter(
      (todo) => Number(index) !== todo.taskId
    );

    const newTodos = todosWithnoGivenTask.map((todo, index) => {
      return {
        ...todo,
        taskId: index,
      };
    });

    localStorage.removeItem("todos");
    localStorage.setItem("todos", JSON.stringify(newTodos));
  }
}
function getTodoFromLocalStorageUsingIndex(index) {
  const todos = getTodoFromLocalStorage();
  const [todo] = todos.filter((todo) => todo.taskId === Number(index));
  return todo;
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
      // todo.updated_at = getCurrentTime();
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

function deleteAll() {
  //to delete the selected task from the local storage

  if (confirm("Do you want to delete selected tasks ?")) {
    if (checkInputNotExist()) {
      cancelBtn.classList.remove("block");
      cancelBtn.classList.add("hide");
      saveBtn.textContent = "Add";
      deleteSelectedFromLocalStorage(selectedTasks);
      selectedTasks = [];
      renderTasks();
    }
  }
}

function removeInputValue() {
  //to remove the unwanted string present in the input
  input.value = "";
  input.setAttribute("edit", false);
}

function deleteSelectedFromLocalStorage(selectedTasks) {
  const todos = getTodoFromLocalStorage();

  const filteredTodos = todos.filter(
    (todo) => selectedTasks.indexOf(String(todo.taskId)) === -1
  );
  const newTodos = filteredTodos.map((todo, index) => {
    return {
      ...todo,
      taskId: index,
    };
  });
  localStorage.setItem("todos", JSON.stringify(newTodos));
}

function validateText(input) {
  //to pass the all validation steps then only it will return true or it will give error message
  if (validateNoEmptyString(input) !== true)
    return validateNoEmptyString(input);
  if (validateOnlyAlphaNumericAndAllowedSpecialCharacters(input) !== true)
    return validateOnlyAlphaNumericAndAllowedSpecialCharacters(input);
  if (validateThereisNoSpecialCharactersOnFirstLetter(input) !== true)
    return validateThereisNoSpecialCharactersOnFirstLetter(input);
  if (validateNotMorThan150Characters(input) !== true)
    return validateNotMorThan150Characters(input);
  if (validateMinimumCharacters(input) !== true)
    return validateMinimumCharacters(input);
  return true;
}

function validateNoEmptyString(text) {
  //to check that there is no empty value in the input
  const textLength = text.length;

  if (textLength === 0) {
    return "Input is required";
  } else {
    return true;
  }
}
function validateThereisNoSpecialCharactersOnFirstLetter(text) {
  //to validate that there is no special characters on the first letter
  const re = /^[a-zA-Z0-9]+[^]*$/; //regular expression for only alphanumeric on the first letter
  if (text.match(re)) {
    return true;
  } else return "First letter should be alphanumeric";
}
function validateNotMorThan150Characters(text) {
  // to check that more than 150 characters is not allowed
  const textLength = text.length;
  if (textLength <= 150) {
    return true;
  } else {
    return "Not more than 150 characters";
  }
}

function validateOnlyAlphaNumericAndAllowedSpecialCharacters(text) {
  //to check that only alphanumeric and special characters , ' - . is allowed
  const alphaNumeric = /^[a-zA-Z0-9\s,@'-.]+$/; //regular expression for matching alphabets and  numbers and allowed special characters

  if (text.match(alphaNumeric)) {
    return true;
  } else {
    return "Only alphanumeric and allowed special characters , ' -";
  }
}
function validateMinimumCharacters(text) {
  //to check that input has more than 10 characters
  const textLength = text.length;
  if (textLength > 3) {
    return true;
  } else return "Must be more than 3 characters";
}

// module.exports={
//   submitForm,submitEditForm,cancelEditTask,checkInputNotExist,checkTaskExist,createCheckbox,createIconButton,createTask,createTaskCard,createTaskCard,createTaskName,createToDoButtons,deleteAll,deleteSelectedFromLocalStorage,deleteTask,deleteTodofromLocalStorage,editTask,filterTodos,getNextIndexFromLocalStorage,getTodoFromLocalStorage,getTodoFromLocalStorageUsingIndex,getValidInputValue,isTaskCompleted,noneSelected,operations,removeError,removeInputValue,

// }

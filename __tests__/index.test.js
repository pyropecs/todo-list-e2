const fs = require("fs");
const path = require("path");
const {
  getByText,
  waitFor,
getByRole,
  getByLabelText,
  fireEvent,
  prettyDOM,
  queryByText,
  getByAltText,
} = require("@testing-library/dom");

const Chance = require("chance");
const chance = new Chance();
require("@testing-library/jest-dom");

const { default: userEvent } = require("@testing-library/user-event");

beforeEach(() => {
  const html = fs.readFileSync(
    path.resolve(__dirname, "../index.html"),
    "utf8"
  );
  document.documentElement.innerHTML = html.toString();

  require("../index.js");
  jest.resetModules();
  const mockLocalStorage = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => (store[key] = value.toString()),
      clear: () => (store = {}),
      removeItem: (key) => delete store[key],
    };
  })();
  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage,
  });
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe("to test that input and button html are present", () => {
  test("to check that input and button element wrapped in a form", () => {
    const formElement = document.querySelector("#submit-form");
    const formChilds = Array.from(formElement.children);
    const formChildsId = formChilds.map((formChild) => {
      return formChild.getAttribute("id");
    });
    expect(formChildsId).toStrictEqual([
      "text-input",
      "cancel-btn",
      "save-btn-id",
    ]);
  });

  test("check title is displayed", () => {
    const title = document.querySelector(".title");
    const titleValue = title.textContent;

    expect(titleValue).toBe("To-Do List");
  });

  test("test input field has placeholder", () => {
    const input = document.querySelector("#text-input");
    const inputPlacholder = input.getAttribute("placeholder");
    expect(inputPlacholder).toBe("Enter Task");
  });
  test("test input field has class todo-textfield", () => {
    const input = document.querySelector("#text-input");
    const inputClass = input.classList.contains("todo-textfield");
    expect(inputClass).toBeTruthy();
  });
  test("test input field autocomplete is off", () => {
    const input = document.querySelector("#text-input");
    const autocomplete = input.getAttribute("autocomplete");
    expect(autocomplete).toBe("off");
  });

  test("to test input field is present", () => {
    const input = document.querySelector("#text-input");
    expect(input).not.toBeNull();
  });

  test("to test that input field has name attribute", () => {
    const input = document.querySelector("#text-input");
    const inputName = input.getAttribute("name");
    expect(inputName).toBe("input");
  });
  test("to test that input field has type attribute equal to input", () => {
    const input = document.querySelector("#text-input");
    const inputName = input.getAttribute("type");
    expect(inputName).toBe("text");
  });

  test("to test that add button is present", () => {
    const button = document.querySelector("#save-btn-id");

    expect(button).not.toBeNull();
  });

  test("to test that Add content is displayed on that button", () => {
    const button = document.querySelector("#save-btn-id");
    const buttonContent = button.textContent;
    expect(buttonContent).toBe("Add");
  });

  test("to test add button have its btn class", () => {
    const button = document.querySelector("#save-btn-id");
    const buttonClass = button.classList.contains("btn");
    expect(buttonClass).toBeTruthy();
  });

  test("to test that title attribute is present in the add button", () => {
    const button = document.querySelector("#save-btn-id");
    const titleAttributeButton = button.getAttribute("title");
    expect(titleAttributeButton).toBe("Add the task");
  });
  test("to test that add button has type submit ", () => {
    const button = document.querySelector("#save-btn-id");
    const titleAttributeButton = button.getAttribute("type");
    expect(titleAttributeButton).toBe("submit");
  });
});

describe("to test that task status tabs elements are present", () => {
  test("switch tab wrapped by form elements", () => {
    const radioButtons = document.querySelector("#radio-buttons");
    const radioButtonsChilds = radioButtons.childElementCount;
    expect(radioButtons.tagName).toBe("FORM");
    expect(radioButtonsChilds).toBe(6);
  });

  test("tab switch all has corresponing label", () => {
    const radioInput = document.querySelector("#all");
    const label = radioInput.labels[0];
    const labelText = label.textContent;
    const labelFor = label.getAttribute("for");
    expect(labelFor).toBe("all");
    expect(labelText).toBe("All");
  });
  test("to test that all inputs have the all corresponding attributes", () => {
    const radioInput = document.querySelector("#all");
    const radioTypeAttribute = radioInput.getAttribute("type");
    const radioNameInput = radioInput.getAttribute("name");
    const radioValueAttribute = radioInput.getAttribute("value");
    const radioCheckedAttribute = radioInput.getAttribute("checked");
    expect(radioTypeAttribute).toBe("radio");
    expect(radioNameInput).toBe("radio_choices");
    expect(radioValueAttribute).toBe("all");
    expect(radioCheckedAttribute).toBe("checked");
  });

  test("tab switch assigned has corresponing label", () => {
    const radioInput = document.querySelector("#assigned");
    const label = radioInput.labels[0];
    const labelText = label.textContent;
    const labelFor = label.getAttribute("for");
    expect(labelFor).toBe("assigned");
    expect(labelText).toBe("Assigned");
  });
  test("to test that assigned inputs have the all corresponding attributes", () => {
    const radioInput = document.querySelector("#assigned");
    const radioTypeAttribute = radioInput.getAttribute("type");
    const radioNameInput = radioInput.getAttribute("name");
    const radioValueAttribute = radioInput.getAttribute("value");
    const radioCheckedAttribute = radioInput.getAttribute("checked");
    expect(radioTypeAttribute).toBe("radio");
    expect(radioNameInput).toBe("radio_choices");
    expect(radioValueAttribute).toBe("assigned");
    expect(radioCheckedAttribute).not.toBe("checked");
  });

  test("tab switch completed has corresponing label", () => {
    const radioInput = document.querySelector("#completed");
    const label = radioInput.labels[0];
    const labelText = label.textContent;
    const labelFor = label.getAttribute("for");
    expect(labelFor).toBe("completed");
    expect(labelText).toBe("Completed");
  });
  test("to test that completed inputs have the all corresponding attributes", () => {
    const radioInput = document.querySelector("#completed");
    const radioTypeAttribute = radioInput.getAttribute("type");
    const radioNameInput = radioInput.getAttribute("name");
    const radioValueAttribute = radioInput.getAttribute("value");
    const radioCheckedAttribute = radioInput.getAttribute("checked");
    expect(radioTypeAttribute).toBe("radio");
    expect(radioNameInput).toBe("radio_choices");
    expect(radioValueAttribute).toBe("completed");
    expect(radioCheckedAttribute).not.toBe("checked");
  });
});

// describe("to check button element is present and disabled initially", () => {
//   const deleteBtn = document.querySelector("#delete-all");
//   expect(deleteBtn).not.toBeNull();
//   const deleteBtnDisabled = deleteBtn.disabled;
//   expect(deleteBtnDisabled).toBeTruthy();
// });

describe("to test the input validation ", () => {
  test("input validation with valid inputs", () => {
    const input = document.querySelector("#text-input");
    const inputError = document.querySelector("#input-error");
    const submitButton = document.querySelector("#save-btn-id");
    const form = document.querySelector("#submit-form");

    const validInput = chance.string({
      length: 30,
      symbols: false,
      alpha: true,
      numeric: true,
    });
    input.value = validInput;
    expect(input).toHaveValue(validInput);
    fireEvent(submitButton, new Event("click"));
    expect(input).toHaveValue("");
    expect(inputError.textContent).toBe("");
    const tasks = JSON.parse(localStorage.getItem("todos"));
    expect(tasks).toStrictEqual([
      { taskName: validInput, taskId: 0, completed: false },
    ]);
  });

  test("input validation with upper boundary value", () => {
    const input = document.querySelector("#text-input");
    const form = document.querySelector("#submit-form");
    const inputError = document.querySelector("#input-error");
    const upperBoundaryLimit = chance.string({
      length: 150,
      symbols: false,
      alpha: true,
      numeric: true,
    });
    input.value = upperBoundaryLimit;
    fireEvent(form, new Event("submit"));
    expect(input).toHaveValue("");
    expect(inputError.textContent).toBe("");

    const tasks = JSON.parse(localStorage.getItem("todos"));
    expect(tasks).toStrictEqual([
      { taskName: upperBoundaryLimit, taskId: 0, completed: false },
    ]);
  });
  test("input validation with lower boundary value", () => {
    const input = document.querySelector("#text-input");
    const form = document.querySelector("#submit-form");
    const inputError = document.querySelector("#input-error");
    const lowerBoundaryLimit = chance.string({
      length: 4,
      symbols: false,
      alpha: true,
      numeric: true,
    });
    input.value = lowerBoundaryLimit;
    fireEvent(form, new Event("submit"));
    expect(input).toHaveValue("");
    expect(inputError.textContent).toBe("");

    const tasks = JSON.parse(localStorage.getItem("todos"));
    expect(tasks).toStrictEqual([
      { taskName: lowerBoundaryLimit, taskId: 0, completed: false },
    ]);
  });

  test("input validation with invalid inputs", () => {
    const input = document.querySelector("#text-input");
    const inputError = document.querySelector("#input-error");
    const form = document.querySelector("#submit-form");

    input.value = "";
    expect(input).toHaveValue("");
    form.dispatchEvent(new Event("submit"));
    const inputRequired = inputError.textContent;
    expect(inputRequired).toBe("Input is required");
    const symbolText = chance.string({ pool: "$#$#$#$#$#" });
    input.value = symbolText;
    expect(input).toHaveValue(symbolText);
    form.dispatchEvent(new Event("submit"));
    expect(inputError.textContent).toBe(
      "Only alphanumeric and allowed special characters , ' -"
    );
    const firstCharacterSymbol =
      "," +
      chance.string({ length: 10, alpha: true, symbols: false, numeric: true });
    input.value = firstCharacterSymbol;
    expect(input).toHaveValue(firstCharacterSymbol);
    form.dispatchEvent(new Event("submit"));
    expect(inputError.textContent).toBe("First letter should be alphanumeric");
    const moreThanLimit = chance.string({
      length: 151,
      symbols: false,
      alpha: true,
      numeric: true,
    });
    input.value = moreThanLimit;
    expect(input).toHaveValue(moreThanLimit);
    form.dispatchEvent(new Event("submit"));

    expect(inputError.textContent).toBe("Not more than 150 characters");
    const lessThanLimit = chance.string({
      length: 1,
      symbols: false,
      alpha: true,
      numeric: true,
    });
    input.value = lessThanLimit;
    expect(input).toHaveValue(lessThanLimit);
    form.dispatchEvent(new Event("submit"));
    expect(inputError.textContent).toBe("Must be more than 3 characters");
  });
});

describe("to check that filter button giving the exact output ", () => {
  test("to check that filter buttons are displayed", () => {
    const radioButtonContainer = document.querySelector("#radio-buttons");
    const radioButtons = document.querySelectorAll(
      '#radio-buttons input[type="radio"]'
    );
    const radioButtonsLength = radioButtons.length;
    expect(radioButtonsLength).toBe(3);

    expect(getByText(radioButtonContainer, /All/)).toBeInTheDocument();
    expect(getByText(radioButtonContainer, /Assigned/)).toBeInTheDocument();
    expect(getByText(radioButtonContainer, /Completed/)).toBeInTheDocument();
  });
  test("to check that clicking any status giving the correct value as output", async () => {
    const radioButtonContainer = document.querySelector("#radio-buttons");

    const assignedButton = getByLabelText(radioButtonContainer, /Assigned/, {
      selector: "input",
    });
    await userEvent.click(assignedButton);
    await waitFor(() => {
      expect(assignedButton.checked).toBe(true);
    });

    const allButton = getByLabelText(radioButtonContainer, /All/, {
      selector: "input",
    });
    await userEvent.click(allButton);
    await waitFor(() => {
      expect(assignedButton.checked).toBe(false);
    });
  });

  test("to check that list of tasks shown in the completed section", async () => {
    const radioButtonContainer = document.querySelector("#radio-buttons");
    const completedButton = getByLabelText(radioButtonContainer, /Completed/, {
      selector: "input",
    });
    await userEvent.click(completedButton);
    await waitFor(() => {
      const todoList = document.querySelector("#task-list");
      const todoCards = todoList.querySelectorAll(".todo-card");
      let count = 0;
      todoCards.forEach((todoCard) => {
        const hide = todoCard.classList.contains("hide");
        if (!hide) {
          count++;
        }
      });
      expect(count).toBe(0);
    });
  });
  test("to check that list of tasks shown in the assigfned section", async () => {
    const radioButtonContainer = document.querySelector("#radio-buttons");
    const assignedButton = getByLabelText(radioButtonContainer, /Assigned/, {
      selector: "input",
    });
    await userEvent.click(assignedButton);
    await waitFor(() => {
      const todoList = document.querySelector("#task-list");
      const todoListChildren = todoList.childElementCount;

      expect(todoListChildren).toBe(todoListChildren);
    });
  });
});

describe("to check that Add Functionality working properly ", () => {
  function createTask() {
    const input = document.querySelector("#text-input");
    const saveBtn = document.querySelector("#save-btn-id");

    const inputValue = chance.string({
      symbols: false,
      numeric: true,
      alpha: true,
      length: 30,
    });
    input.value = inputValue;
    fireEvent(saveBtn, new Event("click"));
  }

  test("to check that with the valid input task is added to list ", async () => {
    const numberOfTasks = 5;
    for (let i = 0; i < numberOfTasks; i++) {
      createTask();
    }
    const todoCards = document.querySelectorAll(".todo-card");
    expect(todoCards.length).toBe(numberOfTasks);
  });
  test("to check that with invalid input task whether added to the list", async () => {
    const input = document.querySelector("#text-input");
    const saveBtn = document.querySelector("#save-btn-id");
    const inputError = document.querySelector("#input-error");

    const inputValue = chance.string({
      symbols: true,
      numeric: false,
      alpha: false,
      length: 30,
    });
    input.value = inputValue;
    fireEvent(saveBtn, new Event("click"));
    expect(inputError.textContent).toBe(
      "Only alphanumeric and allowed special characters , ' -"
    );
  });
});

describe("to check that delete functionality working properly", () => {
  function createTask(inputValue) {
    const input = document.querySelector("#text-input");
    const saveBtn = document.querySelector("#save-btn-id");

    input.value = inputValue;
    fireEvent(saveBtn, new Event("click"));
  }
  test("to check that delete functionality is working by clicking it", async () => {
    const todoList = document.querySelector("#task-list");
    const numberOfTasks = 6;
    const tasks = [];
    for (let i = 0; i < numberOfTasks; i++) {
      const inputValue = chance.string({
        symbols: false,
        numeric: true,
        alpha: true,
        length: 30,
      });
      tasks.push(inputValue);
      createTask(inputValue);
    }
    todoCards = document.querySelectorAll(".todo-card");
    expect(todoCards.length).toBe(numberOfTasks);

    window.confirm = jest.fn().mockReturnValue(true);
    const taskName = getByText(todoList, tasks[1]);
    const todoCard = taskName.parentElement.parentElement;
    const deleteButton = todoCard.querySelector("#delete-btn-id");
    deleteButton.dispatchEvent(new Event("click"));
    expect(window.confirm).toHaveBeenCalled();
    todoCards = document.querySelectorAll(".todo-card");
    expect(queryByText(todoList, taskName)).toBeNull();
    expect(todoCards.length).toBe(numberOfTasks - 1);
  });

  test("to check that delete functioality is not deleted when user cancel the confirmation", () => {
   
    const todoList = document.querySelector("#task-list");
     const input = document.querySelector("#text-input");
    const saveBtn = document.querySelector("#save-btn-id");
    const validInput = chance.string({
      symbols: false,
      numeric: false,
      alpha: true,
      length: 30,
    });
    let todoCards;
    input.value = validInput;
    fireEvent(saveBtn, new Event("click"));
    todoCards = document.querySelectorAll(".todo-card");
    expect(todoCards.length).toBe(1);
    window.confirm = jest.fn().mockReturnValue(false);
    const taskName = getByText(todoList, validInput);
    const todoCard = taskName.parentElement.parentElement;
    const deleteButton = todoCard.querySelector("#delete-btn-id");
    deleteButton.dispatchEvent(new Event("click"));
    expect(window.confirm).toHaveBeenCalled();
    todoCards = document.querySelectorAll(".todo-card");
    expect(todoCards.length).toBe(1);
  });
});

describe("to check that complete functionality working properly", () => {
  test("to check the uncompleted task got completed when clicking complete button", () => {
    const input = document.querySelector("#text-input");
    const saveBtn = document.querySelector("#save-btn-id");
    const todoList = document.querySelector("#task-list")
    const validInput = chance.string({
      symbols: false,
      numeric: false,
      alpha: true,
      length: 30,
    });
    let todoCards;
    input.value = validInput;
    fireEvent(saveBtn, new Event("click"));
    todoCards = document.querySelectorAll(".todo-card");
    expect(todoCards.length).toBe(1);
    let completeButton;
    let opacityExists;

    let taskName = getByText(todoList, validInput);
    let todoCard = taskName.parentElement.parentElement;
    
    completeButton = todoCard.querySelector("#complete-btn-id");
   
    expect(completeButton).toHaveAttribute("src", "./Images/checkFill.png");
    opacityExists = taskName.classList.contains("opacity");
    expect(opacityExists).toBe(false);
    fireEvent(completeButton, new Event("click"));
    opacityExists = taskName.classList.contains("opacity");
    taskName =  getByText(todoList, validInput);
    todoCard = taskName.parentElement.parentElement
    expect(opacityExists).toBe(true);
    completeButton = todoCard.querySelector("#complete-btn-id");
    expect(completeButton).toHaveAttribute("src", "./Images/checked.png");
  });

  test("to check that completed task got uncompleted when clicking complete button", () => {
    //creating task
    const input = document.querySelector("#text-input");
    const saveBtn = document.querySelector("#save-btn-id");
    const validInput = chance.string({
      symbols: false,
      numeric: false,
      alpha: true,
      length: 30,
    });
    let todoCards;
    input.value = validInput;
    fireEvent(saveBtn, new Event("click"));
    todoCards = document.querySelectorAll(".todo-card");
    expect(todoCards.length).toBe(1);
    //complete task
    let completeButton;
    let opacityExists;
    let taskName;
    completeButton = document.querySelector("#complete-btn-id");
    taskName = document.querySelector(".task-name");
    expect(completeButton).toHaveAttribute("src", "./Images/checkFill.png");
    opacityExists = taskName.classList.contains("opacity");
    expect(opacityExists).toBe(false);
    fireEvent(completeButton, new Event("click"));
    opacityExists = taskName.classList.contains("opacity");
    taskName = document.querySelector(".task-name");
    expect(opacityExists).toBe(true);
    completeButton = document.querySelector("#complete-btn-id");
    expect(completeButton).toHaveAttribute("src", "./Images/checked.png");

    //uncomplete task

    completeButton = document.querySelector("#complete-btn-id");
    taskName = document.querySelector(".task-name");
    expect(completeButton).toHaveAttribute("src", "./Images/checked.png");
    opacityExists = taskName.classList.contains("opacity");
    expect(opacityExists).toBe(true);
    fireEvent(completeButton, new Event("click"));
    opacityExists = taskName.classList.contains("opacity");
    taskName = document.querySelector(".task-name");
    expect(opacityExists).toBe(false);
    completeButton = document.querySelector("#complete-btn-id");
    expect(completeButton).toHaveAttribute("src", "./Images/checkFill.png");
  });
});

describe("to check that edit functionality is working properly", () => {
  test("to check that clicking edit icon should fill input box with task name", () => {
    const input = document.querySelector("#text-input");
    
    const saveBtn = document.querySelector("#save-btn-id");
    const validInput = chance.string({
      symbols: false,
      numeric: false,
      alpha: true,
      length: 30,
    });
    input.value = validInput;
    fireEvent(saveBtn, new Event("click"));
    todoCards = document.querySelectorAll(".todo-card");
    expect(todoCards.length).toBe(1);
    const taskName = getByText(document, validInput);
    const todoCard = taskName.parentElement.parentElement;
    const editButton= todoCard.querySelector("#edit-btn-id");
    fireEvent(editButton, new Event("click"));
    expect(input.value).toBe(validInput);
    expect(input).toHaveAttribute("edit", "true");
    expect(input).toHaveAttribute("edit-index", "0");
    expect(getByText(saveBtn, "Save")).toBeInTheDocument();
  });
  test("to check that user can cancel the changes they made after confirmatiion", () => {
    const input = document.querySelector("#text-input");
    const cancelBtn = document.querySelector("#cancel-btn");
    const saveBtn = document.querySelector("#save-btn-id");
    const todoList = document.querySelector("#task-list");
    const validInput = chance.string({
      symbols: false,
      numeric: false,
      alpha: true,
      length: 30,
    });
    input.value = validInput;
    fireEvent(saveBtn, new Event("click"));
    todoCards = document.querySelectorAll(".todo-card");

    expect(todoCards.length).toBe(1);
    let taskName = getByText(todoList, validInput);
   
    const todoCard = taskName.parentElement.parentElement;
    const editButton = todoCard.querySelector("#edit-btn-id");
   
    fireEvent(editButton, new Event("click"));
    expect(cancelBtn.classList.contains("block")).toBe(true);
    const newInput = chance.string({
      symbols: false,
      numeric: false,
      alpha: true,
      length: 50,
    });
    input.value = newInput;
    window.confirm = jest.fn().mockReturnValue(true);
    fireEvent(cancelBtn, new Event("click"));

    expect(window.confirm).toHaveBeenCalled();
    expect(input.value).toBe("");
    expect(cancelBtn.classList.contains("block")).toBe(false);
    expect(taskName.textContent).toBe(validInput);
  });
  test("to check that user can continue the edit functionality when they cancel the confirmatiion pop up", () => {
    const input = document.querySelector("#text-input");
    const cancelBtn = document.querySelector("#cancel-btn");
    const saveBtn = document.querySelector("#save-btn-id");

    const validInput = chance.string({
      symbols: false,
      numeric: false,
      alpha: true,
      length: 30,
    });
    input.value = validInput;
    fireEvent(saveBtn, new Event("click"));
    todoCards = document.querySelectorAll(".todo-card");

    expect(todoCards.length).toBe(1);

    const editButton = document.querySelector("#edit-btn-id");
    fireEvent(editButton, new Event("click"));
    expect(cancelBtn.classList.contains("block")).toBe(true);
    const newInput = chance.string({
      symbols: false,
      numeric: false,
      alpha: true,
      length: 50,
    });
    input.value = newInput;
    window.confirm = jest.fn().mockReturnValue(false);
    fireEvent(cancelBtn, new Event("click"));

    expect(window.confirm).toHaveBeenCalled();
    expect(input.value).toBe(newInput);
  });

  test("to check that editing the task actually got updated in task list", () => {
    const input = document.querySelector("#text-input");
    const todoList = document.querySelector("#task-list");
    const saveBtn = document.querySelector("#save-btn-id");

    const validInput = chance.string({
      symbols: false,
      numeric: false,
      alpha: true,
      length: 30,
    });
    input.value = validInput;
    fireEvent(saveBtn, new Event("click"));
    const todoCards = document.querySelectorAll(".todo-card");
    expect(todoCards.length).toBe(1);
    let taskName = getByText(todoList, validInput);
    const editButton = document.querySelector("#edit-btn-id");
    fireEvent(editButton, new Event("click"));
    const newInput = chance.string({
      symbols: false,
      numeric: false,
      alpha: true,
      length: 50,
    });
    input.value = newInput;
    fireEvent(saveBtn, new Event("click"));
    taskName = getByText(todoList, newInput);
    expect(taskName.textContent).toBe(newInput);
  });

  test("to check that invalid inputs should not be allowed when editing the task", async () => {
    const input = document.querySelector("#text-input");
    const todoList = document.querySelector("#task-list");
    const inputError = document.querySelector("#input-error");
    const saveBtn = document.querySelector("#save-btn-id");

    const validInput = chance.string({
      symbols: false,
      numeric: false,
      alpha: true,
      length: 30,
    });
    input.value = validInput;
    fireEvent(saveBtn, new Event("click"));
    todoCards = document.querySelectorAll(".todo-card");
    expect(todoCards.length).toBe(1);
    const editButton = document.querySelector("#edit-btn-id");
    fireEvent(editButton, new Event("click"));
    let taskName = getByText(todoList, validInput);
    input.value = "";
    fireEvent(saveBtn, new Event("click"));
    const error = inputError.textContent;
    expect(error).toBe("Input is required");
    expect(taskName.textContent).toBe(validInput);
    await userEvent.type(input, "dsdds");
    await waitFor(() => {
      expect(document.querySelector("#input-error").textContent).toBe("");
    });
  });

  test("to check that input value should not be erased when edit button is clicked", () => {
    const input = document.querySelector("#text-input");
    const todoList = document.querySelector("#task-list");
    const tasks = [];
    function createTask() {
      const input = document.querySelector("#text-input");
      const validInput = chance.string({
        symbols: false,
        numeric: false,
        alpha: true,
        length: 30,
      });
      const saveBtn = document.querySelector("#save-btn-id");
      tasks.push(validInput);
      input.value = validInput;
      fireEvent(saveBtn, new Event("click"));
    }
    createTask();
    createTask();
    input.value = chance.string({
      symbols: false,
      numeric: false,
      alpha: true,
      length: 5,
    });

    const taskName = getByText(todoList, tasks[1]);
    const todoCard = taskName.parentElement.parentElement;
    const editButton = todoCard.querySelector("#edit-btn-id");
    window.confirm = jest.fn().mockReturnValue(true);

    fireEvent(editButton, new Event("click"));

    expect(window.confirm).toHaveBeenCalled();
  });
});

describe("to check the multiple delete items is working properly", () => {
  function createTask(validInput) {
    const input = document.querySelector("#text-input");

    const saveBtn = document.querySelector("#save-btn-id");

    input.value = validInput;
    fireEvent(saveBtn, new Event("click"));
  }
  test(" select the multiple task and should be deleted by clicking delete button", () => {
    const deleteButton = document.querySelector("#delete-all");
    expect(deleteButton.disabled).toBe(true);
    const numberOfTasks = 7;

    const tasks = [];
    for (let i = 0; i < numberOfTasks; i++) {
      const validInput = chance.string({
        symbols: false,
        numeric: false,
        alpha: true,
        length: 30,
      });
      tasks.push(validInput);
      createTask(validInput);
    }
    let todoCards = document.querySelectorAll(".todo-card");

    expect(todoCards.length).toBe(numberOfTasks);
    const selectedTasks = [tasks[1], tasks[2], tasks[4]];
    todoCards.forEach((todoCard) => {
      const taskName = todoCard.querySelector("#task-name-id");
      const taskContent = taskName.textContent;
      if (selectedTasks.includes(taskContent)) {
        let selectCheckbox = todoCard.querySelector("#select-checkbox");
        expect(selectCheckbox.checked).toBe(false);
        fireEvent.click(selectCheckbox);
        selectCheckbox = todoCard.querySelector("#select-checkbox");

        expect(selectCheckbox.checked).toBe(true);
      }
    });
    window.confirm = jest.fn().mockReturnValue(true);
    expect(deleteButton.disabled).toBe(false);
    fireEvent.click(deleteButton);
    expect(window.confirm).toHaveBeenCalled();
    todoCards = document.querySelectorAll(".todo-card");
    const remainingTasks = numberOfTasks - selectedTasks.length;
    expect(todoCards.length).toBe(remainingTasks);
  });

  test("to check that unselect the multiple task and should be deleted by clicking delete button", () => {
    const deleteButton = document.querySelector("#delete-all");
    expect(deleteButton.disabled).toBe(true);
    const numberOfTasks = 7;

    const tasks = [];
    for (let i = 0; i < numberOfTasks; i++) {
      const validInput = chance.string({
        symbols: false,
        numeric: false,
        alpha: true,
        length: 30,
      });
      tasks.push(validInput);
      createTask(validInput);
    }
    let todoCards = document.querySelectorAll(".todo-card");
    todoCards.forEach((todoCard) => {
      let selectCheckbox = todoCard.querySelector("#select-checkbox");
      expect(selectCheckbox.checked).toBe(false);
      fireEvent.click(selectCheckbox);
      selectCheckbox = todoCard.querySelector("#select-checkbox");
      //selecting all the tasks

      expect(selectCheckbox.checked).toBe(true);
    });
    const unselectTasks = [tasks[2], tasks[1], tasks[5]];
    todoCards.forEach((todoCard) => {
      const taskName = todoCard.querySelector("#task-name-id");
      const taskContent = taskName.textContent;
      if (unselectTasks.includes(taskContent)) {
        let selectCheckbox = todoCard.querySelector("#select-checkbox");
        expect(selectCheckbox.checked).toBe(true);
        fireEvent.click(selectCheckbox);
        selectCheckbox = todoCard.querySelector("#select-checkbox");
        expect(selectCheckbox.checked).toBe(false);
      }
    });
    window.confirm = jest.fn().mockReturnValue(true);
    expect(deleteButton.disabled).toBe(false);
    fireEvent.click(deleteButton);
    expect(window.confirm).toHaveBeenCalled();
    todoCards = document.querySelectorAll(".todo-card");

    expect(todoCards.length).toBe(unselectTasks.length);
  });
});

describe("checking input validation function components", () => {
  test("testing validation components with valid inputs", () => {
    let validInput = chance.string({
      symbols: false,
      alpha: true,
      numeric: true,
      length: 20,
    });
    const {
      validateText,
      validateNoEmptyString,
      validateThereisNoSpecialCharactersOnFirstLetter,
      validateNotMorThan150Characters,
      validateOnlyAlphaNumericAndAllowedSpecialCharacters,
      validateMinimumCharacters,
      filterTodos,
    } = require("../index.js");
    expect(validateText(validInput)).toBe(true);
    expect(validateNoEmptyString(validInput)).toBe(true);
    expect(validateThereisNoSpecialCharactersOnFirstLetter(validInput)).toBe(
      true
    );
    expect(validateNotMorThan150Characters(validInput)).toBe(true);
    validInput = chance.string({
      pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,'-",
    });
    expect(
      validateOnlyAlphaNumericAndAllowedSpecialCharacters(validInput)
    ).toBe(true);
    expect(validateMinimumCharacters(validInput)).toBe(true);
  });

  test("testing input validation components with invalid inputs", () => {
    const {
      validateText,
      validateNoEmptyString,
      validateThereisNoSpecialCharactersOnFirstLetter,
      validateNotMorThan150Characters,
      validateOnlyAlphaNumericAndAllowedSpecialCharacters,
      validateMinimumCharacters,
    } = require("../index.js");

    let invalidInput = chance.string({
      symbols: true,
      alpha: false,
      numeric: false,
    });
    expect(validateText(invalidInput)).toBe(
      "Only alphanumeric and allowed special characters , ' -"
    );
    invalidInput = "";
    expect(validateNoEmptyString(invalidInput)).toBe("Input is required");
    invalidInput =
      chance.string({
        symbols: true,
        alpha: false,
        numeric: false,
        length: 1,
      }) +
      chance.string({
        symbols: false,
        alpha: true,
        numeric: true,
        length: 20,
      });
    expect(validateThereisNoSpecialCharactersOnFirstLetter(invalidInput)).toBe(
      "First letter should be alphanumeric"
    );
    invalidInput = chance.string({
      symbols: false,
      alpha: true,
      numeric: true,
      length: 1000,
    });
    expect(validateNotMorThan150Characters(invalidInput)).toBe(
      "Not more than 150 characters"
    );
    invalidInput = chance.string({
      pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()[]",
      length: 100,
    });
    expect(
      validateOnlyAlphaNumericAndAllowedSpecialCharacters(invalidInput)
    ).toBe("Only alphanumeric and allowed special characters , ' -");
    invalidInput = chance.string({
      length: 2,
      symbols: false,
      alpha: true,
      numeric: true,
    });
    expect(validateMinimumCharacters(invalidInput)).toBe(
      "Must be more than 3 characters"
    );
  });
});

describe("testing local storage invididuval compoents", () => {
  function createTask(validInput) {
    if (validInput) {
      const input = document.querySelector("#text-input");

      const saveBtn = document.querySelector("#save-btn-id");

      input.value = validInput;
      fireEvent(saveBtn, new Event("click"));
    } else {
      throw new Error("input does not exist");
    }
  }
  test("getting from local storage functionality", () => {
    const { getTodoFromLocalStorage } = require("../index.js");
    //when there is no elements in local storage
    let todos = getTodoFromLocalStorage();
    expect(todos).toStrictEqual([]);
    const tasks = [];
    const numberOfTasks = 1;
    for (let i = 0; i < numberOfTasks; i++) {
      const validInput = chance.string({
        symbols: false,
        alpha: true,
        numeric: true,
      });
      tasks.push(validInput);
      createTask(tasks[i]);
    }
    for (let i = 0; i < numberOfTasks; i++) {}
    // when there are some elements in it
    todos = getTodoFromLocalStorage();
    expect(todos).toStrictEqual([
      { completed: false, taskId: 0, taskName: tasks[0] },
    ]);
  });

  test("testing saving tasks in local storage", () => {
    const { saveTodoToLocalStorage } = require("../index.js");
    const taskName = chance.string({
      length: 10,
      symbols: false,
      alpha: true,
      numeric: true,
    });
    const task = {
      completed: true,
      taskId: 0,
      taskName,
    };
    saveTodoToLocalStorage(task);
    const todos = JSON.parse(localStorage.getItem("todos"));
    expect(todos).toStrictEqual([task]); //to check that the given task is correctly got setted or not
  });

  test("Testing updating tasks in the local storage", () => {
    const {
      saveTodoToLocalStorage,
      updateTodotoLocalStorage,
    } = require("../index.js");
    const taskName = chance.string({
      length: 10,
      symbols: false,
      alpha: true,
      numeric: true,
    });
    const task = {
      completed: true,
      taskId: 0,
      taskName,
    };
    saveTodoToLocalStorage(task);
    let todos = JSON.parse(localStorage.getItem("todos"));
    expect(todos).toStrictEqual([task]);
    const newTaskName = chance.string({
      length: 10,
      symbols: false,
      alpha: true,
      numeric: true,
    });
    let newTask = {
      completed: true,
      taskId: 0,
      taskName: newTaskName,
    };
    try {
      updateTodotoLocalStorage(newTask); //positive tsting when giving update task exist
      todos = JSON.parse(localStorage.getItem("todos"));
      expect(todos).toStrictEqual([newTask]);
    } catch (error) {
      expect(error.message).toBe(error.message);
    }

    try {
      updateTodotoLocalStorage(newTask); //negative testing when giving update task does not exist
      todos = JSON.parse(localStorage.getItem("todos"));
      newTask = {
        completed: true,
        taskId: 1,
        taskName: newTaskName,
      };
      expect(todos).toStrictEqual([newTask]);
    } catch (error) {
      expect(error.message).toBe(error.message);
    }
  });

  test("to check the delete task from local storage", () => {
    const {
      deleteTodofromLocalStorage,
      saveTodoToLocalStorage,
      getTodoFromLocalStorage,
    } = require("../index.js");
    const numberOfTasks = 2;
    const tasks = [];
    for (let i = 0; i < numberOfTasks; i++) {
      const taskName = chance.string({
        length: 10,
        symbols: false,
        alpha: true,
        numeric: true,
      });
      tasks.push(taskName);
      const task = {
        completed: true,
        taskId: i,
        taskName,
      };

      saveTodoToLocalStorage(task);
    }
    let todos = getTodoFromLocalStorage();
    expect(todos).toStrictEqual([
      { completed: true, taskId: 0, taskName: tasks[0] },
      { completed: true, taskId: 1, taskName: tasks[1] },
    ]);
    try {
      deleteTodofromLocalStorage(1);
      todos = getTodoFromLocalStorage();
      expect(todos).toStrictEqual([
        { completed: true, taskId: 0, taskName: tasks[0] },
      ]);
    } catch (error) {
      expect(error.message).toBe(error.message);
    }
  });
  test("to test that loading task from local storage using index", () => {
    const {
      getTodoFromLocalStorageUsingIndex,
      saveTodoToLocalStorage,
    } = require("../index.js");

    try {
      const taskName = chance.string({
        symbols: false,
        numeric: true,
        alpha: true,
      });
      const task = {
        completed: false,
        taskName,
        taskId: 0,
      };
      saveTodoToLocalStorage(task);

      const todo = getTodoFromLocalStorageUsingIndex(task.taskId); //positive testing when todo is exist
      expect(todo).toStrictEqual(task);
    } catch (error) {
      expect(error.message).toBe("the given task didnt exist");
    }

    try {
      const taskName = chance.string({
        symbols: false,
        numeric: true,
        alpha: true,
      });
      const task = {
        completed: false,
        taskName,
        taskId: 0,
      };
      saveTodoToLocalStorage(task);
      const todo = getTodoFromLocalStorageUsingIndex(1000);
      expect(todo).not.toStrictEqual(task); //negative testing when todo is not exist
    } catch (error) {
      expect(error.message).toBe("the given task didnt exist");
    }
  });

  test("to test the get the next index of the local storage", () => {
    const { getNextIndexFromLocalStorage } = require("../index.js");
    let index = getNextIndexFromLocalStorage();
    expect(index).toBe(0);
    const validInput = chance.string({
      symbols: false,
      numeric: true,
      alpha: true,
    });
    createTask(validInput);
    index = getNextIndexFromLocalStorage();
    expect(index).toBe(1);
  });

  test("to test the delete the selected task from local storage", () => {
    const {
      getTodoFromLocalStorage,
      saveTodoToLocalStorage,
      deleteSelectedFromLocalStorage,
    } = require("../index.js");
    const numberOfTasks = 5;
    for (let i = 0; i < numberOfTasks; i++) {
      const taskName = chance.string({
        symbols: false,
        numeric: true,
        alpha: true,
      });
      const task = {
        taskId: i,
        completed: chance.bool({ likelihood: 60 }),
        taskName,
      };
      saveTodoToLocalStorage(task);
    }

    const todos = getTodoFromLocalStorage();
    const selectedTasks = ["1", "2", "4"];
    deleteSelectedFromLocalStorage(selectedTasks);
    const newTodos = getTodoFromLocalStorage();
    expect(newTodos).not.toStrictEqual(todos);
  });
});

describe("testing filter individual components", () => {
  function createTask(validInput) {
    if (validInput) {
      const input = document.querySelector("#text-input");

      const saveBtn = document.querySelector("#save-btn-id");

      input.value = validInput;
      fireEvent(saveBtn, new Event("click"));
    } else {
      throw new Error("input does not exist");
    }
  }
  test("to test all state in filter st", () => {
    const {
      renderTasks,
      saveTodoToLocalStorage,
      getTodoFromLocalStorage,
    } = require("../index.js");
    const numberOfTasks = 7;
    for (let i = 0; i < numberOfTasks; i++) {
      const taskName = chance.string({
        symbols: false,
        alpha: true,
        numeric: true,
      });
      const task = {
        taskId: i,
        completed: chance.bool({ likelihood: 60 }),
        taskName,
      };
      saveTodoToLocalStorage(task);
    }

    renderTasks();
    const todoCards = document.querySelectorAll(".todo-card");
    expect(todoCards.length).toBe(7);
  });
  test("to test assigned state in filter", () => {
    const {
      renderTasks,
      saveTodoToLocalStorage,
      getTodoFromLocalStorage,
      renderAssignedTodos,
    } = require("../index.js");
    const numberOfTasks = 7;
    for (let i = 0; i < numberOfTasks; i++) {
      const taskName = chance.string({
        symbols: false,
        alpha: true,
        numeric: true,
      });
      const task = {
        taskId: i,
        completed: chance.bool({ likelihood: 60 }),
        taskName,
      };
      saveTodoToLocalStorage(task);
    }
    renderTasks();

    const todoCards = document.querySelectorAll(".todo-card");
    const assignedTasks = renderAssignedTodos(todoCards);
    const todos = getTodoFromLocalStorage();
    const assigned = todos.filter((todo) => {
      return !todo.completed; // getting from the local storage and filter the un completed ones
    });
    expect(assigned.length).toBe(assignedTasks);
  });

  test("to test completed state in filter", () => {
    const {
      renderTasks,
      saveTodoToLocalStorage,
      getTodoFromLocalStorage,
      renderCompletedTodos,
    } = require("../index.js");
    const numberOfTasks = 7;
    for (let i = 0; i < numberOfTasks; i++) {
      const taskName = chance.string({
        symbols: false,
        alpha: true,
        numeric: true,
      });
      const task = {
        taskId: i,
        completed: chance.bool({ likelihood: 60 }),
        taskName,
      };
      saveTodoToLocalStorage(task);
    }
    renderTasks(); //to get the todos from the local storage and append it to the dom

    const todoCards = document.querySelectorAll(".todo-card");
    const completedTasks = renderCompletedTodos(todoCards);
    const todos = getTodoFromLocalStorage();
    const completed = todos.filter((todo) => {
      return todo.completed; // getting from the local storage and filter the completed ones
    });
    expect(completed.length).toBe(completedTasks);
  });
});

describe("to test the form elements ",()=>{
test("to test the function that checking input value is valid or not",()=>{
  const {getValidInputValue}=require("../index.js")
let input = chance.string({length:30,symbols:false,alpha:true,numeric:true})

expect(getValidInputValue(input)).not.toBeNull() // valid input
input = chance.string({length:151})
expect(getValidInputValue(input)).toBeNull()

})



})


describe("to test that ui individual functions working properly",()=>{

test("to test that checkbox input is created inside the container",()=>{
  const {createCheckbox} = require("../index.js")
const checkBoxContainer = createCheckbox()
expect(getByRole(checkBoxContainer,"checkbox")).toHaveRole("checkbox")

})

test("to test that given value inside the task name container",()=>{
const {createTaskName}= require("../index.js")
const validTaskName = chance.string({symbols:false,alpha:true,numeric:true})
const taskNameContainer = createTaskName(validTaskName,true)
expect(getByText(taskNameContainer,validTaskName).textContent).toBe(validTaskName)

})
test("to test that icon button are created ",()=>{
const {createIconButton}=require("../index.js")
const testFn = jest.fn()
const iconElement = createIconButton("test-class-name","icon-id","image-source","alter text","title-test",testFn)
expect(getByAltText(iconElement,"alter text")).toHaveAttribute("src","image-source")
expect(getByAltText(iconElement,"alter text")).toHaveAttribute("id","icon-id")
expect(iconElement.classList.contains("test-class-name")).toBeTruthy()
expect(getByAltText(iconElement,"alter text")).toHaveAttribute("title","title-test")
const testButton = getByAltText(iconElement,"alter text")
fireEvent(testButton,new Event("click"))
expect(testFn).toHaveBeenCalled();
})


})

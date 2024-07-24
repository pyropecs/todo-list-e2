const fs = require("fs");
const path = require("path");
const {
  getByText,
  waitFor,

  getByLabelText,
  fireEvent,
  prettyDOM,
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
  test("to check that with the valid input task is added to list ", async () => {
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
    const todoCards = document.querySelectorAll(".todo-card");
    expect(todoCards.length).toBe(1);
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
  test("to check that delete functionality is working by clicking it", async () => {
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

    window.confirm = jest.fn().mockReturnValue(true);
    const deleteButton = document.querySelector("#delete-btn-id");
    deleteButton.dispatchEvent(new Event("click"));
    expect(window.confirm).toHaveBeenCalled();
    todoCards = document.querySelectorAll(".todo-card");
    expect(todoCards.length).toBe(0);
  });

  test("to check that delete functioality is not deleted when user cancel the confirmation", () => {
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
    const deleteButton = document.querySelector("#delete-btn-id");
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
    const editButton = document.querySelector("#edit-btn-id");
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
    todoCards = document.querySelectorAll(".todo-card");
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
});

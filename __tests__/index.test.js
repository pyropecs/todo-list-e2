const fs = require("fs");
const path = require("path");
const {
  getByText,
  waitFor,
  screen,
  getByLabelText,
  prettyDOM,
} = require("@testing-library/dom");

const Chance = require("chance");
const chance = new Chance();
require("@testing-library/jest-dom");

// const { run } = require("../index.js");
const { default: userEvent } = require("@testing-library/user-event");
const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();
beforeEach(() => {
  const html = fs.readFileSync(
    path.resolve(__dirname, "../index.html"),
    "utf8"
  );
  document.documentElement.innerHTML = html.toString();
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (...args) => mockGetItem(...args),
      setItem: (...args) => mockSetItem(...args),
      removeItem: (...args) => mockRemoveItem(...args),
    },
  });
  require("../index.js");
  jest.resetModules();
  
});

afterEach(() => {
  jest.clearAllMocks();
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
    const todoList = document.querySelector(".todo-list");
    const validInput = chance.string({
      length: 30,
      symbols: false,
      alpha: true,
      numeric: true,
    });
    input.value = validInput;
    expect(input).toHaveValue(validInput);
    submitButton.dispatchEvent(new Event("click"));
    expect(input).toHaveValue("");
    expect(mockSetItem).toHaveBeenCalled();

    expect(mockSetItem).toHaveBeenCalledWith(
      "todos",
      JSON.stringify([{ taskId: 0, taskName: validInput, completed: false }])
    );
    expect(inputError.textContent).toBe("");

    const upperBoundaryLimit = chance.string({
      length: 150,
      symbols: false,
      alpha: true,
      numeric: true,
    });
    input.value = upperBoundaryLimit;
    form.dispatchEvent(new Event("submit"));
    expect(input).toHaveValue("");
    expect(inputError.textContent).toBe("");
    const lowerBoundaryLimit = chance.string({
      length: 4,
      symbols: false,
      alpha: true,
      numeric: true,
    });
    input.value = lowerBoundaryLimit;
    form.dispatchEvent(new Event("submit"));
    expect(input).toHaveValue("");
    expect(inputError.textContent).toBe("");
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

    await userEvent.type(input, "good one");
    await userEvent.click(saveBtn);
    expect(mockSetItem).toHaveBeenCalledTimes(1);
    expect(mockSetItem).toHaveBeenCalledWith(
      "todos",
      JSON.stringify([
        {
          taskId: 0,
          taskName: "good one",
          completed: false,
        },
      ])
    );
  });
  test("to check that with invalid input task whether added to the list", async () => {
    const input = document.querySelector("#text-input");
    const saveBtn = document.querySelector("#save-btn-id");
    const inputError = document.querySelector("#input-error");
    await userEvent.type(input, "$#$#$#");
    await userEvent.click(saveBtn);
    expect(inputError.textContent).toBe(
      "Only alphanumeric and allowed special characters , ' -"
    );
    expect(mockSetItem).not.toHaveBeenCalled();
  });
});

// describe("to check that delete functionality",()=>{
// test("to check that delete delete button is clickable",()=>{



// })


// })

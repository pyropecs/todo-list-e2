
const fs = require("fs")
const path = require("path");
const { getByTestId,waitFor,screen,getByText } =require("@testing-library/dom");
const {default: userEvent} = require("@testing-library/user-event")
const app = require("@testing-library/jest-dom");
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const {run} = require("../index.js")
// const htmlFile = readFileSync(path.resolve(__dirname, "index.html"));
// const jsDom = new JSDOM(htmlFile, {
//   runScripts: "dangerously",
// });
// const document = jsDom.window.document;
// global.document = document;

describe("to test that input and button html are present", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    
  });
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

describe("to test the input validation", () => {
  beforeEach(()=>{
    run()
  })
  test("input validation",async () => {
    // const input = document.querySelector("#text-input");
    const error = document.querySelector("#input-error")
    const submitButton = document.querySelector("#save-btn-id");
    // input.value = "";
    // // const inputEvent =
    // submitButton.dispatchEvent(new jsDom.window.MouseEvent("click"))
    // submitButton.click()
    // expect(input.value).toBe("");
  const input = getByTestId(document,"input-task")
   
    const user = userEvent.setup()
   
    await user.type(input, 'good');
    expect(input).toHaveValue('good');

   user.dblClick(submitButton)
   await waitFor(()=>{
    const container = document.querySelector('.todo-card')
    
    expect(getByText(container,"good")).toBeInTheDocument()
    })



  });


});

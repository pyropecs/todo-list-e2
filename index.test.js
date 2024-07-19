const { readFileSync } = require("fs");
const { JSDOM } = require("jsdom");
const path = require("path");


const htmlFile = readFileSync(path.resolve(__dirname,"index.html")) 
const jsDom = new JSDOM(htmlFile,{
  runScripts:"dangerously"
});
const document = jsDom.window.document
global.document = document

describe("to test that input and button html are present", () => {
  test("to check that input and button element wrapped in a form",()=>{
    const formElement = document.querySelector("#submit-form")
    const formChilds = Array.from(formElement.children)
    const formChildsId = formChilds.map((formChild)=>{
      return formChild.getAttribute("id")
    })
    expect(formChildsId).toStrictEqual(["text-input","cancel-btn","save-btn-id"])
  })


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
  test("test input field has class todo-textfield",()=>{
    const input = document.querySelector("#text-input")
    const inputClass = input.classList.contains("todo-textfield")
    expect(inputClass).toBeTruthy()
  })
  test("test input field autocomplete is off",()=>{
    const input = document.querySelector("#text-input");
    const autocomplete = input.getAttribute("autocomplete")
    expect(autocomplete).toBe("off")
  })

  test("to test input field is present", () => {
    const input = document.querySelector("#text-input");
    expect(input).not.toBeNull();
  });

  test("to test that input field has name attribute",()=>{
    const input = document.querySelector("#text-input")
    const inputName = input.getAttribute("name")
    expect(inputName).toBe("input")
  })
  test("to test that input field has type attribute equal to input",()=>{
    const input = document.querySelector("#text-input")
    const inputName = input.getAttribute("type")
    expect(inputName).toBe("text");
  })

  test("to test that add button is present", () => {
    const button = document.querySelector("#save-btn-id");

    expect(button).not.toBeNull();
  });

  test("to test that Add content is displayed on that button", () => {
    const button = document.querySelector("#save-btn-id");
    const buttonContent = button.textContent;
    expect(buttonContent).toBe("Add");
  });
  
test("to test add button have its btn class",()=>{
  const button = document.querySelector("#save-btn-id");
  const buttonClass = button.classList.contains("btn")
  expect(buttonClass).toBeTruthy();

})

test("to test that title attribute is present in the add button",()=>{
  const button = document.querySelector("#save-btn-id");
  const titleAttributeButton = button.getAttribute("title")
  expect(titleAttributeButton).toBe("Add the task")


})
test("to test that add button has type submit ",()=>{
  const button = document.querySelector("#save-btn-id");
  const titleAttributeButton = button.getAttribute("type")
  expect(titleAttributeButton).toBe("submit")



})

});

describe("to test that task status tabs elements are present",()=>{
  test("switch tab wrapped by form elements",()=>{
    const radioButtons = document.querySelector("#radio-buttons")
    const radioButtonsChilds = radioButtons.childElementCount;
    expect(radioButtonsChilds).toBe(6)

  })

})

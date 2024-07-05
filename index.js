const tasks = [];
const task = {
    id:1,
    task_name:"sample",
    status:"completed ",
    created_at:Date.now(),
    updated_at:0
}

const form = document.querySelector("#submit-form")

form.addEventListener("submit",(e)=>{
    const input = document.querySelector("#text-input")
    e.preventDefault()
    let inputValue = e.target.input.value
   const todoCardNode =  createToDo(inputValue)
    
   tasks.push(todoCardNode)
  input.value =""
renderTasks()
}) 


// })
// <div class="todo-card">
// <p class="task-name">
//   asdaasdaadaddasdsaassadsaasdasd
//   d sadadadsadsadsaadsad
// </p>
// <div class="btn-group">
//   <button class="task-btn edit">Edit</button>
//   <button class="task-btn completed">Completed</button>
//   <button class="task-btn delete">Delete</button>
// </div>
// </div>
function renderTasks(){
   
    const todoList = document.querySelector('.todo-list')
    tasks.forEach((taskNode)=>{
      
        todoList.append(taskNode)
    })
}
function createToDo(inputValue){

const todoCard = document.createElement('div')
todoCard.classList.add('todo-card')
const p = document.createElement('p');
p.classList.add('task-name')
p.innerText = inputValue;
todoCard.append(p)
const btnGroup = document.createElement('div');
btnGroup.classList.add("btn-group")
const editButton = document.createElement('button');
editButton.classList.add("task-btn",'edit')
editButton.innerText = "Edit"
const completeButton = document.createElement('button');
completeButton.classList.add("task-btn",'completed')
completeButton.innerText = "Completed"
const deleteButton = document.createElement('button')
deleteButton.classList.add('task-btn','delete');
deleteButton.setAttribute("id","delete")
deleteButton.addEventListener('click',deleteTasks)
deleteButton.innerText = "Delete"
btnGroup.append(editButton,completeButton,deleteButton)
todoCard.append(btnGroup)
return todoCard
}

function deleteTasks(e){
   const btnGroup = e.target.parentNode
   const  taskCard  = btnGroup.parentNode

}
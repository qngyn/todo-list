import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-33b20-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const todoListDB = ref(database, "todo")


const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const todoListEl = document.getElementById("todo-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    if (inputValue.length > 0){
        push(todoListDB, inputValue) 
        clearInput()
    }
    
})

function displayTodoList(item) {
    let itemID = item[0]
    let itemValue = item[1]
    const date = new Date().toUTCString().slice(5, 16);
    
    // todoListEl.innerHTML += `<li> ${date}:  ${inputValue} </li>`

    let newEl = document.createElement("li")

    newEl.addEventListener("dblclick", function() {
        let idFromDB = ref(database, `todo/${itemID}`)
        remove(idFromDB)
    })
    newEl.textContent = date + ": " + itemValue
    todoListEl.append(newEl)
}

function clearInput(inputValue){
    inputFieldEl.value = ""
}

function clearTodoList() {
    todoListEl.innerHTML = ""
}

onValue(todoListDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemArray = Object.entries(snapshot.val())

        clearTodoList()

        for (let i = 0; i < itemArray.length; i++) {
            let currentItem = itemArray[i]
            displayTodoList(currentItem)
        }
    } else {
        todoListEl.innerHTML = "Nothing left! You're done" 
    }
})

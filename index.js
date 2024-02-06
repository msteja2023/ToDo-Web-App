const firebaseConfig = {
    apiKey: "AIzaSyBOKm1XcCJXkQoUl8SYsv8V4j36gi-4Zlw",
    authDomain: "transactions-aaa00.firebaseapp.com",
    projectId: "transactions-aaa00",
    storageBucket: "transactions-aaa00.appspot.com",
    messagingSenderId: "457514132328",
    appId: "1:457514132328:web:8b72e1d6685432003a6cdd",
    measurementId: "G-553EM034E6"
  };

firebase.initializeApp(firebaseConfig);


var firestore = firebase.firestore();

let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");

function getTodoListFromFirestore() {
  return new Promise((resolve, reject) => {
    firestore.collection("todos").get()
      .then(querySnapshot => {
        const todoList = [];
        querySnapshot.forEach(doc => {
          todoList.push(doc.data());
        });
        resolve(todoList);
      })
      .catch(error => {
        console.error("Error fetching todo list:", error);
        reject(error);
      });
  });
}

getTodoListFromFirestore().then(todoList => {
  todoList.forEach(todo => createAndAppendTodo(todo));
});

function saveTodoListToFirestore(todoList) {
  todoList.forEach(todo => {
    firestore.collection("todos").add(todo);
  });
}

function onAddTodo() {
  let userInputElement = document.getElementById("todoUserInput");
  let userInputValue = userInputElement.value;

  if (userInputValue === "") {
    alert("Enter Valid Text");
    return;
  }

  let newTodo = {
    text: userInputValue,
    isChecked: false
  };
  createAndAppendTodo(newTodo);
  firestore.collection("todos").add(newTodo);
  userInputElement.value = "";
}

addTodoButton.onclick = function() {
  onAddTodo();
};

function onTodoStatusChange(todoId, isChecked) {
  firestore.collection("todos").doc(todoId).update({
    isChecked: isChecked
  });
}

function onDeleteTodo(todoId) {
  firestore.collection("todos").doc(todoId).delete();
}

function createAndAppendTodo(todo) {
  let todoId = todo.text + "_" + Date.now();

  let todoElement = document.createElement("li");
  todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
  todoElement.id = todoId;
  todoItemsContainer.appendChild(todoElement);

  let inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.checked = todo.isChecked;

  inputElement.onchange = function () {
    onTodoStatusChange(todoId, inputElement.checked);
  };

  inputElement.classList.add("checkbox-input");
  todoElement.appendChild(inputElement);

  let labelElement = document.createElement("label");
  labelElement.classList.add("checkbox-label");
  labelElement.textContent = todo.text;
  if (todo.isChecked) {
    labelElement.classList.add("checked");
  }
  todoElement.appendChild(labelElement);

  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");

  deleteIcon.onclick = function () {
    onDeleteTodo(todoId);
    todoItemsContainer.removeChild(todoElement);
  };

  todoElement.appendChild(deleteIcon);
}

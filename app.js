const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority-select');
const todoListUL = document.getElementById('todo-list');

let allTodos = getTodos();
updateTodolist();

todoForm.addEventListener('submit', function(e){
    e.preventDefault();
    addTodo();
})

function addTodo(){
    const todoText = todoInput.value.trim();
    const priority = prioritySelect.value;
    if (todoText.length > 0) {
        allTodos.push({
            text: todoText,
            priority: priority,
            completed: false
        });
        updateTodolist();
        saveTodos();
        todoInput.value = "";
    }
}

function updateTodolist() {
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex)=> {
        const todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    })
}

function createTodoItem(todo, todoIndex) {
    const todoId = "todo-"+todoIndex;
    const todoText = typeof todo === 'string' ? todo : todo.text;
    const todoPriority = typeof todo === 'string' ? 'medium' : todo.priority;
    const isCompleted = typeof todo === 'string' ? false : todo.completed;
    
    const todoLI = document.createElement("li");
    todoLI.className = `todo priority-${todoPriority}`;
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}" ${isCompleted ? 'checked' : ''}>
        <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
        </label>
        <label for="${todoId}" class="todo-text">
            ${todoText}
        </label>
        <button class="delete-button">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </button>
        `
        
    const checkbox = todoLI.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
        if (typeof allTodos[todoIndex] === 'object') {
            allTodos[todoIndex].completed = checkbox.checked;
            saveTodos();
        }
    });
    
    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", ()=> {
        deleteTodoItem(todoIndex);
    })

    return todoLI;
}

function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i)=> i !== todoIndex);
    saveTodos();
    updateTodolist();
}

function saveTodos(){
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson);
}

function getTodos(){
    const todos = localStorage.getItem("todos") || "[]";
    const parsedTodos = JSON.parse(todos);
    // Migrate old string-based todos to object format
    return parsedTodos.map(todo => {
        if (typeof todo === 'string') {
            return {
                text: todo,
                priority: 'medium',
                completed: false
            };
        }
        return todo;
    });
}
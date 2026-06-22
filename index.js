const addBtn = document.getElementById("addBtn");
let container = document.getElementById("tasks-container");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentTask = null;
let pendingTasks;
let completedTasks;
// -------------- Load All Tasks from localStorage ----------------
function loadTasks(tasksToLoad) {
    document.getElementById('total-tasks').textContent = tasks.length;
    pendingTasks = tasks.filter(task => task.status === 'pending').length;
     completedTasks = tasks.filter(task => task.status === 'completed').length;
    document.getElementById('pending-tasks').textContent = pendingTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    if(tasksToLoad.length === 0){
        container.innerHTML = `<div class="empty-state">
  📭 No tasks found<br>
  <small>Create your first task to get started</small>
</div>`;
        return;
    }

    tasksToLoad.forEach(task => {
        container.innerHTML += `
        <div class="task-card">
            <div>
                <h3>${task.text}</h3>
                <span class="${task.priority}">
                    ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
            </div>

            <div class="actions">
                <input type="hidden" class="taskId" value="${task.id}">
                <i class="bi bi-pencil-square edit-icon"
                   data-bs-toggle="modal"
                   data-bs-target="#editTaskModal"></i>

                <i class="bi bi-trash delete-icon"></i>
                <!-- <i class="bi bi-check-circle-fill complete-icon"></i> -->
                <i class="bi ${task.status === 'completed' ? 'bi-check-circle-fill' : 'bi-circle'} complete-icon"></i>
            </div>
        </div>`;
    });
}
// -----------------Add Task-----------------
addBtn.addEventListener("click", addTask);
function addTask() {
    const taskInput = document.getElementById('todo-input');
    const prioritySelect = document.getElementById('priority-select');
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (!taskText) return;

    document.querySelector(".empty-state")?.remove();
    // Check if task already exists

    const taskExists = tasks.some(
        task => task.text.toLowerCase() === taskText.toLowerCase()
    );

    if (taskExists) {
        document.getElementById("msg").textContent =
            "Task already exists!";
        document.getElementById("msg").style.color = "red";
        return;
    }
    const newTaskId = Date.now().toString();
    const newTask = { id: newTaskId, text: taskText, priority: priority, status: 'pending' };
    tasks.push(newTask);
    //    Display task in the container
    
    container.innerHTML += `
    <div class="task-card">
        <div>
            <h3>${taskText}</h3>
            <span class="${priority}">
                ${priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
        </div>

        <div class="actions">
        <input type="hidden" class="taskId" value="${newTaskId}">
            <i class="bi bi-pencil-square edit-icon"
               data-bs-toggle="modal"
               data-bs-target="#editTaskModal"></i>

            <i class="bi bi-trash delete-icon"></i>
            <!-- <i class="bi bi-check-circle-fill complete-icon"></i> -->
            <i class="bi bi-circle complete-icon"></i>
        </div>
    </div>`;

    // Save tasks to localStorage
   
    localStorage.setItem("tasks", JSON.stringify(tasks));
    pendingTasks = tasks.filter(task => task.status === 'pending').length;
    completedTasks = tasks.filter(task => task.status === 'completed').length;
    document.getElementById('total-tasks').textContent = tasks.length;

    document.getElementById('pending-tasks').textContent = pendingTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    taskInput.value = '';

    // alert("Task has been added successfully!");
    document.getElementById("msg").textContent = "Task has been added successfully!";
    document.getElementById("msg").style.color = "green";
}

// ---------------------------Edit Task Modal---------------------------
const editInput = document.getElementById("editInput");
const saveBtn = document.getElementById("saveBtn");


container.addEventListener("click", (e) => {
    const target = e.target;
    // console.log(target);
    if (target.classList.contains("edit-icon")) {
        
        currentTask = target.closest(".task-card");
        let taskId = currentTask.querySelector(".taskId").value;
        const task = tasks.find(t => t.id === taskId);
        const taskTitle = currentTask.querySelector("h3").textContent;
         document.getElementById("editPrioritySelect").value = task.priority;
        editInput.value = taskTitle;
        document.querySelector(
            `input[name="action"][value="${task.status}"]`
        ).checked = true;
        
        document.querySelector(".taskHiddenId").value = taskId;
        // console.log(taskId.value);
    }
});

//------------------- Update task onclick save button 
saveBtn.addEventListener("click", (e) => {
    let editTaskId = document.querySelector(".taskHiddenId").value;
    // Check if task already exists
    const taskExists = tasks.some(
        task => task.text.toLowerCase() === editInput.value.toLowerCase() && task.id !== editTaskId
    );

    if (taskExists) {
        document.getElementById("msg").textContent =
            "Task already exists, can not be updated";
        document.getElementById("msg").style.color = "red";
        return;
    }
    let status = document.querySelector('input[name="action"]:checked').value;

    tasks = tasks.map(task => {
    if (task.id === editTaskId) {
        return {
            ...task,
            text: editInput.value,
            priority: document.getElementById("editPrioritySelect").value,
            status: status
        };
    }
    return task;
});

localStorage.setItem("tasks", JSON.stringify(tasks));
// --------Updating number of Total tasks, pending tasks and completed task
    pendingTasks = tasks.filter(task => task.status === 'pending').length;
     completedTasks = tasks.filter(task => task.status === 'completed').length;
     document.getElementById('total-tasks').textContent = tasks.length;
    document.getElementById('pending-tasks').textContent = pendingTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
// -----------------------------------------------------------------------------
    currentTask.querySelector("h3").textContent = editInput.value;
    currentTask.querySelector("span").className = document.getElementById("editPrioritySelect").value;
    const action = document.getElementsByName("action");
    currentTask.querySelectorAll("i")[2].className = action[0].checked ? "bi bi-circle complete-icon" : "bi bi-check-circle-fill complete-icon";

    document.getElementById("msg").textContent = "Task has been updated successfully!";
    document.getElementById("msg").style.color = "blue";
});

// -------------Delete Task from localStorage and DOM----------------------
container.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("delete-icon")) {

        const taskCard = target.closest(".task-card");
        const taskId = taskCard.querySelector(".taskId").value;
        // Remove task from localStorage
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        document.getElementById('total-tasks').textContent = tasks.length;
        pendingTasks = tasks.filter(task => task.status === 'pending').length;
        completedTasks = tasks.filter(task => task.status === 'completed').length;
        document.getElementById('pending-tasks').textContent = pendingTasks;
        document.getElementById('completed-tasks').textContent = completedTasks;
        // Remove task from DOM 
        taskCard.remove();
        document.getElementById("msg").textContent = "Task has been deleted successfully!";
        document.getElementById("msg").style.color = "red";
    }

})

function currentDate(){
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('today-date').textContent = date.toLocaleDateString(undefined, options);
}

function updateHeaderStats() {

    document.getElementById("h-total").textContent = tasks.length;
    document.getElementById("h-pending").textContent =
        tasks.filter(t => t.status === "pending").length;

    document.getElementById("h-completed").textContent =
        tasks.filter(t => t.status === "completed").length;
}

function setGreeting() {
    const hour = new Date().getHours();
    let greet = "Good Morning";

    if (hour >= 12 && hour < 17) greet = "Good Afternoon";
    else if (hour >= 17) greet = "Good Evening";

    document.getElementById("greeting").textContent = `👋 ${greet}, User`;
}

function filterTasks(status) {
     container.innerHTML = '';
    if(status=='all'){
        console.log(tasks);
        loadTasks(tasks);
    }
    else if(status === 'pending' || status === 'completed') {
        const filteredTasks = tasks.filter(task => task.status === status);
          
        loadTasks(filteredTasks)
    }
}
document.getElementById('all-btn').addEventListener('click', (e) => {
    filterTasks('all');
    e.target.classList.add('active');
    document.getElementById('pending-btn').classList.remove('active');
    document.getElementById('completed-btn').classList.remove('active');
});
document.getElementById('pending-btn').addEventListener('click', (e) => {
    filterTasks('pending');
    e.target.classList.add('active');
    document.getElementById('all-btn').classList.remove('active');
    document.getElementById('completed-btn').classList.remove('active');
});
document.getElementById('completed-btn').addEventListener('click', (e) => {
    filterTasks('completed');
    e.target.classList.add('active');
    document.getElementById('all-btn').classList.remove('active');
    document.getElementById('pending-btn').classList.remove('active');
});
function searchTasks(inputValue){
    const searchedTasks = tasks.filter(task => task.text.toLowerCase().includes(inputValue.toLowerCase()));
    container.innerHTML = '';
    loadTasks(searchedTasks);
}
document.getElementById('search-input')?.addEventListener('input', (e) => {
    searchTasks(e.target.value);
});
loadTasks(tasks);
currentDate();
updateHeaderStats();


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
    let title = document.getElementById("taskTitle").value;
    let date = document.getElementById("dueDate").value;
    let priority = document.getElementById("priority").value;
    let error = document.getElementById("error");
    
    if (title == "") {
    error.innerHTML = "Task title is required!";
    return;
  }

  if (date == "") {
    error.innerHTML = "Due date is required!";
    return;
  }
  error.innerHTML = "";

  let task = {
    title: title,
    date: date,
    priority: priority,
    completed: false
  };

  tasks.push(task);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById("taskTitle").value = "";
  document.getElementById("dueDate").value = "";
  displayTasks();

}

function displayTasks() {
  let list = document.getElementById("taskList");
  if (!list) {
    return;
  }

  let search = document.getElementById("search").value.toLowerCase();
  list.innerHTML = "";
  let number = 1;
  for (let i = 0; i < tasks.length; i++) {
    if (!tasks[i].title.toLowerCase().includes(search)) {
      continue;
    }

    let status = tasks[i].completed ? "Completed" : "Pending";
    let row = `
      <tr>
        <td>${number}</td>
        <td class="${tasks[i].completed ? 'completed' : ''}">
          ${tasks[i].title}
        </td>
        <td>${tasks[i].date}</td>
        <td>
          <span class="badge badge-${tasks[i].priority.toLowerCase()}">
            ${tasks[i].priority}
          </span>
        </td>
        <td>${status}</td>
        <td>
          <button class="btn btn-success btn-sm"
              onclick="markDone(${i})"> ✓
          </button>
          <button class="btn btn-primary btn-sm"
              onclick="editTask(${i})">

            ✎
          </button>
          <button class="btn btn-danger btn-sm"
              onclick="deleteTask(${i})">
            🗑
          </button>
        </td>
      </tr>
    `;

    list.innerHTML += row;
    number++;
  }

  updateCounter();

}

function markDone(index) {
  tasks[index].completed = true;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();

}

function deleteTask(index) {
    if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
  }

}

function editTask(index) {
  let newTitle = prompt("Enter new task title:", tasks[index].title);
  if (newTitle != null && newTitle != "") {
    tasks[index].title = newTitle;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
  }

}

function clearAll() {
  if (confirm("Delete all tasks?")) {
    tasks = [];
    localStorage.removeItem("tasks");
    displayTasks();
  }

}

function updateCounter() {
  let total = tasks.length;
  let completed = 0;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].completed) {
      completed++;
    }

  }

  let pending = total - completed;
  document.getElementById("total").innerHTML = total;
  document.getElementById("completed").innerHTML = completed;
  document.getElementById("pending").innerHTML = pending;

}

displayTasks();

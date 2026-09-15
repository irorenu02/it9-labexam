const STORAGE_KEY = "tasks";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY));

if (!Array.isArray(tasks)) {
  tasks = [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask() {
  let titleInput = document.getElementById("taskTitle");
  let dateInput = document.getElementById("dueDate");
  let priorityInput = document.getElementById("priority");
  let error = document.getElementById("error");

  if (!titleInput || !dateInput || !priorityInput || !error) {
    return;
  }

  let title = titleInput.value.trim();
  let date = dateInput.value;
  let priority = priorityInput.value;

  if (title === "") {
    error.innerHTML = "Task title is required!";
    return;
  }

  if (date === "") {
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
  saveTasks();

  titleInput.value = "";
  dateInput.value = "";
  priorityInput.value = "Low";
  displayTasks();
}

function displayTasks() {
  let list = document.getElementById("taskList");
  if (!list) {
    return;
  }

  const searchInput = document.getElementById("search");
  const search = searchInput ? searchInput.value.trim().toLowerCase() : "";

  list.innerHTML = "";

  let filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search)
  );

  if (filteredTasks.length === 0) {
    list.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted py-4">No tasks found.</td>
      </tr>
    `;
    updateCounter();
    return;
  }

  filteredTasks.forEach((task, index) => {
    let actualIndex = tasks.findIndex((item) => item === task);
    let status = task.completed ? "Completed" : "Pending";

    list.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td class="${task.completed ? 'completed' : ''}">${task.title}</td>
        <td>${task.date}</td>
        <td>
          <span class="badge badge-${task.priority.toLowerCase()}">${task.priority}</span>
        </td>
        <td>${status}</td>
        <td>
          <button class="btn btn-success btn-sm" onclick="markDone(${actualIndex})">✓</button>
          <button class="btn btn-primary btn-sm" onclick="editTask(${actualIndex})">✎</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTask(${actualIndex})">🗑</button>
        </td>
      </tr>
    `;
  });

  updateCounter();
}

function markDone(index) {
  if (!tasks[index]) {
    return;
  }

  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  displayTasks();
}

function deleteTask(index) {
  if (!tasks[index]) {
    return;
  }

  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
  }
}

function editTask(index) {
  if (!tasks[index]) {
    return;
  }

  let newTitle = prompt("Enter new task title:", tasks[index].title);
  if (newTitle !== null && newTitle.trim() !== "") {
    tasks[index].title = newTitle.trim();
    saveTasks();
    displayTasks();
  }
}

function clearAll() {
  if (confirm("Delete all tasks?")) {
    tasks = [];
    localStorage.removeItem(STORAGE_KEY);
    displayTasks();
  }
}

function updateCounter() {
  let total = tasks.length;
  let completed = tasks.filter((task) => task.completed).length;
  let pending = total - completed;

  let totalEl = document.getElementById("total");
  let completedEl = document.getElementById("completed");
  let pendingEl = document.getElementById("pending");

  if (totalEl) totalEl.innerHTML = total;
  if (completedEl) completedEl.innerHTML = completed;
  if (pendingEl) pendingEl.innerHTML = pending;
}

displayTasks();

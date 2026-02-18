const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const percentageText = document.getElementById("percentageText");
const celebration = document.getElementById("celebration");

loadTasks();

// Add task
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

// Clear all tasks
clearAllBtn.addEventListener("click", () => {
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
  updateProgress();
});

function addTask(text = null, completed = false) {
  const taskText = text || taskInput.value.trim();
  if (!taskText) return;

  const li = document.createElement("li");

  const left = document.createElement("div");
  left.className = "task-left";

  const span = document.createElement("span");
  span.textContent = taskText;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = completed;
  checkbox.addEventListener("change", () => {
    updateProgress();
    saveTasks();
  });

  left.append(span, checkbox);

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "-";
  removeBtn.className = "remove-btn";
  removeBtn.onclick = () => {
    li.remove();
    updateProgress();
    saveTasks();
  };

  li.append(left, removeBtn);
  taskList.appendChild(li);

  taskInput.value = "";
  updateProgress();
  saveTasks();
}

// Save tasks
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.querySelector("input").checked
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks after refresh
function loadTasks() {
  const stored = JSON.parse(localStorage.getItem("tasks")) || [];
  stored.forEach(task => addTask(task.text, task.completed));
}

// Progress bar
function updateProgress() {
  const checkboxes = taskList.querySelectorAll(".task-checkbox");
  const total = checkboxes.length;
  const completed = [...checkboxes].filter(cb => cb.checked).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressBar.style.width = percent + "%";
  percentageText.textContent = percent + "% Complete";

  if (percent === 100 && total > 0) {
    celebration.style.display = "block";
  } else {
    celebration.style.display = "none";
  }
}

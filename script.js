const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const percentageText = document.getElementById("percentageText");
const celebration = document.getElementById("celebration");

const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

let confetti = [];
let animationId = null;
let confettiRunning = false;
let confettiTimeout = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

loadTasks();

/* ⭐ FIX HERE */
addBtn.addEventListener("click", () => addTask());

taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

clearAllBtn.addEventListener("click", () => {
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
  updateProgress();
  stopConfetti();
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

function loadTasks() {
  const stored = JSON.parse(localStorage.getItem("tasks")) || [];
  stored.forEach(task => addTask(task.text, task.completed));
}

function updateProgress() {
  const checkboxes = taskList.querySelectorAll(".task-checkbox");
  const total = checkboxes.length;
  const completed = [...checkboxes].filter(cb => cb.checked).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressBar.style.width = percent + "%";
  percentageText.textContent = percent + "% Complete";

  if (percent <= 25) progressBar.style.backgroundColor = "white";
  else if (percent <= 50) progressBar.style.backgroundColor = "orange";
  else if (percent <= 75) progressBar.style.backgroundColor = "blue";
  else if (percent < 100) progressBar.style.backgroundColor = "yellow";
  else progressBar.style.backgroundColor = "green";

  if (percent === 100 && total > 0) {
    celebration.style.display = "block";
    startConfetti();
  } else {
    celebration.style.display = "none";
    stopConfetti();
  }
}

/* CONFETTI */

function startConfetti() {
  if (confettiRunning) return;

  confettiRunning = true;

  confetti = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 6 + 2,
    d: Math.random() * 5 + 2,
    color: `hsl(${Math.random() * 360},100%,50%)`
  }));

  animateConfetti();
  confettiTimeout = setTimeout(stopConfetti, 5000);
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach(c => {
    ctx.beginPath();
    ctx.fillStyle = c.color;
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();

    c.y += c.d;
    if (c.y > canvas.height) c.y = 0;
  });

  animationId = requestAnimationFrame(animateConfetti);
}

function stopConfetti() {
  confettiRunning = false;
  cancelAnimationFrame(animationId);
  clearTimeout(confettiTimeout);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

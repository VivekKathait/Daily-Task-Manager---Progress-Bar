const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const percentageText = document.getElementById("percentageText");
const celebration = document.getElementById("celebration");

const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

let confetti = [];
let animation = null;
let confettiTimeout = null;
let confettiRunning = false;

// Resize canvas properly
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Event listeners
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const li = document.createElement("li");

  const left = document.createElement("div");
  left.className = "task-left";

  const span = document.createElement("span");
  span.textContent = text;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.addEventListener("change", updateProgress);

  left.append(span, checkbox);

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "-";
  removeBtn.className = "remove-btn";
  removeBtn.onclick = () => {
    li.remove();
    updateProgress();
  };

  li.append(left, removeBtn);
  taskList.appendChild(li);

  taskInput.value = "";
  updateProgress();
}

function updateProgress() {
  const checkboxes = taskList.querySelectorAll(".task-checkbox");
  const total = checkboxes.length;
  const completed = [...checkboxes].filter(cb => cb.checked).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressBar.style.width = percent + "%";
  percentageText.textContent = percent + "% Complete";

  // Progress bar colors
  if (percent <= 25) progressBar.style.background = "white";
  else if (percent <= 50) progressBar.style.background = "#3b82f6";
  else if (percent <= 75) progressBar.style.background = "#f97316";
  else if (percent < 100) progressBar.style.background = "#facc15";
  else progressBar.style.background = "#22c55e";

  if (percent === 100 && total > 0) {
    celebration.style.display = "block";
    startConfetti();
  } else {
    celebration.style.display = "none";
    stopConfetti();
  }
}

/* Confetti Animation */
function startConfetti() {
  if (confettiRunning) return;

  confettiRunning = true;
  resizeCanvas();

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

  animation = requestAnimationFrame(animateConfetti);
}

function stopConfetti() {
  confettiRunning = false;

  if (animation) cancelAnimationFrame(animation);
  if (confettiTimeout) clearTimeout(confettiTimeout);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

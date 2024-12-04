const addTaskBtn = document.getElementById("addTaskBtn");
const draftBtn = document.getElementById("draftBtn");
const draftCount = document.getElementById("draftCount");
const draftSlider = document.getElementById("draftSlider");
const draftList = document.getElementById("draftList");
const closeSlider = document.getElementById("closeSlider");
const todoInput = document.getElementById("todoInput");
const pendingList = document.getElementById("pendingList");
const inProgressList = document.getElementById("inProgressList");
const doneList = document.getElementById("doneList");
const errorMsg = document.getElementById("errorMsg");

let draftTasks = [];

addTaskBtn.addEventListener("click", () => {
  const task = todoInput.value.trim();
  if (!task) {
    alert("Task cannot be empty!");
    return;
  }
  createTaskElement(task, "pending");
  todoInput.value = "";
});

draftBtn.addEventListener("click", () => {
  draftSlider.classList.toggle("open");
});

closeSlider.addEventListener("click", () => {
  draftSlider.classList.remove("open");
});

function createTaskElement(task, status) {
  const li = document.createElement("li");

  const taskContent = document.createElement("div");
  taskContent.textContent = task;
  li.appendChild(taskContent);

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "task-buttons";

  if (status !== "pending") {
    const backwardBtn = document.createElement("button");
    backwardBtn.textContent =
      status === "inProgress" ? "Move to Pending" : "Move to Progress";
    backwardBtn.addEventListener("click", () =>
      moveTask(li, status, "backward")
    );
    buttonsDiv.appendChild(backwardBtn);
  }
  if (status !== "done") {
    const forwardBtn = document.createElement("button");
    forwardBtn.textContent =
      status === "pending" ? "Move to Progress" : "Move to Done";
    forwardBtn.addEventListener("click", () => moveTask(li, status, "forward"));

    buttonsDiv.appendChild(forwardBtn);
  }

  const draftTaskBtn = document.createElement("button");
  draftTaskBtn.textContent = "Draft";
  draftTaskBtn.addEventListener("click", () => moveToDraft(task, li));

  buttonsDiv.appendChild(draftTaskBtn);

  li.appendChild(buttonsDiv);

  if (status === "pending") pendingList.appendChild(li);
  else if (status === "inProgress") inProgressList.appendChild(li);
  else if (status === "done") {
    li.classList.add("completed");
    doneList.appendChild(li);
  } else if (status === "draft") draftList.appendChild(li);
}

function moveTask(taskElement, currentStatus, direction) {
  taskElement.remove();
  const task = taskElement.firstChild.textContent;

  if (direction === "forward") {
    if (currentStatus === "pending") createTaskElement(task, "inProgress");
    else if (currentStatus === "inProgress") createTaskElement(task, "done");
    else if (currentStatus === "done") createTaskElement(task, "done");
  } else if (direction === "backward") {
    if (currentStatus === "inProgress") createTaskElement(task, "pending");
    else if (currentStatus === "done") createTaskElement(task, "inProgress");
    else if (currentStatus === "pending") createTaskElement(task, "pending");
  }
}

// Function to create draft-specific task elements with move buttons
function createDraftTaskElement(task) {
  const li = document.createElement("li");

  const taskContent = document.createElement("div");
  taskContent.textContent = task;
  li.appendChild(taskContent);

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "task-buttons";

  // Button to move to Pending
  const moveToPendingBtn = document.createElement("button");
  moveToPendingBtn.textContent = "Move to Pending";
  moveToPendingBtn.addEventListener("click", () => {
    draftTasks = draftTasks.filter((t) => t !== task);
    updateDraftCount();
    li.remove();
    createTaskElement(task, "pending");
  });
  buttonsDiv.appendChild(moveToPendingBtn);

  // Button to move to In Progress
  const moveToInProgressBtn = document.createElement("button");
  moveToInProgressBtn.textContent = "Move to Progress";
  moveToInProgressBtn.addEventListener("click", () => {
    draftTasks = draftTasks.filter((t) => t !== task);
    updateDraftCount();
    li.remove();
    createTaskElement(task, "inProgress");
  });
  buttonsDiv.appendChild(moveToInProgressBtn);

  li.appendChild(buttonsDiv);
  return li;
}

function moveToDraft(task, taskElement) {
  taskElement.remove();
  draftTasks.push(task);
  updateDraftCount();
  const draftTaskElement = createDraftTaskElement(task);
  draftList.appendChild(draftTaskElement);
}

function updateDraftCount() {
  draftCount.textContent = draftTasks.length;
}

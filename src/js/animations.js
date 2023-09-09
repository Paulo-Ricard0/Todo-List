const addTaskInput = document.getElementById("add_task_input");
const addTaskPlusButton = document.getElementById("add_task_plus");
const addTaskCircleButton = document.getElementById("add_task_circle");

const toggleOpacity = (element, opacity) => {
  element.style.opacity = opacity;
};

const toggleDisplay = (element, display) => {
  element.style.display = display;
};

// Lida com o foco do elemento de input
const handleInputFocus = () => {
  toggleOpacity(addTaskPlusButton, 0);
  toggleDisplay(addTaskCircleButton, "flex");
  toggleOpacity(addTaskCircleButton, 1);
};

// Lida com a perda de foco no elemento de input
const handleInputBlur = () => {
  toggleOpacity(addTaskCircleButton, 0);
  toggleOpacity(addTaskPlusButton, 1);
};

// Lida com o click no botão de adicionar tarefas
const circleButtonClick = () => {
  addTaskInput.blur();
  addTaskCircleButton.style.display = "none";
};

const plusButtonClick = () => {
  addTaskInput.focus();
};

// Eventos
addTaskInput.addEventListener("focus", handleInputFocus);
addTaskInput.addEventListener("blur", handleInputBlur);
addTaskPlusButton.addEventListener("click", plusButtonClick);
addTaskCircleButton.addEventListener("click", circleButtonClick);

// ANIMATIONS INPUT TASKS

const inputTask = document.getElementById("task_input");
const selectTaskButton = document.getElementById("circle_task");
const checkTaskButton = document.getElementById("circle_check_task");

const handleInputTaskFocus = () => {
  toggleOpacity(selectTaskButton, 0);
  toggleDisplay(checkTaskButton, "flex");
  toggleOpacity(checkTaskButton, 1);
};

const handleInputTaskBlur = () => {
  toggleOpacity(checkTaskButton, 0);
  toggleOpacity(selectTaskButton, 1);
};

const checkButtonClick = () => {
  inputTask.blur();
  checkTaskButton.style.display = "none";
};

const selectButtonClick = () => {
  inputTask.focus();
};

inputTask.addEventListener("focus", handleInputTaskFocus);
inputTask.addEventListener("blur", handleInputTaskBlur);
selectTaskButton.addEventListener("click", selectButtonClick);
checkTaskButton.addEventListener("click", checkButtonClick);

document.addEventListener("DOMContentLoaded", function () {
  class Todo {
    constructor(item, isCompleted = false) {
      this.item = item;
      this.isCompleted = isCompleted;
    }
  }

  const todos = [];

  const toggleOpacity = (element, opacity) => {
    element.style.opacity = opacity;
  };

  const toggleDisplay = (element, display) => {
    element.style.display = display;
  };

  const getItemInput = (index) => {
    return document.querySelector(`[data-index="${index}"]`);
  };

  const updateItemCount = () => {
    const itemsLeft = document.getElementById("items-left");
    const activeTodos = todos.filter((todo) => !todo.isCompleted);
    itemsLeft.textContent = activeTodos.length;
  };

  const renderTodoItem = (todo, index) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("card", "list_tasks");

    const taskContent = document.createElement("div");
    taskContent.classList.add("task_content");

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("disabled", "disabled");
    input.classList.add("task_input");
    input.setAttribute("name", "name");
    input.setAttribute("autocomplete", "none");
    input.setAttribute("data-index", index);
    input.value = todo.item;

    const actionsTasks = document.createElement("div");
    actionsTasks.classList.add("actions_tasks");

    const checkButton = document.createElement("button");
    checkButton.classList.add("task_button", "button_check");

    const selectTaskButton = document.createElement("i");
    selectTaskButton.classList.add("fa-regular", "fa-circle");
    selectTaskButton.id = "circle_task";
    selectTaskButton.addEventListener("click", () => {
      toggleOpacity(selectTaskButton, 0);
      toggleDisplay(checkTaskButton, "flex");
      toggleOpacity(checkTaskButton, 1);
      input.classList.toggle("check");
      toggleTodoItem(index);
      updateItemCount();
    });

    const checkTaskButton = document.createElement("i");
    checkTaskButton.classList.add("fa-regular", "fa-circle-check");
    checkTaskButton.id = "circle_check_task";
    checkTaskButton.addEventListener("click", () => {
      toggleOpacity(selectTaskButton, 1);
      toggleDisplay(checkTaskButton, "none");
      toggleOpacity(checkTaskButton, 0);
      input.classList.toggle("check");
      toggleTodoItem(index);
      updateItemCount();
    });

    const editDeleteButton = document.createElement("button");
    editDeleteButton.classList.add("task_button", "edit_delete_button");

    const editTaskButton = document.createElement("i");
    editTaskButton.classList.add("fa-regular", "fa-pen-to-square");
    editTaskButton.id = "edit_task";
    editTaskButton.addEventListener("click", () => {
      toggleOpacity(editTaskButton, 0);
      toggleDisplay(saveTaskButton, "flex");
      toggleOpacity(saveTaskButton, 1);
      input.removeAttribute("disabled");
      input.focus();
    });

    const saveTaskButton = document.createElement("i");
    saveTaskButton.classList.add("fa-solid", "fa-check");
    saveTaskButton.id = "save_task";
    saveTaskButton.addEventListener("click", () => {
      const updatedIndex = input.getAttribute("data-index");
      editTodoItem(updatedIndex);
      toggleOpacity(saveTaskButton, 0);
      toggleOpacity(editTaskButton, 1);
      toggleDisplay(saveTaskButton, "none");
      input.setAttribute("disabled", "disabled");
    });

    const deleteTaskButton = document.createElement("i");
    deleteTaskButton.classList.add("fa-regular", "fa-trash-can");
    deleteTaskButton.id = "delete_task";
    deleteTaskButton.addEventListener("click", () => {
      removeTodoItem(index);
    });

    checkButton.appendChild(selectTaskButton);
    checkButton.appendChild(checkTaskButton);

    editDeleteButton.appendChild(editTaskButton);
    editDeleteButton.appendChild(deleteTaskButton);
    editDeleteButton.appendChild(saveTaskButton);

    taskContent.appendChild(input);

    actionsTasks.appendChild(checkButton);
    actionsTasks.appendChild(editDeleteButton);

    todoItem.appendChild(taskContent);
    todoItem.appendChild(actionsTasks);

    if (todo.isCompleted) {
      input.classList.toggle("check");
      toggleOpacity(selectTaskButton, 0);
      toggleDisplay(checkTaskButton, "flex");
      toggleOpacity(checkTaskButton, 1);
    }

    return todoItem;
  };

  // Renderiza as tarefas na página
  const renderTodos = () => {
    const todosContainer = document.querySelector(".todos");
    todosContainer.innerHTML = "";

    todos.forEach((todo, index) => {
      const todoItem = renderTodoItem(todo, index);
      todosContainer.appendChild(todoItem);

      // Funcionalidade de arrastar e soltar
      if (window.matchMedia("(min-width: 768px)").matches) {
        todoItem.setAttribute("draggable", "true");

        todoItem.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", index);
          e.target.classList.add("dragging");
          const lists = document.querySelectorAll(".list_tasks:not(.dragging)");
          lists.forEach((item) => item.classList.add("not-dragging"));
        });

        todoItem.addEventListener("dragover", (e) => {
          e.preventDefault();
        });

        todoItem.addEventListener("drop", (e) => {
          e.preventDefault();
          const sourceIndex = e.dataTransfer.getData("text/plain");
          const destinationIndex = index;
          e.target.classList.remove("dragging");
          const lists = document.querySelectorAll(".list_tasks:not(.dragging)");
          lists.forEach((item) => item.classList.remove("not-dragging"));

          if (sourceIndex !== destinationIndex) {
            const temp = todos[sourceIndex];
            todos[sourceIndex] = todos[destinationIndex];
            todos[destinationIndex] = temp;
            renderTodos();
          }
        });
      }
    });
    updateItemCount();
  };

  const addTodoItem = (item) => {
    const todo = new Todo(item);
    todos.push(todo);
    renderTodos();
  };

  const removeTodoItem = (index) => {
    todos.splice(index, 1);
    renderTodos();
  };

  const editTodoItem = (index) => {
    const input = getItemInput(index);
    const newValue = input.value;
    todos[index].item = newValue;
    renderTodos();
  };

  const toggleTodoItem = (index) => {
    todos[index].isCompleted = !todos[index].isCompleted;
  };

  // Lida com o evento de adicionar tarefas
  const handleAddTask = () => {
    const input = document.getElementById("add_task_input");
    const newItem = input.value.trim();
    if (newItem !== "") {
      addTodoItem(newItem);
      input.value = "";
    }
  };

  // Eventos
  document
    .getElementById("add_task_button")
    .addEventListener("click", handleAddTask);

  document
    .getElementById("add_task_input")
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleAddTask();
      }
    });

  // Filtrar tarefas
  document.getElementById("filter_all").addEventListener("click", () => {
    renderTodos();
  });

  document.getElementById("filter_active").addEventListener("click", () => {
    const activeTodos = todos.filter((todo) => !todo.isCompleted);
    renderFilteredTodos(activeTodos);
  });

  document.getElementById("filter_completed").addEventListener("click", () => {
    const completedTodos = todos.filter((todo) => todo.isCompleted);
    renderFilteredTodos(completedTodos);
  });

  // Renderiza tarefas filtradas
  function renderFilteredTodos(filteredTodos) {
    const todosContainer = document.querySelector(".todos");
    todosContainer.innerHTML = "";

    filteredTodos.forEach((todo, index) => {
      const todoItem = renderTodoItem(todo, index);
      todosContainer.appendChild(todoItem);
    });
    updateItemCount();
  }

  // Limpa tarefas concluídas
  document.getElementById("clear_completed").addEventListener("click", () => {
    const completedIndexes = todos.reduce((indexes, todo, index) => {
      if (todo.isCompleted) {
        indexes.push(index);
      }
      return indexes;
    }, []);

    completedIndexes.reverse().forEach((index) => {
      removeTodoItem(index);
    });
  });

  // Filtro de tarefas
  document.getElementById("filter_input").addEventListener("input", () => {
    const FilterQuery = document
      .getElementById("filter_input")
      .value.trim()
      .toLowerCase();
    const filteredTodos = todos.filter((todo) =>
      todo.item.toLowerCase().includes(FilterQuery)
    );
    renderFilteredTodos(filteredTodos);
  });

  function initializePage() {
    renderTodos();
  }

  initializePage();
});

document.addEventListener("DOMContentLoaded", function () {
  class Todo {
    constructor(item, isCompleted = false) {
      this.item = item;
      this.isCompleted = isCompleted;
    }
  }

  const todos = [];

  function addTodoItem(item) {
    const todo = new Todo(item);
    todos.push(todo);
    renderTodos();
  }

  function removeTodoItem(index) {
    todos.splice(index, 1);
    renderTodos();
  }

  function editTodoItem(index) {
    const input = document.querySelector(`[data-index="${index}"]`);
    const newValue = input.value;
    todos[index].item = newValue;
    renderTodos();
  }

  function toggleTodoItem(index) {
    todos[index].isCompleted = !todos[index].isCompleted;
    // renderTodos();
  }

  const toggleOpacity = (element, opacity) => {
    element.style.opacity = opacity;
  };

  const toggleDisplay = (element, display) => {
    element.style.display = display;
  };

  // Função para renderizar as tarefas na página
  function renderTodos() {
    const todosContainer = document.querySelector(".todos");
    todosContainer.innerHTML = "";

    todos.forEach((todo, index) => {
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
        const itemsLeft = document.getElementById("items-left");
        const activeTodos = todos.filter((todo) => !todo.isCompleted);
        itemsLeft.textContent = activeTodos.length;
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
        const itemsLeft = document.getElementById("items-left");
        const activeTodos = todos.filter((todo) => !todo.isCompleted);
        itemsLeft.textContent = activeTodos.length;
      });

      const editDeleteButton = document.createElement("button");
      editDeleteButton.classList.add("task_button", "edit_delete_button");

      const editTaskButton = document.createElement("i");
      editTaskButton.classList.add("fa-regular", "fa-pen-to-square");
      editTaskButton.id = "edit_task";
      editTaskButton.addEventListener("click", () => {
        toggleOpacity(editTaskButton, 0);
        toggleDisplay(SaveTaskButton, "flex");
        toggleOpacity(SaveTaskButton, 1);
        input.removeAttribute("disabled");
        input.focus();
      });

      const SaveTaskButton = document.createElement("i");
      SaveTaskButton.classList.add("fa-solid", "fa-check");
      SaveTaskButton.id = "save_task";
      SaveTaskButton.addEventListener("click", () => {
        const index = input.getAttribute("data-index");
        editTodoItem(index);
        toggleOpacity(SaveTaskButton, 0);
        toggleOpacity(editTaskButton, 1);
        toggleDisplay(SaveTaskButton, "none");
        input.setAttribute("disabled", "disabled");
      });

      const deleteTaskButton = document.createElement("i");
      deleteTaskButton.classList.add("fa-regular", "fa-trash-can");
      deleteTaskButton.id = "delete_task";
      deleteTaskButton.addEventListener("click", () => {
        removeTodoItem(index);
      });

      // Montando a estrutura do HTML
      checkButton.appendChild(selectTaskButton);
      checkButton.appendChild(checkTaskButton);

      editDeleteButton.appendChild(editTaskButton);
      editDeleteButton.appendChild(deleteTaskButton);
      editDeleteButton.appendChild(SaveTaskButton);

      taskContent.appendChild(input);

      actionsTasks.appendChild(checkButton);
      actionsTasks.appendChild(editDeleteButton);

      todoItem.appendChild(taskContent);
      todoItem.appendChild(actionsTasks);

      todosContainer.appendChild(todoItem);

      if (todo.isCompleted) {
        input.classList.toggle("check");
        toggleOpacity(selectTaskButton, 0);
        toggleDisplay(checkTaskButton, "flex");
        toggleOpacity(checkTaskButton, 1);
      }

      if (window.matchMedia("(min-width: 768px)").matches) {
        todoItem.setAttribute("draggable", "true");

        todoItem.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", index); // Define os dados a serem arrastados
          e.target.classList.add("dragging");
          const lists = document.querySelectorAll(".list_tasks:not(.dragging)");
          lists.forEach((item) => item.classList.add("not-dragging"));
        });

        todoItem.addEventListener("dragover", (e) => {
          e.preventDefault(); // Impede o comportamento padrão (necessário para permitir soltar)
        });

        todoItem.addEventListener("drop", (e) => {
          e.preventDefault();
          const sourceIndex = e.dataTransfer.getData("text/plain");
          const destinationIndex = index;
          e.target.classList.remove("dragging");
          const lists = document.querySelectorAll(".list_tasks:not(.dragging)");
          lists.forEach((item) => item.classList.remove("not-dragging"));

          // Realiza a reordenação da lista
          if (sourceIndex !== destinationIndex) {
            const temp = todos[sourceIndex];
            todos[sourceIndex] = todos[destinationIndex];
            todos[destinationIndex] = temp;

            renderTodos();
          }
        });
      }
    });

    const itemsLeft = document.getElementById("items-left");
    const activeTodos = todos.filter((todo) => !todo.isCompleted);
    itemsLeft.textContent = activeTodos.length;
  }

  // Função para lidar com o evento de adicionar tarefa
  function handleAddTask() {
    const input = document.getElementById("add_task_input");
    const newItem = input.value.trim();
    if (newItem !== "") {
      addTodoItem(newItem);
      input.value = "";
    }
  }

  // Evento para adicionar tarefa quando o botão for clicado
  document
    .getElementById("add_task_button")
    .addEventListener("click", handleAddTask);

  // Evento para adicionar tarefa quando a tecla "Enter" for pressionada no input
  document
    .getElementById("add_task_input")
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleAddTask();
      }
    });

  // Eventos para filtrar as tarefas
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

  // Função para renderizar tarefas filtradas
  function renderFilteredTodos(filteredTodos) {
    const todosContainer = document.querySelector(".todos");
    todosContainer.innerHTML = "";

    filteredTodos.forEach((todo, index) => {
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
        const itemsLeft = document.getElementById("items-left");
        const activeTodos = todos.filter((todo) => !todo.isCompleted);
        itemsLeft.textContent = activeTodos.length;
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
        const itemsLeft = document.getElementById("items-left");
        const activeTodos = todos.filter((todo) => !todo.isCompleted);
        itemsLeft.textContent = activeTodos.length;
      });

      const editDeleteButton = document.createElement("button");
      editDeleteButton.classList.add("task_button", "edit_delete_button");

      const editTaskButton = document.createElement("i");
      editTaskButton.classList.add("fa-regular", "fa-pen-to-square");
      editTaskButton.id = "edit_task";
      editTaskButton.addEventListener("click", () => {
        toggleOpacity(editTaskButton, 0);
        toggleDisplay(SaveTaskButton, "flex");
        toggleOpacity(SaveTaskButton, 1);
        input.removeAttribute("disabled");
        input.focus();
      });

      const SaveTaskButton = document.createElement("i");
      SaveTaskButton.classList.add("fa-solid", "fa-check");
      SaveTaskButton.id = "save_task";
      SaveTaskButton.addEventListener("click", () => {
        const index = input.getAttribute("data-index");
        editTodoItem(index);
        toggleOpacity(SaveTaskButton, 0);
        toggleOpacity(editTaskButton, 1);
        toggleDisplay(SaveTaskButton, "none");
        input.setAttribute("disabled", "disabled");
      });

      const deleteTaskButton = document.createElement("i");
      deleteTaskButton.classList.add("fa-regular", "fa-trash-can");
      deleteTaskButton.id = "delete_task";
      deleteTaskButton.addEventListener("click", () => {
        removeTodoItem(index);
      });

      // Montando a estrutura do HTML
      checkButton.appendChild(selectTaskButton);
      checkButton.appendChild(checkTaskButton);

      editDeleteButton.appendChild(editTaskButton);
      editDeleteButton.appendChild(deleteTaskButton);
      editDeleteButton.appendChild(SaveTaskButton);

      taskContent.appendChild(input);

      actionsTasks.appendChild(checkButton);
      actionsTasks.appendChild(editDeleteButton);

      todoItem.appendChild(taskContent);
      todoItem.appendChild(actionsTasks);

      todosContainer.appendChild(todoItem);

      if (todo.isCompleted) {
        input.classList.toggle("check");
        toggleOpacity(selectTaskButton, 0);
        toggleDisplay(checkTaskButton, "flex");
        toggleOpacity(checkTaskButton, 1);
      }
    });

    const itemsLeft = document.getElementById("items-left");
    const activeTodos = todos.filter((todo) => !todo.isCompleted);
    itemsLeft.textContent = activeTodos.length;
  }

  // Evento para limpar tarefas concluídas
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
  // Função para iniciar a página
  function initializePage() {
    // Carregar tarefas salvas (se houver)
    renderTodos();
  }

  // Inicializar a página
  initializePage();
});

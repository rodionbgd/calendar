import "./css/style.css";

import { configureStore } from "@reduxjs/toolkit";
import { constants } from "./constants";
import {
  datesSlice,
  createTodoList,
  todoSlice,
  setMonthYear,
  setTodoDate,
  removeTodos,
} from "./reducers";
import {
  renderTodo,
  renderCalendar,
  showPopover,
  showTodayTodos,
} from "./render/calendar";
import generateTodo from "./utils";
import TODO from "./todo/todo";
import { schema } from "./todo/items";
import { constantsTodo } from "./todo/constants_todo";
import { addTodoCb, getTodoFormElements, validateForm } from "./add_todo";
import { createRouter, updateLocation } from "./routing";
import { showActiveAnchor } from "./filter/utils";
import {
  addTagsEl,
  addTodoBtn,
  addTodoDateFrom,
  addTodoDateTo,
  addTodoModal,
  addTodoSelectedStatus,
  addTodoTask,
  calendar,
  calendarWrapper,
  currentMonthBtn,
  currentYearBtn,
  deleteSelectedBtn,
  filterEl,
  filterTodoBtn,
  getAddTodoElements,
  getFilterTodoElements,
  initializeEl,
  monthWrapper,
  nextMonthBtn,
  popover,
  popoverContent,
  prevMonthBtn,
  showAnchors,
  showMonthBtn,
  showYearBtn,
  todayBtn,
  todayTodosDate,
  todayTodosList,
} from "./elements";
import { filterTodoCb } from "./filter/filter_todos";

// const DEBUG_PATH = "";
const PROD_PATH = "/calendar";
export const REPO_NAME = PROD_PATH;

export const store = configureStore({
  reducer: {
    dates: datesSlice.reducer,
    todos: todoSlice.reducer,
  },
});

export const todoAPI = new TODO(schema);

export function createSubscriber() {
  const { dates, todos } = store.getState();
  const currentDate = new Date(dates.currentDate);
  initializeEl();
  currentMonthBtn.innerHTML = constants.MONTH_RU[dates.currentMonth];
  currentYearBtn.innerHTML = `${dates.currentYear}`;
  todayTodosDate.innerHTML = `Планы на: ${currentDate.getDate()}.${
    currentDate.getMonth() + 1
  }.${currentDate.getFullYear()}`;
  todayTodosList.innerHTML = showTodayTodos(currentDate, todos);
  showYearBtn.setAttribute("href", `${REPO_NAME}/year/${dates.currentYear}`);
  showMonthBtn.setAttribute(
    "href",
    `${REPO_NAME}/year/${dates.currentYear}/month/${
      constants.MONTH_REF[dates.currentMonth]
    }`
  );
  nextMonthBtn.setAttribute(
    "href",
    `${REPO_NAME}/year/${
      dates.currentYear + (dates.currentMonth + 1 > 11 ? 1 : 0)
    }/month/${constants.MONTH_REF[(dates.currentMonth + 1) % 12]}`
  );
  prevMonthBtn.setAttribute(
    "href",
    `${REPO_NAME}/year/${
      dates.currentYear - (dates.currentMonth - 1 < 0 ? 1 : 0)
    }/month/${constants.MONTH_REF[(dates.currentMonth + 11) % 12]}`
  );

  if (
    constants.YEAR_MONTH_ROUTE.test(window.location.pathname) ||
    window.location.pathname.replace(/\/$/g, "") === REPO_NAME
  ) {
    const wrappers = { calendarWrapper, monthWrapper };
    renderCalendar(
      calendar,
      wrappers,
      todos,
      new Date(dates.currentYear, dates.currentMonth, 1)
    );
    showTodayTodos(currentDate, todos);
  }
  const selectedTodo = <HTMLTableCellElement>(
    document.querySelector(
      `td[data-date="${currentDate.toLocaleDateString("ru-RU")}"]`
    )
  );
  if (selectedTodo) {
    selectedTodo.classList.add("selected");
  }
}

export function init() {
  initializeEl();
  const todoList = generateTodo();
  const originLocation = REPO_NAME;
  const router = createRouter(originLocation);
  store.dispatch(createTodoList(todoList));
  store.subscribe(() => {
    createSubscriber();
  });
  store.dispatch(
    setMonthYear({
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    })
  );
  if (!filterEl) {
    return store;
  }
  renderTodo(filterEl, constantsTodo.FILTER_MODE);
  getFilterTodoElements();
  renderTodo(addTodoModal, constantsTodo.ADD_MODE);
  getAddTodoElements();

  if (window.location.pathname.replace(/\/$/g, "") !== REPO_NAME) {
    updateLocation(window.location.pathname, originLocation);
    router.go(window.location.pathname);
  }
  filterTodoBtn.addEventListener("click", filterTodoCb);
  deleteSelectedBtn.addEventListener("click", () => {
    const deleteTodosList = Array.from(
      document.querySelectorAll("input[type=checkbox]")
    ).filter((todo) => (todo as HTMLInputElement).checked);
    if (deleteTodosList) {
      const deletedTodosId: string[] = [];
      deleteTodosList.forEach(async (todo) => {
        const { id } = (todo as HTMLElement).dataset;
        deletedTodosId.push(`${id}`);
      });
      store.dispatch(removeTodos(deletedTodosId));
      deletedTodosId.forEach(async (id) => {
        await todoAPI.deleteItem(Number(id));
      });
    }
  });

  let idToUpdate = "";
  addTodoBtn.addEventListener("click", async () => {
    idToUpdate = await addTodoCb(idToUpdate);
  });

  document.body.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    if (!target) {
      return;
    }
    if ((e.target as HTMLAnchorElement).matches("a")) {
      e.preventDefault();
      showActiveAnchor(showAnchors, e.target as HTMLAnchorElement);
      const href = (e.target! as HTMLAnchorElement).getAttribute(
        "href"
      ) as string;
      updateLocation(href, originLocation);
      router.go(href);
      if (e.target === todayBtn) {
        store.dispatch(
          setTodoDate({
            date: new Date().toDateString(),
          })
        );
      }
    }

    showPopover(store, target, {
      currentMonthBtn,
      currentYearBtn,
      popover,
      popoverContent,
    });

    // Todos на выбранную дату
    const td = target.closest("td");
    if (td && td.dataset.date) {
      const date = new Date([
        ...td.dataset.date.split(".").reverse(),
      ] as unknown as string);
      store.dispatch(
        setTodoDate({
          date: date.toDateString(),
        })
      );
      return;
    }
    if (target.closest('[data-target="#addTodoModalWrapper"]')) {
      addTodoModal.reset();
      addTagsEl.innerHTML = `Теги: `;
    }
    if (!target.closest("[data-action]")) {
      return;
    }
    const actionBtn = <HTMLButtonElement>target.closest("[data-action]");
    const id = actionBtn.dataset.id as string;
    // Редактирование текущего item
    if (actionBtn.dataset.action === constantsTodo.UPDATE) {
      idToUpdate = id;
      const { todos } = store.getState();
      const todo = todos.filter((item) => Object.keys(item)[0] === id)[0][id];
      addTodoTask.value = todo.task;
      const date1 = new Date(todo.date1)
        .toLocaleDateString("ru-RU")
        .split(".")
        .reverse()
        .join("-");
      addTodoDateFrom.value = `${date1}`;
      addTodoDateTo.value = "";
      if (todo.date2) {
        const date2 = new Date(todo.date2)
          .toLocaleDateString("ru-RU")
          .split(".")
          .reverse()
          .join("-");
        addTodoDateTo.value = `${date2}`;
      }
      [addTodoSelectedStatus.value] = constantsTodo[todo.status];
      if (todo.tags && todo.tags.length) {
        addTagsEl.innerHTML = `Теги: ${todo.tags.join(", ")}`;
      }
      const options = getTodoFormElements();
      validateForm(options);
    }
    // Удаление выбранного item
    if (actionBtn.dataset.action === constantsTodo.DELETE) {
      await todoAPI.deleteItem(Number(id));
      store.dispatch(removeTodos([id]));
    }
  });

  return store;
}

window.addEventListener("load", init);

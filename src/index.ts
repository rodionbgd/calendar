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
  addTodo,
  updateTodo,
} from "./reducers";
import {
  renderTodo,
  renderCalendar,
  showPopover,
  showTodayTodos,
} from "./render/calendar";
import generateTodo from "./utils";
import TODO from "./todo/todo";
import { schema, schemaType } from "./todo/items";
import { constantsTodo } from "./todo/constants_todo";
import getTodoFromForm from "./add_todo";
import { createRouter, updateLocation } from "./routing";
import { showActiveAnchor } from "./filter/utils";

export const REPO_NAME = "/calendar";

export const store = configureStore({
  reducer: {
    dates: datesSlice.reducer,
    todos: todoSlice.reducer,
  },
});

export let prevMonthBtn: HTMLButtonElement;
export let nextMonthBtn: HTMLButtonElement;
export let todayBtn: HTMLButtonElement;
export let popover: HTMLElement;
export let popoverContent: HTMLElement;
export let currentMonthBtn: HTMLButtonElement;
export let currentYearBtn: HTMLButtonElement;
export let showYearBtn: HTMLAnchorElement;
export let showMonthBtn: HTMLAnchorElement;
export let showAnchors: HTMLElement[];
export let monthWrapper: HTMLElement;
export let filterEl: HTMLElement;
export let calendarWrapper: HTMLElement;
export let calendar: HTMLElement;
export let todayTodosList: HTMLUListElement;
export let todayTodosDate: HTMLElement;
export let deleteSelectedBtn: HTMLButtonElement;
export let addTodoBtn: HTMLButtonElement;
export let addTodoModalWrapper: HTMLElement;
export let addTodoModal: HTMLFormElement;

export function initializeEl() {
  prevMonthBtn = <HTMLButtonElement>document.getElementById("prev-month-btn");
  nextMonthBtn = <HTMLButtonElement>document.getElementById("next-month-btn");

  todayBtn = <HTMLButtonElement>document.getElementById("today-btn");
  popover = <HTMLElement>document.getElementById("popover");
  popoverContent = <HTMLElement>document.getElementById("popover-content");
  currentMonthBtn = <HTMLButtonElement>(
    document.getElementById("current-month-btn")
  );
  currentYearBtn = <HTMLButtonElement>(
    document.getElementById("current-year-btn")
  );

  showYearBtn = <HTMLAnchorElement>document.getElementById("show-year-btn");
  showMonthBtn = <HTMLAnchorElement>document.getElementById("show-month-btn");
  //  showWeekBtn = <HTMLAnchorElement>(
  //   document.getElementById("show-week-btn")
  // );

  showAnchors = [showYearBtn, showMonthBtn];

  monthWrapper = <HTMLElement>document.getElementById("month-wrapper");

  filterEl = <HTMLElement>document.getElementById("filter");
  calendarWrapper = <HTMLElement>document.getElementById("calendar-wrapper");
  calendar = <HTMLElement>document.getElementById("calendar");

  // Current todolist
  todayTodosList = <HTMLUListElement>(
    document.getElementById("today-todos-list")
  );
  todayTodosDate = <HTMLElement>document.getElementById("today-todos-date");

  deleteSelectedBtn = <HTMLButtonElement>(
    document.getElementById("delete-selected-btn")
  );
  addTodoBtn = <HTMLButtonElement>document.getElementById("add-todo-btn");
  addTodoModalWrapper = <HTMLElement>(
    document.getElementById("addTodoModalWrapper")
  );
  addTodoModal = <HTMLFormElement>document.getElementById("add-todo-modal");
}

// filter todos
export let filterTodoBtn: HTMLButtonElement;
export let filterTodoTask: HTMLTextAreaElement;
export let filterTodoDateFrom: HTMLInputElement;
export let filterTodoDateTo: HTMLInputElement;
export let filterTodoSelectedStatus: HTMLSelectElement;
export let filterTagsEl: HTMLParagraphElement;

// add item
export let addTodoTask: HTMLTextAreaElement;
export let addTodoDateFrom: HTMLInputElement;
export let addTodoDateTo: HTMLInputElement;
export let addTodoSelectedStatus: HTMLSelectElement;
export let addTagsEl: HTMLParagraphElement;

export let idToUpdate: string | undefined;

function getFilterTodoElements() {
  filterTodoBtn = <HTMLButtonElement>document.getElementById("filter-todo-btn");
  filterTodoTask = <HTMLTextAreaElement>(
    document.getElementById("filter-todo-task")
  );
  filterTodoDateFrom = <HTMLInputElement>(
    document.getElementById("filter-todo-date-from")
  );
  filterTodoDateTo = <HTMLInputElement>(
    document.getElementById("filter-todo-date-to")
  );
  filterTodoSelectedStatus = <HTMLSelectElement>(
    document.getElementById("filter-todo-selected-status")
  );
  filterTagsEl = <HTMLParagraphElement>document.getElementById("filter-tags");
}

function getAddTodoElements() {
  addTodoTask = <HTMLTextAreaElement>document.getElementById("add-todo-task");
  addTodoDateFrom = <HTMLInputElement>(
    document.getElementById("add-todo-date-from")
  );
  addTodoDateTo = <HTMLInputElement>document.getElementById("add-todo-date-to");
  addTodoSelectedStatus = <HTMLSelectElement>(
    document.getElementById("add-todo-selected-status")
  );
  addTagsEl = <HTMLParagraphElement>document.getElementById("add-tags");
}

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
  filterTodoBtn.addEventListener("click", () => {
    const options = {
      todoTask: filterTodoTask,
      todoDateFrom: filterTodoDateFrom,
      todoDateTo: filterTodoDateTo,
      todoSelectedStatus: filterTodoSelectedStatus,
      tagsEl: filterTagsEl,
    };
    const { todos } = store.getState();
    const filter = getTodoFromForm(options);
    todayTodosList.innerHTML = showTodayTodos(filter, todos);
    todayTodosDate.innerHTML = `Фильтр`;
  });
  deleteSelectedBtn.addEventListener("click", () => {
    const deleteTodosList = Array.from(
      document.querySelectorAll("input[type=checkbox]")
    ).filter((todo) => (todo as HTMLInputElement).checked);
    if (deleteTodosList) {
      const deleteTodosId: string[] = [];
      deleteTodosList.forEach(async (todo) => {
        const id = Number((todo as HTMLElement).dataset.id);
        deleteTodosId.push(`${id}`);
        await todoAPI.deleteItem(id);
      });
      store.dispatch(removeTodos(deleteTodosId));
    }
  });
  addTodoBtn.addEventListener("click", async () => {
    const options = {
      todoTask: addTodoTask,
      todoDateFrom: addTodoDateFrom,
      todoDateTo: addTodoDateTo,
      todoSelectedStatus: addTodoSelectedStatus,
      tagsEl: addTagsEl,
    };
    const todo = getTodoFromForm(options);
    if (todo) {
      if (idToUpdate === undefined) {
        const newTodoId = await todoAPI.createItem(todo as schemaType);
        store.dispatch(addTodo({ [newTodoId]: todo }));
      } else {
        await todoAPI.updateItem(todo as schemaType, Number(idToUpdate));
        store.dispatch(updateTodo({ [idToUpdate]: todo }));
      }
    }
    idToUpdate = undefined;
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

import {
  renderCalendar,
  renderPopover,
  renderStatusList,
  renderTodo,
  showPopover,
  showTodayTodos,
} from "./calendar";
import { TodoObj } from "../types";
import { Store } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { datesSlice, DateState, setTodoDate, todoSlice } from "../reducers";
import generateTodo from "../utils";
import { constantsTodo } from "../todo/constants_todo";

import { bodyInnerHTML } from "../body_inner_html";
import { constants } from "../constants";

describe("Rendering app", () => {
  let todos: TodoObj[];
  let store: Store;

  let prevMonthBtn;
  let todayBtn;
  let popover: HTMLElement;
  let popoverContent: HTMLElement;
  let currentMonthBtn: HTMLButtonElement;
  let currentYearBtn: HTMLButtonElement;
  let showYearBtn;
  let showMonthBtn;
  let showAnchors;
  let monthWrapper: HTMLElement;
  let filterEl: HTMLElement;
  let calendarWrapper: HTMLElement;
  let calendar: HTMLElement;
  let todayTodosList: HTMLUListElement;
  let todayTodosDate;
  let deleteSelectedBtn;
  let addTodoBtn;
  let addTodoModalWrapper;
  let addTodoModal;
  beforeEach(async () => {
    document.body.innerHTML = bodyInnerHTML;
    store = configureStore({
      reducer: {
        dates: datesSlice.reducer,
        todos: todoSlice.reducer,
      },
    });
    prevMonthBtn = <HTMLButtonElement>document.getElementById("prev-month-btn");
    prevMonthBtn = <HTMLButtonElement>document.getElementById("next-month-btn");

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
    todos = generateTodo();
    store.dispatch(
      setTodoDate({
        date: new Date().toDateString(),
      })
    );
  });
  describe("Rendering calendar", () => {
    let dates: DateState;
    beforeEach(() => {
      dates = store.getState().dates;
    });
    test("Rendering current month", () => {
      renderCalendar(
        calendar,
        { calendarWrapper, monthWrapper },
        todos,
        new Date(dates.currentYear, dates.currentMonth, 1)
      );
      let daysNumber = calendar.querySelectorAll(".current").length;
      expect(daysNumber).toBe(
        new Date(dates.currentYear, dates.currentMonth + 1, 0).getDate()
      );

      //Date creation
      renderCalendar(calendar, { calendarWrapper, monthWrapper }, todos);
      daysNumber = calendar.querySelectorAll(".current").length;
      expect(daysNumber).toBe(
        new Date(dates.currentYear, dates.currentMonth + 1, 0).getDate()
      );
    });
    test("No element/ no date rendering", () => {
      renderCalendar(
        calendar,
        {},
        todos,
        new Date(dates.currentYear, dates.currentMonth, 1)
      );
      expect(calendar.innerHTML).toBeFalsy();
    });
    test("Change current date rendering", () => {
      window.history.pushState(null, "", "/year/2025/month/dec");
      renderCalendar(
        calendar,
        { calendarWrapper, monthWrapper },
        todos,
        new Date(dates.currentYear, dates.currentMonth, 1)
      );
      const todosNumber = calendar.querySelectorAll(".event").length;
      expect(todosNumber).toBe(0);
    });
    test("Todos wrapping", () => {
      setTimeout(() => {
        renderCalendar(
          calendar,
          { calendarWrapper, monthWrapper },
          todos,
          new Date(dates.currentYear, dates.currentMonth + 1, 1)
        );
        const todoCells = calendar.querySelectorAll(".event");
        const todoCellWrapped = Array.from(todoCells).filter((todo) =>
          todo.innerHTML.includes("...")
        );
        expect(todoCellWrapped.length).toBeGreaterThan(0);
      }, 0);
    });
  });
  describe("Showing today todos", () => {
    test("Date filter", () => {
      todayTodosList.innerHTML = showTodayTodos(new Date(), todos);
      const filteredTodo = Object.values(
        todos.filter((todo) => Object.values(todo)[0].task === "four")
      )[0];
      const id = Object.keys(filteredTodo)[0];
      expect(todayTodosList.querySelector(`[data-id="${id}"]`)).toBeTruthy();
    });
    test("Complex filter", () => {
      const filter = { task: "f" };
      todayTodosList.innerHTML = showTodayTodos(filter, todos);
      const filteredTodoEl =
        todayTodosList.querySelectorAll(".list-group-item");
      const filteredTodoNumber = todos.filter((todo) =>
        Object.values(todo)[0].task.includes("f")
      ).length;
      expect(filteredTodoEl.length).toBe(filteredTodoNumber);
    });
  });
  test("Rendering status list", () => {
    const statusList = document.createElement("select");
    statusList.innerHTML = renderStatusList();
    const statusNumber = Object.keys(constantsTodo).filter((key) =>
      key.includes("TASK")
    ).length;
    expect(statusList.children.length - 1).toBe(statusNumber);
  });
  test("Showing popover", () => {
    showPopover(store, currentMonthBtn, {
      currentMonthBtn,
      currentYearBtn,
      popover,
      popoverContent,
    });
    expect(popover.style.display).toBe("block");
    showPopover(store, currentYearBtn, {
      currentMonthBtn,
      currentYearBtn,
      popover,
      popoverContent,
    });
    expect(popover.style.display).toBe("block");
    showPopover(store, document.body, {
      currentMonthBtn,
      currentYearBtn,
      popover,
      popoverContent,
    });
    expect(popover.style.display).toBe("none");
    const currentMonth = 4;
    const currentYear = 2019;
    popover.dataset.month = constants.MONTH_RU[currentMonth];
    popover.dataset.year = `${2019}`;
    showPopover(store, popover, {
      currentMonthBtn,
      currentYearBtn,
      popover,
      popoverContent,
    });
    expect(store.getState().dates.currentMonth).toBe(currentMonth);
    expect(store.getState().dates.currentYear).toBe(currentYear);
  });
  test("Rendering popover", () => {
    const type = "month";
    popover.style.display = "block";
    popover.dataset.type = type;
    renderPopover(store, { popover, type });
    expect(popover.style.display).toBe("none");
  });
  test("Rendering todo", () => {
    const mode = constantsTodo.FILTER_MODE;
    renderTodo(filterEl, mode);
    const inputTags = <HTMLInputElement>(
      document.getElementById(`${mode}-tags-input`)
    );
    inputTags.value = "tag1";
    inputTags.dispatchEvent(new Event("change"));
    expect(inputTags.style.border).toBe("");
    inputTags.value = ",";
    inputTags.dispatchEvent(new Event("change"));
    expect(inputTags.style.border).toBe("1px solid red");
  });
});

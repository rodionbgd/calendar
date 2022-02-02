import { Store } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { bodyInnerHTML } from "./body_inner_html";
import { createSubscriber, init } from "./index";
import { datesSlice, todoSlice } from "./reducers";
import { constants } from "./constants";
import { renderTodo } from "./render/calendar";
import { constantsTodo } from "./todo/constants_todo";

describe("Initializing app", () => {
  let currentMonthBtn: HTMLButtonElement;
  let currentYearBtn: HTMLButtonElement;
  let todayTodosList: HTMLUListElement;

  let store: Store;

  beforeEach(() => {
    document.body.innerHTML = bodyInnerHTML;
    currentMonthBtn = <HTMLButtonElement>(
      document.getElementById("current-month-btn")
    );
    currentYearBtn = <HTMLButtonElement>(
      document.getElementById("current-year-btn")
    );
    todayTodosList = <HTMLUListElement>(
      document.getElementById("today-todos-list")
    );
    store = configureStore({
      reducer: {
        dates: datesSlice.reducer,
        todos: todoSlice.reducer,
      },
    });
  });

  test("Initial state", () => {
    expect(store.getState()).toStrictEqual({
      dates: {
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        currentDate: new Date().toDateString(),
      },
      todos: [],
    });
  });

  test("Creating subscriber", () => {
    createSubscriber();
    const { dates } = store.getState();

    expect(currentMonthBtn.innerHTML).toBe(
      constants.MONTH_RU[dates.currentMonth]
    );
    expect(currentYearBtn.innerHTML).toBe(`${dates.currentYear}`);
  });

  test("Deleting todo", () => {
    store = init();
    const deleteSelectedBtn = <HTMLButtonElement>(
      document.getElementById("delete-selected-btn")
    );
    const deleteTodoEl = <HTMLInputElement>(
      document.querySelector("input[type=checkbox]")
    );
    deleteTodoEl.checked = true;
    const { todos } = store.getState();
    deleteSelectedBtn.dispatchEvent(new MouseEvent("click"));
    expect(store.getState().todos).toHaveLength(todos.length - 1);
  });
  test("Filtering todos", () => {
    store = init();
    const filterTodoTask = <HTMLTextAreaElement>(
      document.getElementById("filter-todo-task")
    );
    const filterTodoBtn = <HTMLButtonElement>(
      document.getElementById("filter-todo-btn")
    );

    filterTodoTask.value = "five";
    expect(todayTodosList.innerHTML).not.toContain(filterTodoTask.value);
    filterTodoBtn.dispatchEvent(new MouseEvent("click"));
    expect(todayTodosList.innerHTML).toContain(filterTodoTask.value);
  });

  test("Rendering todo modal", () => {
    const mode = constantsTodo.FILTER_MODE;
    const filterEl = <HTMLElement>document.getElementById("filter");

    renderTodo(filterEl, mode);
    const tagsEl = <HTMLParagraphElement>(
      document.getElementById(`${mode}-tags`)
    );
    const inputTags = <HTMLInputElement>(
      document.getElementById(`${mode}-tags-input`)
    );
    expect(tagsEl).toBeTruthy();
    expect(inputTags).toBeTruthy();

    const tagValue = "testTag";
    inputTags.value = tagValue;
    inputTags.dispatchEvent(new Event("change"));
    expect(tagsEl.innerHTML).toContain(tagValue);
    expect(inputTags.value).toBeFalsy();
  });
});

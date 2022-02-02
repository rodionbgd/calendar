import { Store } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { TodoObj } from "./types";
import { createTodoList, datesSlice, removeTodos, todoSlice } from "./reducers";
import generateTodo from "./utils";

describe("Reducer", () => {
  let store: Store;
  let todoList: TodoObj[];
  let todos: TodoObj[];

  beforeEach(() => {
    store = configureStore({
      reducer: {
        dates: datesSlice.reducer,
        todos: todoSlice.reducer,
      },
    });
    todoList = generateTodo();
    store.dispatch(createTodoList(todoList));
    todos = store.getState().todos;
  });

  test("Todo removal", () => {
    const id = "2";
    const todoById = todos.filter((todo) => Object.keys(todo)[0] === id)[0];
    expect(Object.keys(todoById).length).toBeGreaterThan(0);
    store.dispatch(removeTodos([id]));
    const updatedTodos = store.getState().todos;
    expect(updatedTodos).not.toContain(todoById);
  });

  test("Todo creation", () => {
    expect(todos).toStrictEqual(todoList);
  });
});

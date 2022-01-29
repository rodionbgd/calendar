import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodoObj } from "./types";

export type DateState = {
  currentMonth: number;
  currentYear: number;
  currentDate: string;
};

export type TodoDate = {
  date: string;
};
export type MonthYear = {
  month: number;
  year: number;
};

const initialStateDate: DateState = {
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  currentDate: new Date().toDateString(),
};

const initialStateTodo: TodoObj[] = [];

export const todoSlice = createSlice({
  name: "todos",
  initialState: initialStateTodo,
  reducers: {
    createTodoList: {
      reducer: (state, action: PayloadAction<TodoObj[]>) => {
        Object.values(action.payload).forEach((value) => {
          state.push(value);
        });
      },
      prepare: (value) => ({
        payload: { ...value },
      }),
    },
    addTodo: {
      reducer: (state, action: PayloadAction<TodoObj>) => [
        ...state,
        action.payload,
      ],
      prepare: (value) => ({
        payload: { ...value },
      }),
    },
    updateTodo: {
      reducer: (state, action: PayloadAction<TodoObj>) =>
        state.map((todo) => {
          if (Object.keys(todo)[0] === Object.keys(action.payload)[0]) {
            return action.payload;
          }
          return todo;
        }),
      prepare: (value) => ({
        payload: { ...value },
      }),
    },
    removeTodos: {
      reducer: (state, action: PayloadAction<string[]>) => {
        Object.values(action.payload).forEach((id) => {
          state = state.filter((todo) => Object.keys(todo)[0] !== id);
        });
        return state;
      },
      prepare: (value) => ({
        payload: { ...value },
      }),
    },
  },
});

export const datesSlice = createSlice({
  name: "dates",
  initialState: initialStateDate,
  reducers: {
    setPrevMonth: (state) => {
      state.currentMonth -= 1;
      if (state.currentMonth === -1) {
        state.currentMonth = 11;
        state.currentYear -= 1;
      }
    },
    setNextMonth: (state) => {
      state.currentMonth += 1;
      if (state.currentMonth === 12) {
        state.currentMonth = 0;
        state.currentYear += 1;
      }
    },
    setMonthYear: {
      reducer: (state, action: PayloadAction<MonthYear>) => {
        if (!Number.isNaN(action!.payload.month)) {
          state.currentMonth = action!.payload.month;
        }
        if (!Number.isNaN(action!.payload.year)) {
          state.currentYear = action!.payload.year;
        }
      },
      prepare: (value) => ({
        payload: { ...value },
      }),
    },
    setTodoDate: {
      reducer: (state, action: PayloadAction<TodoDate>) => {
        state.currentDate = action!.payload.date;
      },
      prepare: (value) => ({
        payload: { ...value },
      }),
    },
  },
});

const { actions } = datesSlice;
export const { setPrevMonth, setNextMonth, setMonthYear, setTodoDate } =
  actions;
const todosActions = todoSlice.actions;
export const { createTodoList, addTodo, updateTodo, removeTodos } =
  todosActions;

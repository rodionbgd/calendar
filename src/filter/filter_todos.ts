import { Todo, TodoObj } from "../types";
import {
  filterTagsEl,
  filterTodoDateFrom,
  filterTodoDateTo,
  filterTodoSelectedStatus,
  filterTodoTask,
  todayTodosDate,
  todayTodosList,
} from "../elements";
import { showTodayTodos } from "../render/calendar";
import { store } from "../index";
import getTodoFromForm from "../add_todo";

const TODO_KEYS = {
  TASK: "task",
  DATE_FROM: "date1",
  DATE_TO: "date2",
  STATUS: "status",
  TAGS: "tags",
};
export function filterTodos(todos: TodoObj[], filter: Partial<Todo>) {
  let filteredTodos = [...todos];
  Object.entries(filter).forEach(([key, value]) => {
    switch (key) {
      case TODO_KEYS.DATE_FROM:
        if (!value) {
          break;
        }
        filteredTodos = filteredTodos.filter((obj) => {
          const todo = Object.values(obj)[0];
          let todoDate2: Date;
          if (!todo.date2) {
            todoDate2 = new Date(todo.date1);
          } else {
            todoDate2 = new Date(todo.date2);
          }
          todoDate2 = new Date(
            todoDate2.getFullYear(),
            todoDate2.getMonth(),
            todoDate2.getDate()
          );
          return new Date(value as string) <= todoDate2;
        });
        break;
      case TODO_KEYS.DATE_TO: {
        if (!value) {
          break;
        }
        filteredTodos = filteredTodos.filter((obj) => {
          const todo = Object.values(obj)[0];
          let todoDate1 = new Date(todo.date1);

          todoDate1 = new Date(
            todoDate1.getFullYear(),
            todoDate1.getMonth(),
            todoDate1.getDate()
          );
          return new Date(value as string) >= todoDate1;
        });
        break;
      }
      case TODO_KEYS.TASK:
        if (!value) {
          break;
        }
        filteredTodos = filteredTodos.filter((obj) => {
          const todo = Object.values(obj)[0];
          return todo.task.indexOf(value as string) !== -1;
        });
        break;
      case TODO_KEYS.STATUS:
        if (!value) {
          break;
        }
        filteredTodos = filteredTodos.filter((obj) => {
          const todo = Object.values(obj)[0];
          return todo.status === (value as string);
        });
        break;
      case TODO_KEYS.TAGS:
        if (!(value as string[]).length) {
          break;
        }
        filteredTodos = filteredTodos.filter((obj) => {
          const todo = Object.values(obj)[0];
          return (value as string[]).filter(
            (tag) => todo.tags!.indexOf(tag) !== -1
          ).length;
        });
        break;
      default:
        break;
    }
  });
  return filteredTodos;
}

export function filterTodoCb() {
  const options = {
    todoTask: filterTodoTask,
    todoDateFrom: filterTodoDateFrom,
    todoDateTo: filterTodoDateTo,
    todoSelectedStatus: filterTodoSelectedStatus,
    tagsEl: filterTagsEl,
  };
  const { todos } = store.getState();
  const filter = getTodoFromForm(options, false);
  if (filter) {
    todayTodosList.innerHTML = showTodayTodos(filter, todos);
    todayTodosDate.innerHTML = `Фильтр`;
  }
}

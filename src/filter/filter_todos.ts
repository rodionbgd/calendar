import { Todo, TodoObj } from "../types";

export function filterTodos(todos: TodoObj[], filter: Partial<Todo>) {
  let filteredTodos = [...todos];
  Object.entries(filter).forEach(([key, value]) => {
    switch (key) {
      case "date1":
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
      case "date2": {
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
      case "task":
        if (!value) {
          break;
        }
        filteredTodos = filteredTodos.filter((obj) => {
          const todo = Object.values(obj)[0];
          return todo.task.indexOf(value as string) !== -1;
        });
        break;
      case "status":
        if (!value) {
          break;
        }
        filteredTodos = filteredTodos.filter((obj) => {
          const todo = Object.values(obj)[0];
          return todo.status === (value as string);
        });
        break;
      case "tags":
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

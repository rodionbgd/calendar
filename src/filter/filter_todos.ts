import { calendarWrapper, REPO_NAME, store } from "../index";
import { constants } from "../constants";
import { TodoObj } from "../types";
import { schemaType } from "../todo/items";

export function filterTodos(todos: TodoObj[], filter: Partial<schemaType>) {
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
        console.log(filteredTodos);
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

export function currentDateTodos(todos: TodoObj[], options: any) {
  if (!options.date2) {
    return todos.filter((obj) => {
      const todo = Object.values(obj)[0];
      let todoDate1 = new Date(todo.date1);
      todoDate1 = new Date(
        todoDate1.getFullYear(),
        todoDate1.getMonth(),
        todoDate1.getDate()
      );
      if (todo.date2) {
        let todoDate2 = new Date(todo.date2);
        todoDate2 = new Date(
          todoDate2.getFullYear(),
          todoDate2.getMonth(),
          todoDate2.getDate()
        );
        return options.date1 >= todoDate1 && options.date1 <= todoDate2;
      }
      return (
        todoDate1.toLocaleDateString("ru-RU") ==
        options.date1.toLocaleDateString("ru-RU")
      );
    });
  }
  return todos.filter((obj) => {
    const todo = Object.values(obj)[0];
    let todoDate1 = new Date(todo.date1);
    todoDate1 = new Date(todoDate1.getFullYear(), todoDate1.getMonth(), 1);
    if (todo.date2) {
      let todoDate2 = new Date(todo.date2);
      todoDate2 = new Date(
        todoDate2.getFullYear(),
        todoDate2.getMonth(),
        todoDate2.getDate()
      );
      return options.date1 >= todoDate1 && options.date1 <= todoDate2;
    }
    return (
      todoDate1.toLocaleDateString() === options.date1.toLocaleDateString()
    );
  });
}

export function showYear(el: HTMLElement) {
  calendarWrapper.style.display = "none";
  el.style.display = "block";
  const { todos, dates } = store.getState();
  const year = dates.currentYear;
  let innerHTML = "<ul>";
  for (let i = 0; i < constants.MONTH_RU.length; i += 1) {
    const date1 = new Date(year, i, 1);
    const date2 = new Date(year, i + 1, 0);
    innerHTML += `
            <li class="calendar-month month-0 js-cal-option" data-date="${date1}">
            <a href="${REPO_NAME}/year/${dates.currentYear}/month/${
      constants.MONTH_REF[i]
    }">${constants.MONTH_RU[i]}</a>
                <span class="badge">${
                  currentDateTodos(todos, { date1, date2 }).length
                }</span>
            </li>
        `;
  }
  innerHTML += "</ul>";
  el.innerHTML = innerHTML;
}

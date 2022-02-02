import { Todo, TodoObj } from "../types";
import { constants } from "../constants";
import { setMonthYear } from "../reducers";
import { REPO_NAME, store } from "../index";
import { constantsTodo } from "../todo/constants_todo";
import { filterTodos } from "../filter/filter_todos";
import { Store } from "redux";
import { calendarWrapper } from "../elements";

export function renderCalendar(
  el: HTMLElement,
  wrappers: Record<string, HTMLElement>,
  todos: TodoObj[],
  date?: Date
) {
  const { calendarWrapper, monthWrapper } = wrappers;
  if (!calendarWrapper || !monthWrapper) {
    return;
  }
  calendarWrapper.style.display = "block";
  monthWrapper.style.display = "none";
  if (!date) {
    date = new Date();
  }
  if (constants.YEAR_MONTH_ROUTE.test(window.location.pathname)) {
    const location = window.location.pathname.replace(/\/$/g, "");
    const year = location.match(constants.YEAR_ROUTE)![1];
    const month = location.match(constants.MONTH_ROUTE)![1];
    date = new Date(Number(year), constants.MONTH_REF.indexOf(month), 1);
  }
  // date = new Date()
  const firstDayDate = new Date(date!.getFullYear(), date!.getMonth(), 1);
  const firstDay = firstDayDate.getDay();
  const lastDayDate = new Date(date!.getFullYear(), date!.getMonth() + 1, 0);
  const lastDate = lastDayDate.getDate();
  const lastDay = lastDayDate.getDay();
  let otherMonthDate: Date;
  let innerHTML = `<tr>`;
  if (firstDay !== 1) {
    for (let i = 1; i < (firstDay || 7); i += 1) {
      otherMonthDate = new Date(
        firstDayDate.getFullYear(),
        firstDayDate.getMonth(),
        firstDayDate.getDate() - (firstDay - i)
      );
      innerHTML += `
                <td class="calendar-day outside c-sunday js-cal-option"
                    data-date="${otherMonthDate.toLocaleDateString("ru-RU")}">
                    <div class="date">${otherMonthDate.getDate()}</div>
                </td>
            `;
    }
  }
  for (let i = 0; i < lastDate; i += 1) {
    const currentDate = new Date(date!.getFullYear(), date!.getMonth(), i + 1);
    const currentDateString = currentDate.toLocaleDateString("ru-RU");
    innerHTML += `
                <td class="calendar-day current c-sunday js-cal-option"
                data-date="${currentDateString}">
                    <div class="date">${i + 1}</div>
                `;
    const filteredTodos = filterTodos(todos, {
      date1: `${currentDate} `,
      date2: `${currentDate} `,
    });
    if (filteredTodos.length) {
      filteredTodos.forEach((obj, index) => {
        if (index == 2 && filteredTodos.length > 3) {
          innerHTML += `          
                <div class="event all-day begin end" title="All Day Event">
                   ...
                </div>
                `;
          return;
        }
        const todo = Object.values(obj)[0];
        if (filteredTodos.length <= 3 || index <= 2) {
          innerHTML += `          
                <div class="event all-day begin end" title="All Day Event">
                    ${todo.task}
                </div>
                `;
          return;
        }
      });
    }
    innerHTML += `</td>`;
    if (!((firstDay + i) % 7)) {
      innerHTML += `</tr><tr>`;
    }
  }
  if (lastDay % 7) {
    for (let i = lastDay + 1; i <= 7; i += 1) {
      otherMonthDate = new Date(
        lastDayDate.getFullYear(),
        lastDayDate.getMonth(),
        lastDayDate.getDate() + i - lastDay
      );
      innerHTML += `
                <td class="calendar-day outside c-sunday js-cal-option"
                    data-date="${otherMonthDate.toLocaleDateString("ru-RU")}">
                    <div class="date">${otherMonthDate.getDate()}</div>
                </td>       
        `;
    }
  }
  innerHTML += `</tr>`;
  el.innerHTML = innerHTML;
}

export function showTodayTodos(filter: Date | Partial<Todo>, todos: TodoObj[]) {
  let todayTodos: TodoObj[];
  if (filter instanceof Date && !isNaN(Number(filter))) {
    todayTodos = filterTodos(todos, { date1: `${filter}`, date2: `${filter}` });
  } else {
    todayTodos = filterTodos(todos, filter as Partial<Todo>);
  }
  let innerHTML = "";
  todayTodos.forEach((obj) => {
    const todo = Object.values(obj)[0];
    let statusClass = "";
    switch (todo.status) {
      case constantsTodo.TASK_IN_PROCESS[0]:
        statusClass = "warning";
        break;
      case constantsTodo.TASK_EXPIRED[0]:
        statusClass = "danger";
        break;
      case constantsTodo.TASK_FULFILLED[0]:
        statusClass = "success";
        break;
      default:
        break;
    }
    innerHTML += `
        <li class="list-group-item">
                                    <div class="todo-indicator bg-warning"></div>
                                    <div class="widget-content p-0">
                                        <div class="widget-content-wrapper">
                                            <div class="widget-content-left mr-2">
                                                <div class="custom-checkbox custom-control">
                                                    <input data-id="${
                                                      Object.keys(obj)[0]
                                                    }" class="custom-control-input" type="checkbox">
                                                </div>
                                            </div>
                                            <div class="widget-content-left">
                                                <div class="widget-heading">${
                                                  todo.task
                                                }
                                                </div>
                                            </div>
                                            <div class="widget-content-left">
                                                <div class="widget-heading">Теги: ${
                                                  todo.tags
                                                    ? todo.tags.join(", ")
                                                    : ""
                                                }
                                                </div>
                                            </div>
                                            <div class="widget-content-right">
                                                <div class="badge badge-${statusClass} ml-2">${
      constantsTodo[todo.status][1]
    }</div>
                                                <button data-action="${
                                                  constantsTodo.UPDATE
                                                }" data-id="${
      Object.keys(obj)[0]
    }" data-toggle="modal" data-target="#addTodoModalWrapper" class="border-0 btn btn-warning"><i
                                                        class="fa fa-pencil"  aria-hidden="true"></i></button>
                                                <button data-action="${
                                                  constantsTodo.DELETE
                                                }" data-id="${
      Object.keys(obj)[0]
    }" class="border-0 btn btn-danger"><i
                                                        class="fa fa-trash-o" aria-hidden="true"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
        `;
  });
  return innerHTML;
}

export function renderStatusList() {
  const statusArr = Object.keys(constantsTodo).filter(
    (key) => key.indexOf("TASK") !== -1
  );
  let statusList = `
    <option>
    </option>
    `;
  statusArr.forEach((status) => {
    statusList += `
            <option value="${status}">${constantsTodo[status][1]}</option>
        `;
  });
  return statusList;
}

export function renderTodo(el: HTMLElement, mode: string) {
  const statusList = renderStatusList();
  const errorBadge = `
        <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
        <span id="inputSuccess2Status" class="sr-only">(success)</span>
`;
  const applyBtn = `<button id="${mode}-todo-btn" type="button" class="btn btn-primary btn-sm">Применить</button>`;
  const hasErrorClass = mode === constantsTodo.ADD_MODE ? "has-error" : "";
  el.innerHTML = `
        <div id="todo-form">
            <div class="form-group ${hasErrorClass} has-feedback">
                <div class="input-group-prepend">
                    <span class="input-group-text bold">
                        <strong>Напоминание</strong>
                    </span>
                </div>
                <input type="text" class="form-control" id="${mode}-todo-task">
                ${mode === constantsTodo.ADD_MODE ? errorBadge : ""}
            </div>        
            <div class="input-group mb-3 ${hasErrorClass}">
                <div class="input-group-prepend">
                    <span class="input-group-text">От</span>
                </div>
                <input class="form-control" id="${mode}-todo-date-from" type="date">
                 ${mode === constantsTodo.ADD_MODE ? errorBadge : ""}
            </div>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text">До</span>
                </div>
                <input class="form-control" id="${mode}-todo-date-to" type="date">
            </div>
        
            <div class="form-group mb-3 ${hasErrorClass}">
                <div class="input-group-prepend">
                    <label class="input-group-text"><strong>Статус</strong></label>
                </div>
                <select class="custom-select form-control" id="${mode}-todo-selected-status">
                    ${statusList}
                </select>
               
            </div>
            <p id="${mode}-tags">Теги: </p>
            <input id="${mode}-tags-input" type="text">
            ${mode === constantsTodo.FILTER_MODE ? applyBtn : ""}
            <button type="reset" class="btn btn-secondary btn-sm">Сброс</button>
        </div>
    `;
  const tagsEl = <HTMLParagraphElement>document.getElementById(`${mode}-tags`);
  const inputTags = <HTMLInputElement>(
    document.getElementById(`${mode}-tags-input`)
  );
  inputTags.addEventListener("change", () => {
    if (!inputTags.value.match(/^[a-zA-Z0-9]+$/)) {
      inputTags.value = "";
      inputTags.style.border = "1px solid red";
      inputTags.style.transition = "border 1s";
      return;
    }
    const tagsString = tagsEl.innerHTML.split(": ")[1];
    let tagsLength = tagsString.split(",").filter((str) => str !== "").length;
    inputTags.style.border = "";
    tagsEl.innerHTML += `${tagsLength ? "," : ""} ${inputTags.value}`;
    inputTags.value = "";
  });
}

export function showPopover(
  store: Store,
  target: HTMLElement,
  options: Record<string, HTMLElement>
) {
  const { currentMonthBtn, currentYearBtn, popover, popoverContent } = options;
  if (target === currentMonthBtn) {
    const offset = currentMonthBtn.clientWidth;
    renderPopover(store, {
      offset,
      type: "month",
      data: constants.MONTH_RU,
      popover,
      popoverContent,
    });
    return;
  }
  if (target === currentYearBtn) {
    const offset = 2 * currentMonthBtn.clientWidth + currentYearBtn.clientWidth;
    const years = Array.from({ length: 10 }, (_, i) => i + 2015);
    renderPopover(store, {
      offset,
      type: "year",
      data: years,
      popover,
      popoverContent,
    });
    return;
  }
  const popoverTarget = (target as HTMLElement).closest(
    "#popover"
  ) as HTMLElement;
  if (!popoverTarget) {
    popover.style.display = "none";
    return;
  }
  const month = target.dataset.month
    ? constants.MONTH_RU.indexOf(target.dataset.month)
    : store.getState().dates.currentMonth;
  const year = target.dataset.year
    ? Number(target.dataset.year)
    : store.getState().dates.currentYear;
  store.dispatch(
    setMonthYear({
      month,
      year,
    })
  );
  if (popover) {
    popover.style.display = "none";
  }
}

export function renderPopover(store: Store, options: any) {
  const { dates } = store.getState();
  const { type, offset, data, popover, popoverContent } = options;
  if (
    popover &&
    popover.style.display !== "none" &&
    type === popover.dataset.type
  ) {
    popover.style.display = "none";
    popover.dataset.type = "";
    return;
  }

  popoverContent.innerHTML = "";
  data.forEach((item: string | number, index: number) => {
    let href;
    if (typeof item === "number") {
      href = `${REPO_NAME}/year/${item}/month/${
        constants.MONTH_REF[dates.currentMonth]
      }`;
    } else {
      href = `${REPO_NAME}/year/${dates.currentYear}/month/${constants.MONTH_REF[index]}`;
    }
    popoverContent.innerHTML += `
            <a
                type="button" class="btn btn-default btn-lg btn-block js-cal-option"
                data-${type}="${item}" href="${href}">${item}
            </a>
        `;
  });
  popover.style.display = "block";
  popover.style.top = `46px`;
  popover.dataset.type = `${type}`;
  popover.style.left = `${(offset - popover.clientWidth) / 2}px`;
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
                  filterTodos(todos, { date1: `${date1}`, date2: `${date2}` })
                    .length
                }</span>
            </li>
        `;
  }
  innerHTML += "</ul>";
  el.innerHTML = innerHTML;
}

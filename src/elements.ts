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

export function getFilterTodoElements() {
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

export function getAddTodoElements() {
  addTodoTask = <HTMLTextAreaElement>document.getElementById("add-todo-task");
  addTodoDateFrom = <HTMLInputElement>(
    document.getElementById("add-todo-date-from")
  );
  addTodoDateTo = <HTMLInputElement>document.getElementById("add-todo-date-to");
  addTodoSelectedStatus = <HTMLSelectElement>(
    document.getElementById("add-todo-selected-status")
  );
  addTagsEl = <HTMLParagraphElement>document.getElementById("add-tags");

  addTodoTask.classList.add("has-feedback");
}

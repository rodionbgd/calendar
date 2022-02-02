import { constantsTodo } from "./todo/constants_todo";
import getTodoFromForm, { validateForm } from "./add_todo";
import { renderTodo } from "./render/calendar";

describe("Adding todo", () => {
  let options: Record<string, any>;
  let filterTodoTask: HTMLTextAreaElement;
  let filterTodoDateFrom: HTMLInputElement;
  let filterTodoDateTo: HTMLInputElement;
  let filterTodoSelectedStatus: HTMLSelectElement;
  let filterTagsEl: HTMLParagraphElement;
  beforeEach(() => {
    renderTodo(document.body, constantsTodo.FILTER_MODE);
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

    const date = new Date()
      .toLocaleDateString("ru-RU")
      .split(".")
      .reverse()
      .join("-");
    filterTodoTask.value = "four";
    filterTodoDateFrom.value = date;
    filterTodoDateTo.value = date;
    [filterTodoSelectedStatus.value] = constantsTodo.TASK_IN_PROCESS;
    options = {
      todoTask: filterTodoTask,
      todoDateFrom: filterTodoDateFrom,
      todoDateTo: filterTodoDateTo,
      todoSelectedStatus: filterTodoSelectedStatus,
    };
  });
  describe("Form validation", () => {
    test("Valid form", () => {
      expect(validateForm(options)).toBeTruthy();
    });
    test("Date to < Date from", () => {
      const date = new Date();
      date.setDate(date.getDate() - 3);
      filterTodoDateTo.value = date
        .toLocaleDateString("ru-RU")
        .split(".")
        .reverse()
        .join("-");
      options = {
        ...options,
        todoDateTo: filterTodoDateTo,
      };
      validateForm(options);
      expect(options.todoDateTo.value).toBe(options.todoDateFrom.value);
    });
    test("Invalid form", () => {
      filterTodoSelectedStatus.value = "";

      options = {
        ...options,
        todoSelectedStatus: filterTodoSelectedStatus,
      };
      expect(validateForm(options)).toBeFalsy();

      filterTodoTask.value = "";
      options = {
        ...options,
        todoTask: filterTodoTask,
      };
      expect(validateForm(options)).toBeFalsy();

      filterTodoDateFrom.value = "";
      options = {
        ...options,
        todoDateFrom: filterTodoDateFrom,
      };
      expect(validateForm(options)).toBeFalsy();
    });
  });
  test("Getting todo from form", () => {
    options.tagsEl = filterTagsEl;
    const task = options.todoTask.value;
    const todo = getTodoFromForm(options, true);
    expect(todo!.task).toBe(task);
    expect(options.todoTask.value).toBeFalsy();
  });
});

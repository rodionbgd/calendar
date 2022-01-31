import { Todo } from "./types";

export function validateForm(options: any) {
  let isValid = true;
  if (!options.todoTask.value) {
    options.todoTask.classList.add("invalid-feedback");
    isValid = false;
  }
  if (!options.todoDateFrom.value) {
    options.todoDateFrom.classList.add("invalid-feedback");
    isValid = false;
  }
  if (!options.todoSelectedStatus.value) {
    options.todoSelectedStatus.classList.add("invalid-feedback");
    isValid = false;
  }
  if (
    options.todoDateTo.value &&
    new Date(options.todoDateTo.value) < new Date(options.todoDateFrom.value)
  ) {
    options.todoDateTo.value = options.todoDateFrom.value;
  }
  return isValid;
}

export default function getTodoFromForm(options: Record<string, any>) {
  let todo: Todo = {} as Todo;
  if (validateForm(options)) {
    const tagsStr = options.tagsEl.innerHTML.split(": ")[1];
    const tags = tagsStr ? tagsStr.replace(/\s+/g, "").split(",") : [];
    let date1 = "";
    let date2 = "";
    if (options.todoDateFrom.value) {
      const date = new Date(options.todoDateFrom.value);
      date1 = `${new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )}`;
    }
    if (options.todoDateTo.value) {
      const date = new Date(options.todoDateTo.value);
      date2 = `${new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )}`;
    }
    todo = {
      task: options.todoTask.value ? options.todoTask.value : "",
      date1,
      date2,
      status: options.todoSelectedStatus.value
        ? options.todoSelectedStatus.value
        : "",
      tags,
    };
  }
  // Очистка формы
  options.todoTask.value = "";
  options.todoDateFrom.value = "";
  options.todoDateTo.value = "";
  options.todoSelectedStatus.value = "";
  options.tagsEl.innerHTML = "Теги: ";
  return todo;
}

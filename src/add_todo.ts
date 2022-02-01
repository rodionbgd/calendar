import { Todo } from "./types";

export function validateForm(options: any) {
  let isValid = true;
  if (!options.todoTask.value) {
    options.todoTask.parentNode.classList.add("has-error");
    isValid = false;
  } else {
    options.todoTask.parentNode.classList.remove("has-error");
    options.todoTask.parentNode.classList.add("has-success");
  }
  if (!options.todoDateFrom.value) {
    options.todoDateFrom.parentNode.classList.add("has-error");
    isValid = false;
  } else {
    options.todoDateFrom.parentNode.classList.remove("has-error");
    options.todoDateFrom.parentNode.classList.add("has-success");
  }
  if (!options.todoSelectedStatus.value) {
    options.todoSelectedStatus.parentNode.classList.add("has-error");
    isValid = false;
  } else {
    options.todoSelectedStatus.parentNode.classList.remove("has-error");
    options.todoSelectedStatus.parentNode.classList.add("has-success");
  }
  if (
    options.todoDateTo.value &&
    new Date(options.todoDateTo.value) < new Date(options.todoDateFrom.value)
  ) {
    options.todoDateTo.value = options.todoDateFrom.value;
  }
  return isValid;
}

export default function getTodoFromForm(
  options: Record<string, any>,
  isValidate: boolean
) {
  let todo: Todo = {} as Todo;
  if (!isValidate || validateForm(options)) {
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
  } else {
    return null;
  }

  // Очистка формы
  options.todoTask.value = "";
  options.todoDateFrom.value = "";
  options.todoDateTo.value = "";
  options.todoSelectedStatus.value = "";
  options.tagsEl.innerHTML = "Теги: ";
  return todo;
}

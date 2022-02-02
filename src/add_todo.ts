import { Todo } from "./types";
import {
  addTagsEl,
  addTodoBtn,
  addTodoDateFrom,
  addTodoDateTo,
  addTodoSelectedStatus,
  addTodoTask,
} from "./elements";
import { schemaType } from "./todo/items";
import { addTodo, updateTodo } from "./reducers";
import { store, todoAPI } from "./index";

type FormElementType =
  | HTMLInputElement
  | HTMLParagraphElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

function addHasSuccessClass(el: HTMLElement) {
  (el.parentNode as HTMLDivElement).classList.remove("has-error");
  (el.parentNode as HTMLDivElement).classList.add("has-success");
}
export function validateForm(options: Record<string, FormElementType>) {
  let isValid = true;
  if (!(options.todoTask as HTMLTextAreaElement).value) {
    (options.todoTask.parentNode as HTMLDivElement).classList.add("has-error");
    isValid = false;
  } else {
    addHasSuccessClass(options.todoTask);
  }
  if (!(options.todoDateFrom as HTMLInputElement).value) {
    (options.todoDateFrom.parentNode as HTMLDivElement).classList.add(
      "has-error"
    );
    isValid = false;
  } else {
    addHasSuccessClass(options.todoDateFrom);
  }
  if (!(options.todoSelectedStatus as HTMLSelectElement).value) {
    (options.todoSelectedStatus.parentNode as HTMLDivElement).classList.add(
      "has-error"
    );
    isValid = false;
  } else {
    addHasSuccessClass(options.todoSelectedStatus);
  }
  if (
    (options.todoDateTo as HTMLInputElement).value &&
    new Date((options.todoDateTo as HTMLInputElement).value) <
      new Date((options.todoDateFrom as HTMLInputElement).value)
  ) {
    (options.todoDateTo as HTMLInputElement).value = (
      options.todoDateFrom as HTMLInputElement
    ).value;
  }
  return isValid;
}

export function clearForm(options: Record<string, FormElementType>) {
  (options.todoTask as HTMLTextAreaElement).value = "";
  (options.todoDateFrom as HTMLInputElement).value = "";
  (options.todoDateTo as HTMLInputElement).value = "";
  (options.todoSelectedStatus as HTMLSelectElement).value = "";
  options.tagsEl.innerHTML = "Теги: ";
}

export default function getTodoFromForm(
  options: Record<string, FormElementType>,
  isValidate: boolean
) {
  let todo: Todo = {} as Todo;
  if (
    !isValidate ||
    validateForm(options as Record<string, HTMLInputElement>)
  ) {
    const tagsStr = options.tagsEl.innerHTML.split(": ")[1];
    const tags = tagsStr ? tagsStr.replace(/\s+/g, "").split(",") : [];
    let date1 = "";
    let date2 = "";
    if ((options.todoDateFrom as HTMLInputElement).value) {
      const date = new Date((options.todoDateFrom as HTMLInputElement).value);
      date1 = `${new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )}`;
    }
    if ((options.todoDateTo as HTMLInputElement).value) {
      const date = new Date((options.todoDateTo as HTMLInputElement).value);
      date2 = `${new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )}`;
    }
    todo = {
      task: (options.todoTask as HTMLInputElement).value
        ? (options.todoTask as HTMLInputElement).value
        : "",
      date1,
      date2,
      status: (options.todoSelectedStatus as HTMLInputElement).value
        ? (options.todoSelectedStatus as HTMLInputElement).value
        : "",
      tags,
    };
  } else {
    return null;
  }

  // Очистка формы
  clearForm(options);
  return todo;
}

export function getTodoFormElements() {
  return {
    todoTask: addTodoTask,
    todoDateFrom: addTodoDateFrom,
    todoDateTo: addTodoDateTo,
    todoSelectedStatus: addTodoSelectedStatus,
    tagsEl: addTagsEl,
  };
}
export async function addTodoCb(idToUpdate: string) {
  const options = getTodoFormElements();
  const todo = getTodoFromForm(options, true);
  if (todo) {
    addTodoBtn.dataset.dismiss = "modal";
    validateForm(options);
    if (idToUpdate === "") {
      const newTodoId = await todoAPI.createItem(todo as schemaType);
      store.dispatch(addTodo({ [newTodoId]: todo }));
    } else {
      await todoAPI.updateItem(todo as schemaType, Number(idToUpdate));
      store.dispatch(updateTodo({ [idToUpdate]: todo }));
      idToUpdate = "";
    }
  } else {
    addTodoBtn.dataset.dismiss = "";
  }
  return idToUpdate;
}

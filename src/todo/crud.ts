import { constantsTodo } from "./constants_todo";
import { schemaType } from "./items";

export default class CRUD {
  protected readonly storageType: string;
  private lastId: number;
  protected readonly schema: schemaType;

  constructor(
    schema: schemaType,
    storageType = constantsTodo.STORAGE_LOCAL as string
  ) {
    this.schema = schema;
    this.storageType = storageType;
    this.lastId = localStorage.length
      ? Math.max(...Object.keys(localStorage).map(Number)) + 1
      : 0;
  }

  validateSchema<T>(obj: T, schema: T) {
    if (!obj) throw constantsTodo.STATUS_ERROR;
    Object.keys(obj).forEach((prop) => {
      if (!Object.hasOwnProperty.call(schema, prop) && prop !== "date2") {
        throw Error(`${constantsTodo.STATUS_ERROR}: no ${prop} in schema`);
      }
    });
    return constantsTodo.STATUS_OK;
  }

  async createItem(item: schemaType) {
    try {
      this.validateSchema(item, this.schema);
    } catch (e) {
      throw e;
    }
    const schema = { ...this.schema };
    Object.entries(item).forEach(([key, value]) => {
      // @ts-ignore
      schema[key] = value;
    });
    switch (this.storageType) {
      case constantsTodo.STORAGE_LOCAL:
        localStorage.setItem(`${this.lastId}`, JSON.stringify(schema));
        this.lastId += 1;
        break;
      case constantsTodo.STORAGE_DB:
        break;
      default:
        break;
    }
    return this.lastId - 1;
  }

  async readItem(id: number) {
    let item: schemaType[] = [];
    switch (this.storageType) {
      case constantsTodo.STORAGE_LOCAL:
        if (!Object.hasOwnProperty.call(localStorage, `${id}`)) {
          throw Error(`${constantsTodo.STATUS_ERROR}: no ${id} in storage`);
        }
        item = [...JSON.parse(localStorage.getItem(`${id}`) as string)];
        break;
      case constantsTodo.STORAGE_DB:
        break;
      default:
        break;
    }
    return item;
  }

  async updateItem(item: schemaType, id: number) {
    try {
      this.validateSchema(item, this.schema);
    } catch (e) {
      throw e;
    }
    let newItem: schemaType;
    switch (this.storageType) {
      case constantsTodo.STORAGE_LOCAL:
        if (!Object.hasOwnProperty.call(localStorage, `${id}`)) {
          throw Error(`${constantsTodo.STATUS_ERROR}: no ${id} in storage`);
        }
        newItem = { ...JSON.parse(localStorage.getItem(`${id}`) as string) };
        Object.entries(item).forEach(([key, value]) => {
          newItem[key] = value;
        });
        localStorage.setItem(`${id}`, JSON.stringify(newItem));
        break;
      case constantsTodo.STORAGE_DB:
        break;
      default:
        break;
    }
  }

  async deleteItem(id: number) {
    switch (this.storageType) {
      case constantsTodo.STORAGE_LOCAL:
        if (!Object.hasOwnProperty.call(localStorage, `${id}`)) {
          throw Error(`${constantsTodo.STATUS_ERROR}: no ${id} in storage`);
        }
        localStorage.removeItem(`${id}`);
        break;
      case constantsTodo.STORAGE_DB:
        break;
      default:
        break;
    }
  }
}

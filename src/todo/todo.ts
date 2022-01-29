import { constantsTodo } from "./constants_todo";
import CRUD from "./crud";
import { schemaType } from "./items";

export default class TODO extends CRUD {
  constructor(schema: schemaType, storageType = constantsTodo.STORAGE_LOCAL) {
    super(schema, storageType as string);
  }

  async filter(options: Partial<schemaType>) {
    try {
      this.validateSchema(options, this.schema);
    } catch (e) {
      throw e;
    }
    let items: schemaType[] = [];
    let filteredItems = [];
    for (let index of Object.keys(localStorage)) {
      items.push(JSON.parse(localStorage.getItem(index) as string));
    }
    switch (this.storageType) {
      case constantsTodo.STORAGE_LOCAL:
        Object.entries(options).forEach(([key, value]) => {
          filteredItems = items.filter((obj) => {
            if (Array.isArray(obj[key])) {
              let hasProperty = false;
              (value as any[]).forEach((property) => {
                if ((obj[key] as string)!.indexOf(property) !== -1) {
                  hasProperty = true;
                }
              });
              return hasProperty;
            } else if (typeof obj[key] === "string") {
              return (obj[key] as string)!.indexOf(value as string) !== -1;
            } else {
              return obj[key] === value;
            }
          });
          items = [...filteredItems];
        });
        break;
      case constantsTodo.STORAGE_DB:
        break;
      default:
        break;
    }
    return items;
  }
}

import { bodyInnerHTML } from "../__test__/utils";
import { showActiveAnchor } from "./utils";

describe("Showing active anchor", () => {
  let showAnchors: HTMLAnchorElement[];
  let showYearBtn: HTMLAnchorElement;
  let showMonthBtn: HTMLAnchorElement;
  beforeEach(() => {
    document.body.innerHTML = bodyInnerHTML;
    showYearBtn = <HTMLAnchorElement>document.getElementById("show-year-btn");
    showMonthBtn = <HTMLAnchorElement>document.getElementById("show-month-btn");
    showAnchors = [showYearBtn, showMonthBtn];
  });
  test("Adding active anchor class", () => {
    expect(showYearBtn.classList.contains("active")).toBeFalsy();
    showActiveAnchor(showAnchors, showYearBtn);
    expect(showYearBtn.classList.contains("active")).toBeTruthy();
  });
});

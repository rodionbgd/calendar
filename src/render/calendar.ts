export function renderCalendar(el: HTMLElement, date?: Date) {
  if (!date) {
    date = new Date();
  }
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
    const dateString = new Date(
      date!.getFullYear(),
      date!.getMonth(),
      i + 1
    ).toLocaleDateString("ru-RU");
    const currentDateString = new Date().toLocaleDateString("ru-RU");
    innerHTML += `
                <td class="calendar-day current c-sunday js-cal-option 
                ${dateString === currentDateString ? "selected" : ""}"
                    data-date="${dateString}">
                    <div class="date">${i + 1}</div>
                </td>       
        `;
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

export function renderPopover(options: any) {
  const { popover, popoverContent, type, offset, data } = options;
  if (popover.style.display !== "none" && type === popover.dataset.type) {
    popover.style.display = "none";
    popover.dataset.type = "";
    return;
  }
  popoverContent.innerHTML = "";
  data.forEach((item: string[] | number[]) => {
    popoverContent.innerHTML += `
            <button
                type="button" class="btn btn-default btn-lg btn-block js-cal-option"
                data-${type}="${item}">${item}
            </button>
        `;
  });
  popover.style.display = "block";
  popover.style.top = `46px`;
  popover.dataset.type = `${type}`;
  popover.style.left = `${(offset - popover.clientWidth) / 2}px`;
}

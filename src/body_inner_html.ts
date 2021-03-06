// eslint-disable-next-line
export const bodyInnerHTML = `
     <main class="app">
      <aside>
        <h2>Фильтр</h2>
        <form id="filter" onsubmit="return false;"></form>
      </aside>
      <article class="calendar-todo" id="holder">
        <section class="calendar-navigation">
          <section style="text-align: left">
            <span class="btn-group">
              <a id="prev-month-btn" class="js-cal-prev btn btn-default">
                &lt;
              </a>
              <a id="next-month-btn" class="js-cal-next btn btn-default">
                &gt;
              </a>
            </span>
            <a
              id="today-btn"
              class="js-cal-option btn btn-default"
              href="/"
            >
              Сегодня
            </a>
          </section>
          <section>
            <span class="btn-group btn-group-lg">
              <button
                id="current-month-btn"
                class="js-cal-option btn btn-link"
              ></button>
              <button
                id="current-year-btn"
                class="js-cal-years btn btn-link"
              ></button>
              <div
                class="popover fade bottom in"
                style="display: none"
                role="tooltip"
                id="popover"
              >
                <div class="arrow"></div>
                <div id="popover-content" class="popover-content"></div>
              </div>
            </span>
          </section>
          <section style="text-align: right">
            <span class="btn-group">
              <a id="show-year-btn" class="js-cal-option btn btn-default">
                Год
              </a>
              <a
                id="show-month-btn"
                class="js-cal-option btn btn-default active"
              >
                Месяц
              </a>
              <!--              <a-->
              <!--                id="show-week-btn"-->
              <!--                class="js-cal-option btn btn-default"-->
              <!--              >-->
              <!--                Неделя-->
              <!--              </a>-->
            </span>
          </section>
        </section>
        <section id="month-wrapper"></section>
        <section id="calendar-wrapper">
          <table class="calendar-table table table-condensed table-tight">
            <thead>
              <tr class="weekdays">
                <th class="">Понедельник</th>
                <th class="">Вторник</th>
                <th class="">Среда</th>
                <th class="">Четверг</th>
                <th class="">Пятница</th>
                <th class="">Суббота</th>
                <th class="">Воскресенье</th>
              </tr>
            </thead>
            <tbody id="calendar"></tbody>
          </table>
        </section>
      </article>
      <div class="current-todo-wrapper justify-content-center">
        <div class="d-block text-right card-footer">
          <button id="delete-selected-btn" class="mr-2 btn btn-primary">
            Удалить
          </button>
          <button
            class="btn btn-primary"
            id="add-todo-modal-btn"
            data-toggle="modal"
            data-target="#addTodoModalWrapper"
          >
            +
          </button>
        </div>
        <div
          class="modal fade"
          id="addTodoModalWrapper"
          tabindex="-1"
          role="dialog"
          aria-labelledby=""
          aria-hidden="true"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title text-center">
                  Добавьте задачу
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </h5>
              </div>
              <form
                id="add-todo-modal"
                class="modal-body"
                onsubmit="return false;"
              ></form>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Отмена
                </button>
                <button
                  id="add-todo-btn"
                  type="button"
                  class="btn btn-primary"
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="card-hover-shadow-2x mb-3 card">
          <div class="card-header-tab card-header">
            <div
              id="today-todos-date"
              class="card-header-title font-size-lg text-capitalize font-weight-normal"
            >
              <i class="fa fa-tasks"></i>
            </div>
          </div>
          <div class="current-todo scroll-area-sm">
            <perfect-scrollbar class="ps-show-limits">
              <div style="position: static" class="ps ps--active-y">
                <div class="ps-content">
                  <ul
                    id="today-todos-list"
                    class="list-group list-group-flush"
                  ></ul>
                </div>
              </div>
            </perfect-scrollbar>
          </div>
        </div>
      </div>
    </main>
`;

import { Component } from './Component.js';
const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class Cell extends Component {
  #self = null;
  #value = null;
  #isActive = false;
  #isSelected = false;
  #formula = null;
  #stateSubject = new BehaviorSubject(null);

  constructor(column, row) {
    super('cell');

    this.#value = this.self.querySelector('.cell-value');

    this.setData({
      column: column,
      row: row,
      address: `${column}${row}`,
    });

  };

  static createCell(column, row) {
    return new Cell(column, row)
  }

  activate(state = null) {
    if (state === null) {
      this.isActive = !(!!this.isActive);
      this.isSelected = !(!!this.isSelected);
    }
    else {
      this.isActive = state;
      this.isSelected = state;
    }
  }

  select(state = null) {
    if (state === null) {
      this.isSelected = !(!!this.isSelected);
    }
    else this.isSelected = state;
  }

  subscribe() {}

  #onDblClick() {}

  #onClick() {}

  #onBlur() {}



  #setEventHandlers() {
    this.handleDblClick = this.#onDblClick.bind(this)
    this.self.addEventListener('dblclick', this.handleDblClick)

    this.handleClick = this.#onClick.bind(this)
    this.self.addEventListener('click', this.handleClick)

    this.handleBlur = this.#onBlur.bind(this)
    this.self.addEventListener('blur', this.handleBlur)
  }

  get #dataset() { return this.dataset }

  get value() { return this.#value.textContent || null }

  set value(v) { this.#value.textContent = v }

  get formula() { return this.#formula || this.#value }

  set #address(address) { this.dataset.address = address }

  get address() { return this.dataset.address }

  get isActive() { return this.#dataset.active === 'true' ? true : false }

  set isActive(v) { this.#dataset.active = v === true ? true : false; }

  get isSelected() { return this.#dataset.selected === 'true' ? true : false }

  set isSelected(v) { this.#dataset.selected = v === true ? true : false; }
}
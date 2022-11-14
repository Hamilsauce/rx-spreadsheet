import { Component } from './Component.js';
const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class Cell extends Component {
  #self = null;
  #value = null;
  #isActive = false;
  #formula = null;
  #address = { r: null, c: null }
  #stateSubject = new BehaviorSubject(null);

  constructor(r, c) {
    super('cell');

    this.#address = { r, c };
  };

  static createCell({ r, c }) {
    return new Cell(r, c)
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

  get value() { return this.#value }

  get formula() { return this.#formula || this.#value }

  get address() { return this.#address }
  
  get isActive() { return this.#isActive  }

  set isActive(v) { this.#isActive = v === true ? true : false;  }
}

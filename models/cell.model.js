const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class Cell {
  #self = null;
  #value = null;
  #value$ = new BehaviorSubject(null);
  #formula = null;
  #position = { r: null, c: null }
  #address = ''
  #stateSubject = new BehaviorSubject(null);


  constructor({
    position = { r: null, c: null },
    address = '',
    formula = null,
    value = null,
  }) {
    this.#self = this;
    this.#position = position;
    this.#address = address;
    this.#formula = formula;
    this.#value = value;
    
    
  };


  get #self() { return this.#self };

  get value() {
    if (!!this.formula) {
      return this.evaluate()
    }

    return this.#value
  };

  get formula() { return this.#formula || null };


  set value(newValue) { this.#value = newValue };

  evaluate() {}
}
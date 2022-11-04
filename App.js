import { APP_OBJECT_TYPES } from './lib/app-objects.type.js';
import { Collection } from './lib/collection.js';
const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;


export class AppObject {
  #type;
  #name;
  #parent;

  constructor(type, name, parent) {
    if (!type) return;

    this.#type = type;

    this.#name = !!name ? name : null;

    this.#parent = !!parent ? parent : null;
  }

  activate() {}

  create() {}
  
  select() {}


  get type() { return this.#type };

  get name() { return this.#name };

  get parent() { return this.#parent };

  set parent(newValue) { this.#parent = newValue };
}




export class App extends AppObject {
  #workbooks = new Collection('workbook')

  constructor() {
    super(APP_OBJECT_TYPES.app);
  }

  createObject(type) {}

  get workbooks() { return this.#workbooks };

  set workbooks(newValue) { this.#workbooks = newValue };
}

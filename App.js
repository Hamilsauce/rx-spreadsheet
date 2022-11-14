import { AppObjectTypes } from './lib/app-objects.type.js';
import { Collection } from './lib/collection.js';
const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

/*
 *  @Ideas
 *    - Cascading/Hieraechical Active Components, 
        so:
        1) Activate Workbook at app level
        2) Workbook activates sheet
        3) Sheet activstes cell
 *
 *
 */

/*
 *  @Application
 *    - Loads top-level view components;
 *    - Mediates Events/messages/streams 
 *      between top-level components;
 *    - Opens/Loads/Activates Workbook
 */
export class Application {
  #type;
  #name;
  #parent;

  constructor() {
    // if (!type) return;

    // this.#type = type;

    // this.#name = !!name ? name : null;

    // this.#parent = !!parent ? parent : null;
  }

  openBook(name) {}

  createBook(name) {}

  get type() { return this.#type };

  get name() { return this.#name };

  get parent() { return this.#parent };

  set parent(newValue) { this.#parent = newValue };
}




export class App extends Application {
  #workbooks = new Collection('workbook')

  constructor() {
    super(AppObjectTypes.app);
  }

  createObject(type) {}

  get workbooks() { return this.#workbooks };

  set workbooks(newValue) { this.#workbooks = newValue };
}

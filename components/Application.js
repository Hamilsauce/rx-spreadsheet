import { Component } from './Component.js';
// import { AppObjectTypes } from './lib/app-objects.type.js';
import { Collection } from '../lib/collection.js';
import { ComponentLoader } from '../lib/component-loader.js';


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
export class Application extends Component {
  #parent;
  #workbooks = new Collection('workbooks')

  constructor() {
    super('application');

    this.#parent = null;
    ComponentLoader.loadComponents(this)
  this.init()
    console.log('Application in construxtor', this.components)
  }

  init() {
    const appPlaceholder = document.querySelector('#application');

    appPlaceholder.innerHTML = '';

    document.body.insertBefore(this.self, appPlaceholder.remove());
  }

  openBook(name) {}

  closeBook(name) {}

  createBook(name) {}

  get workbooks() { return this.#workbooks };

  // set workbooks(newValue) { this.#workbooks = newValue };

  // get type() { return this.#type };

  // get name() { return this.#name };

  get parent() { return this.#parent };

  set parent(newValue) { this.#parent = newValue };
}

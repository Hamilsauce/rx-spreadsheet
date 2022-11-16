import { EventEmitter } from '../lib/event-emitter.js';
// import { template } from './lib/templater.js';

import { Collection } from '../lib/collection.js';

const templates = new Map([
  ['app', document.querySelector(`#app-template`)],
  ['book', document.querySelector(`#book-template`)],
  ['sheet', document.querySelector(`#sheet-template`)],
  ['cell', document.querySelector(`#cell-template`)],
])

export class Component extends EventEmitter {
  name;
  #type;
  #self;

  constructor(type) {
    super();

    this.#type = type;

    this.#self = this.#template(type);
  }

  render() { return this.self }

  create() {}

  addCollection(type = 'default', entries = []) {
    if (!type) throw new Error('Must give new collection a type');
    if (this[type]) throw new Error('Collection of type already exists on component - this.#type, type: ', this.#type, type);

    this[type] = new Collection(type, entries)

    return this[type];
  }

  #template(name = '') {
    return templates.get(name)
      .content.firstElementChild
      .cloneNode(true);
  };

  get self() { return this.#self }

  get type() { return this.#type }

}

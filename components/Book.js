import { Component } from './Component.js';

export class Book extends Component {
  #sheets;
  
  constructor(sheets = []) {
    super('book');
    this.#sheets = this.addCollection('sheets', sheets)
  }

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

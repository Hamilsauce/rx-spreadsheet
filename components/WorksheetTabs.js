import { Component } from './Component.js';

export class WorksheetTabs extends Component {
  #sheets;
  
  constructor(sheets = []) {
    super('worksheet-tabs');
    this.loadComponents(this)
    
    // this.#sheets = this.addCollection('sheets', sheets)
  }

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

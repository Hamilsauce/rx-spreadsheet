import { Component } from './Component.js';

export class Topbar extends Component {
  #sheets;
  
  constructor(sheets = []) {
    super('topbar');
    this.loadComponents(this)
    
    // this.#sheets = this.addCollection('sheets', sheets)
  }

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

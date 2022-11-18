import { Component } from './Component.js';
import { ComponentLoader } from '../lib/component-loader.js';

export class Workbook extends Component {
  #sheets;
  
  constructor(sheets = [[]]) {
    super('workbook');
    // this.loadComponents(this)
    ComponentLoader.loadComponents(this)
    
    this.#sheets = this.addCollection('sheets')
  }

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text } = ham;
export class Collection {
  constructor() {
    this.root;
  };
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}
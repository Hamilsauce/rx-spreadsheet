import { Component } from './Component.js';
const selectAllText = (e) => { window.getSelection().selectAllChildren(e.target) };
export class Topbar extends Component {
  #sheets;
  
  constructor(sheets = []) {
    super('topbar');
    this.loadComponents(this)
    
    const titleContent = localStorage.getItem('workbookName') ?? 'Workbook 1'
    this.titleElement.textContent = titleContent
    
    // this.#sheets = this.addCollection('sheets', sheets)
    this.titleElement.addEventListener('click', e => {
      this.titleElement.setAttribute('contenteditable', true);
      this.titleElement.focus();
      selectAllText(e)
      
    });
    this.titleElement.addEventListener('keydown', e => {
      if (e.key == 'Enter') {
        this.titleElement.blur();
        
      }
    });
    
    this.titleElement.addEventListener('blur', e => {
      this.titleElement.setAttribute('contenteditable', false);
      
      localStorage.setItem('workbookName', this.titleElement.textContent.trim())
      console.log('blue')
      
    });
  }
  
  get titleElement() { return this.dom.querySelector('#workbook-title') };
  
  set prop(newValue) { this._prop = newValue };
}
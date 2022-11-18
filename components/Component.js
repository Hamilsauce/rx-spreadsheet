import { EventEmitter } from '../lib/event-emitter.js';
import { Collection } from '../lib/Collection.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
// import { ComponentConfig } from './component-config.js';
const { template, utils } = ham;

const templates = new Map([
  ['app', document.querySelector(`#app-template`)],
  ['workbook', document.querySelector(`#book-template`)],
  ['worksheet', document.querySelector(`#sheet-template`)],
  ['cell', document.querySelector(`#cell-template`)],
]);


// const ComponentConfig = {}

export class Component extends EventEmitter {
  #name;
  #self;
  components = new Map()
  constructor(name) {
    super();

    this.#name = name;

    this.#self = this.#template(name);
  }

  render() { return this.self }

  create() {}
  
  setData(data={}) {
    Object.assign(this.dataset, data);
    
    return this;
  }

  addCollection(name = 'default', entries = []) {
    if (!name) throw new Error('Must give new collection a name');
    if (this[name]) throw new Error(`Collection of name already exists on component - #name & name: ${this.#name}, ${name}`);

    this[name] = new Collection(name, entries)

    return this[name];
  }

  #template(name = '') {
    return template(name);
  };

   loadComponents(targetComponent) {

  //   const foundComps = [...targetComponent.dom.querySelectorAll(`[data-component]`)];
  //   console.groupCollapsed('load' + targetComponent.name);
  //   console.warn('targetComponent.dom', targetComponent.dom)
  //   console.groupEnd('load' + targetComponent.name);

  //   foundComps.forEach((el) => {
  //     const name = el.dataset.component;
  //     const component = ComponentConfig()[name];

  //     if (!(name && component)) throw new Error('Unable to find component or name in loadComponents. Target Component & New Component Name: ', targetComponent, name);

  //     this.addComponent(targetComponent, component);
  //   });
  }

  // static addComponent(targetComponent, name, ComponentClass) {
  //   /*  Searches App Template for element with matching `data-component` then replaces with component template */
  //   targetComponent.dom.insertBefore(
  //     targetComponent.components.set(name, new ComponentClass(name)).get(name).dom,
  //     targetComponent.dom.querySelector(`[data-component="${name}"]`).remove()
  //   );
  // }


  get dom() { return this.#self }
  
  get dataset() { return this.#self.dataset }

  get self() { return this.#self }

  get name() { return this.#name }
}

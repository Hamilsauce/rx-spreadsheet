import { ComponentConfig } from '../components/component-config.js';

export const ComponentLoader = {
  loadComponents(targetComponent) {
    const foundComps = [...targetComponent.dom.querySelectorAll(`[data-component]`)];
    console.groupCollapsed('load' + targetComponent.name);
    console.warn('foundComps', foundComps)
    console.groupEnd('load' + targetComponent.name);

    foundComps.forEach((el) => {
      const name = el.dataset.component;
      const component = ComponentConfig()[name];
      console.log('name', name)
      if (!(name || component)) throw new Error(`Unable to find component or name in loadComponents. Target Component & New Component Name: ${Object.entries(targetComponent)}, ${name}`);

      this.addComponent(targetComponent, name, component);
    });
  },

  addComponent(targetComponent, name, ComponentClass) {
    /*  Searches App Template for element with matching `data-component` then replaces with component template */
    console.log('ComponentClass', ComponentClass)
    targetComponent.dom.insertBefore(
      targetComponent.components.set(name, new ComponentClass()).get(name).dom,
      targetComponent.dom.querySelector(`[data-component="${name}"]`).remove()
    );
  }

}

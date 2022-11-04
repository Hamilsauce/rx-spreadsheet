import { IndexedMap } from './indexed-map.js';

export class Collection extends IndexedMap {
  constructor(type = 'default', entries = [[]]) {
    if (!type) throw new Error('Must pass type to collection');

    super(entries || [[]]);

    this.type = type;
  }

  remove() {}
  
  getItem() {}
  
  add() {}
}

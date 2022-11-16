import { Component } from './Component.js';
import { Cell } from './Cell.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export const range = (start, stop) => {
  return new Array(stop - start)
    .fill(0)
    .map((v, i) => start + i);
}

// const range1 = range(0, 50)
// console.log('range1', range1)

export const DEFAULT_SHEET_OPTIONS = {
  width: 50,
  height: 50,
  cellSize: {
    width: 90,
    height: 30,
  }
}


export class Sheet extends Component {
  #self = null;
  #cells = [];
  #isActive = false;
  #value = null;
  #formula = null;
  #address = { r: null, c: null }
  #stateSubject = new BehaviorSubject(null);

  constructor(options) {
    super('sheet');
    const { height, width, cellSize } = options ? options : DEFAULT_SHEET_OPTIONS
    console.log('height, width, cellSize', height, width, cellSize)
    // const newCol = Cell.createCell({ c: 6, r: 6 })

    this.#cells = this.buildCells.bind(this)(height, width)

    // merge(
    //   fromEvent(this.self, 'click').pipe(
    //     map(x => x),
    //     tap(x => console.log('click', x))
    //   ),
    //   fromEvent(this.self, 'dblclick').pipe(
    //     map(x => x),
    //     tap(x => console.log('click', x))
    //   ),
    //   fromEvent(this.self, 'blur').pipe(
    //     map(x => x),
    //     tap(x => console.log('blur', x))
    //   ),
    // ).subscribe()
  };


  createCell({ address, col, row, content, dataType }) {
    const c = document.createElement('div');

    c.classList.add('cell');
    c.draggable = true
    c.dataset.col = col;
    c.dataset.row = row;
    c.dataset.address = address;
    c.dataset.dataType = dataType || 'string';
    c.textContent = content ? content : ''

    return c;
  }

  insertRow() {
    const c = document.createElement('div');

    c.classList.add('cell');
    c.draggable = true
    c.dataset.col = col;
    c.dataset.row = row;
    c.dataset.address = address;
    c.dataset.dataType = dataType || 'string';
    c.textContent = content ? content : ''

    return c;
  }

  insertColumn({ address, col, row, content, dataType }) {
    const c = document.createElement('div');

    c.classList.add('cell');
    c.draggable = true
    c.dataset.col = col;
    c.dataset.row = row;
    c.dataset.address = address;
    c.dataset.dataType = dataType || 'string';
    c.textContent = content ? content : ''

    return c;
  }

  cells(filter) {
    return [...sheet.querySelectorAll('.cell')];
  }


  setSize(width, height, cellSizel) {
    this.body.style.gridTemplateRows = `repeat(${height}, ${cellSizel.height}px)`
    this.body.style.gridTemplateColumns = `repeat(${width}, ${cellSizel.width}px)`
    this.columnHeaders.style.gridTemplateColumns = `repeat(${width}, ${cellSizel.width}px)`
    this.rowHeaders.style.gridTemplateRows = `repeat(${height}, ${cellSizel.height}px)`

    return this;
  }

  createCell({ r, c }) {
    return Cell.createCell({ r, c })
  }

  buildCells(rcount, ccount) {
    this.self.style.gridTemplateRows = `repeat(${rcount}, 30px)`;
    this.self.style.gridTemplateColumns = `repeat(${ccount}, 90px)`;

    return range(0, rcount)
      .reduce((matrix, row, rowIndex) => {
        row = { columns: [] }

        for (let col = 0; col < ccount; col++) {
          const newCol = Cell.createCell({ c: col, r: rowIndex })

          this.self.appendChild(newCol.render())
          row.columns = [...row.columns, newCol]
        }

        return { ...matrix, rows: [...matrix.rows, row], };
      }, { rows: [] })

  }

  subscribe() {}

  #onDblClick() {}

  #onClick() {}

  #onBlur() {}

  #setEventHandlers() {
    this.handleDblClick = this.#onDblClick.bind(this)
    this.self.addEventListener('dblclick', this.handleDblClick)

    this.handleClick = this.#onClick.bind(this)
    this.self.addEventListener('click', this.handleClick)

    this.handleBlur = this.#onBlur.bind(this)
    this.self.addEventListener('blur', this.handleBlur)
  }
  
  set width(v) {
    this.bo
  }

  get dims() {
    return {
      columns: this.columnHeaders.length,
      rows: this.rowHeaders.length,
    }
  }

  get activeCell() {
    return this.cells().filter((c, i) => c.dataset.active === 'true') || [];
  }

  get html() { return this.self }

  get body() { return this.self.querySelector('.cellgroup[data-area="body"') }

  get columnHeaders() { return [this.self.querySelector('.cellgroup[data-area="hrow"').children] }

  get rowHeaders() { return [this.self.querySelector('.cellgroup[data-area="hcol"').children] }
}

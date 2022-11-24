import { Component } from './Component.js';
import { Cell } from './Cell.js';
import { ComponentLoader } from '../lib/component-loader.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

const { template, utils } = ham;

const alphabet = utils.alphabet();

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


export class Worksheet extends Component {
  #self = null;
  #isActive = false;
  #stateSubject = new BehaviorSubject(null);
  #cellSize;

  constructor(options) {
    super('worksheet');

    const { height, width, cellSize } = options ? options : DEFAULT_SHEET_OPTIONS;

    this.#cellSize = cellSize;
   
    ComponentLoader.loadComponents(this)

    this.addCollection('rows');
    this.addCollection('columns');
    this.addCollection('cells');

    this.setSize(width, height, cellSize);

    this.#setEventHandlers();

    this.columnSelection$ = fromEvent(this.columnHeaders, 'click')
      .pipe(
        map(e => e.target.closest('.header').textContent.trim()),
        filter(_ => _),
        map(columnName => {
          return [...this.body.querySelectorAll(`.cell`)].filter((c, i) => c.dataset.column === columnName);
        }),
        tap(colCells => {
          colCells.forEach(c => c.dataset.selected = c.dataset.selected === 'true' ? false : true)
        }),
      )

    this.rowSelection$ = fromEvent(this.rowHeaders, 'click')
      .pipe(
        map(e => e.target.closest('.header').textContent.trim()),
        filter(_ => _),
        map(rowName => {
          return [...this.body.querySelectorAll(`.cell`)].filter((r, i) => c.dataset.row === rowName);
        }),
        tap(rowCells => {
          rowCells.forEach(r => r.dataset.selected = r.dataset.selected === 'true' ? false : true)
        })
      );

    this.headerSubscription = merge(
      this.columnSelection$,
      this.rowSelection$
    ).subscribe();
    
  };

  insertHeader(type = 'column', value, before) {
    type = type.toLowerCase();

    const h = template('header');
    const group = this[`${type}HeaderGroup`];

    h.dataset.headerType = type;
    h.dataset[type] = value;
    h.dataset.address = value;
    h.firstElementChild.textContent = value;

    this[`${type}s`].set(h, h);

    if (!before) { group.append(h) }

    else if (typeof before === 'number') { group.insertAdjacentElement(before, h); }

    else { group.insertBefore(h, before) }

    return h;
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

  getColumnName(column) {
    return column >= 26 ?
      alphabet[Math.floor(column / 26) - 1] + (alphabet[(column % 26)] || '') || '' :
      alphabet[column];
  }


  setSize(width, height, cellSize) {
    this.#width = width
    this.#height = height
    this.#cellSize = cellSize

    for (let column = 0; column < width; column++) {
      this.insertHeader('column', this.getColumnName(column))
    }

    for (let row = 0; row < height; row++) {
      this.insertHeader('row', row + 1)
    }

    for (let row = 0; row < height; row++) {
      for (let column = 0; column < width; column++) {
        const cell = this.createCell(this.getColumnName(column), row + 1)
        this.body.append(
          this.cells.set(cell.dom, cell).get(cell.dom).dom
        )
      }
    }

    return this;
  }

  createCell(column, row) {
    return Cell.createCell(column, row)
  }

  getTargetComponent(event = new Event('click')) {
    const targ = event.target.closest('[data-component]')

    if (this.cells.has(targ)) { return this.cells.get(targ); }

    // if (this.rows.has(targ)) { return this.rows.get(targ); }

    // if (this.columns.has(targ)) { return this.columns.get(targ); }

  }

  activateCell(cell) {
    if (this.activeCell && this.activeCell !== cell) {
      this.activeCell.activate(false);
    }
    // console.log('cell', cell)
    cell.activate(true);

    return this.activeCell;
  }

  subscribe() {}

  #onDblClick() {}

  #onClick(e) {
    const targ = this.getTargetComponent(e);
    if (!targ) return;
    this.activateCell(targ)
    // this.printCollections()
  }

  #onBlur() {}

  #setEventHandlers() {
    this.handleDblClick = this.#onDblClick.bind(this)
    this.self.addEventListener('dblclick', this.handleDblClick)

    this.handleClick = this.#onClick.bind(this)
    this.self.addEventListener('click', this.handleClick)

    this.handleBlur = this.#onBlur.bind(this)
    this.self.addEventListener('blur', this.handleBlur)
  }

  printCollections() {
    console.groupCollapsed(`${this.name} Collections`);
    console.warn({
      rows: [...this.rows],
      columns: [...this.columns],
      cells: [...this.cells],
    })
    console.groupEnd(`${this.name} Collections`);
  }

  set #width(v) {
    this.columnHeaderGroup.style.gridTemplateColumns = `repeat(${v}, ${this.cellSize.width||90}px)`;
    this.body.style.gridTemplateColumns = `repeat(${v}, ${this.cellSize.width||90}px)`;
  }

  get width() {
    return +this.body.style.gridTemplateColumns.match(/(?<=\().+?(?=\,)/)[0]
  }

  get height() {
    return +this.body.style.gridTemplateRows.match(/(?<=\().+?(?=\,)/)[0]
  }

  set #height(v) {
    this.rowHeaderGroup.style.gridTemplateRows = `repeat(${v}, ${this.cellSize.height||30}px)`;
    this.body.style.gridTemplateRows = `repeat(${v}, ${this.cellSize.height||30}px)`;
  }

  get dims() {
    return {
      columns: this.columnHeaders.length,
      rows: this.rowHeaders.length,
    }
  }

  get cellSize() {
    return {
      width: this.#cellSize.width || 90,
      height: this.#cellSize.height || 30,
    }
  }

  get activeCell() {
    return this.cells.get(this.self.querySelector('[data-active="true"')) //.filter((c, i) => c.dataset.active === 'true') || [];
  }

  get html() { return this.self }

  get body() { return this.self.querySelector('.cellgroup[data-area="body"') }

  get columnHeaderGroup() { return this.self.querySelector('.cellgroup[data-area="hrow"') }

  get columnHeaders() { return [this.self.querySelector('.cellgroup[data-area="hrow"').children] }

  get rowHeaderGroup() { return this.self.querySelector('.cellgroup[data-area="hcol"') }

  get rowHeaders() { return [this.self.querySelector('.cellgroup[data-area="hcol"').children] }
}

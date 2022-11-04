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


export class Sheet extends Component {
  // #self = null;
  #cells = [];
  #value = [];
  #formula = null;
  #address = { r: null, c: null }
  #stateSubject = new BehaviorSubject(null);

  constructor(rowCount, columnCount) {
    super('sheet');

    const newCol = Cell.createCell({ c: 6, r: 6 })
    this.#cells = this.buildCells.bind(this)(rowCount, columnCount)

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

  // get value() { return this.#value }

  get formula() { return this.#formula || this.#value }

  get address() { return this.#address }
}

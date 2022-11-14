import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { IndexedMap } from '../lib/indexed-map.js';

const { download, date, array, utils, text } = ham;

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;


const alphabet = utils.alphabet();

const sheetValueSubject$ = new BehaviorSubject({}).pipe(
  // distinctUntilChanged(),
  scan((prev, { address, model }) => ({ ...prev || {}, ...(model || {}) })),
  // scan((prev, { address, model }) => ({ ...prev || {}, [address]: prev[address] ? { ...prev[address], ...model } : model })),
  map(x => x),
);

let cellIndex = 0
let targetIndexes = [0, 200, 300]

const sheetValues$ = sheetValueSubject$.asObservable()
  .pipe(
    // distinctUntilChanged(),
    filter(cell => cell.address),
    groupBy(cell => cell.address),
    filter(cellgroup => cellgroup.key === 'A2'),

    tap(x => console.log('sheetValues$ AFTER GROUP', x))
  ).subscribe()



// const cellValue$ = sheetValueSubject$.asObservable().pipe(
//   map(cells => cells['A1']),
//   distinctUntilChanged(),
//   tap(x => console.log('sheetValueSubject$ AFTER distinctUntilChanged', x))
//   // tap(x => console.log('TAP', x))
// )
// .subscribe()

const CellModel = {
  address: '',
  rowIndex: null,
  columnIndex: null,
  value: null,
  formula: null,
}


export class SheetModel {
  #cells = new IndexedMap();
  #columnNames = [];
  #sheetValueSubject$ = new BehaviorSubject({}).pipe(
    scan((prev, { address, model }) => ({ ...prev || {}, ...(model || {}) })),
    // distinctUntilChanged(),
    filter(cell => cell.address),
    groupBy(cell => cell.address),
  );


  constructor(rcount = 31, ccount = 31) {
    this.#generateColumnNames(ccount);

    for (let row = 0; row < rcount; row++) {
      for (let col = 0; col < ccount; col++) {
        let address = `${this.#columnNames[col]}${row+1}`
        this.insertCell(address, { address, row, col, value: address, formula: null })
      }
    }

    setTimeout(() => {
      this.#sheetValueSubject$.next({ address: 'A1', model: { value: 'FUCK' } })
    }, 3500)

    setTimeout(() => {
      // console.log('pushing value A1 2', );
      this.#sheetValueSubject$.next({ address: 'A1', model: { value: 'SUCK' } })

    }, 1000)

    setTimeout(() => {
      // console.log('pushing value B2', );
      this.#sheetValueSubject$.next({ address: 'A1', model: { value: 'CUCK' } })

    }, 200)
    
    this.#sheetValueSubject$.asObservable().pipe(
        filter(cellgroup => cellgroup.key === 'A1'),
        tap(x => console.warn('subscribeToCell BEFORE MERGR MAP', x)),
        mergeMap(cellgroup$ => cellgroup$
          .pipe(
            map(x => x),
            tap(x => console.warn('subscribeToCell AFTER MERGR MAP', x)),
          )
        ),
        // distinctUntilChanged(),
      ).subscribe()
  
  }

  insertCell(address, model) {
    // console.log('address, model', address, model)
    this.#cells.set(address, model)
    sheetValueSubject$.next({ address, model })
  }

  insertRow() {}

  insertColumn() {}

  subscribeToCell(address) {
    return this.#sheetValueSubject$.asObservable().pipe(
        filter(cellgroup => cellgroup.key === address),
        tap(x => console.warn('subscribeToCell BEFORE MERGR MAP', x)),
        mergeMap(cellgroup$ => cellgroup$
          .pipe(
            map(x => x),
            tap(x => console.warn('subscribeToCell AFTER MERGR MAP', x)),
          )
        ),
        // distinctUntilChanged(),
      )
  }

  #generateColumnNames(ccount = 0) {
    for (let col = 0; col < ccount; col++) {
      let c = ''
      if (col >= 26) {
        let nameLength = Math.floor(col / 26) - 1;
        let remainder = (col % 26)
        c = alphabet[nameLength] + (alphabet[remainder] || '') || '';
      }
      else { c = alphabet[col] }
      this.#columnNames.push(c);
    }
  }

  #generateAddresses(ccount = 0) {
    let columnNames = []
    let name;

    for (let row = 0; row < dims.rcount; row++) {
      if (ccount >= 26) {
        let nameLength = Math.floor(ccount / 26) - 1;
        let remainder = (ccount % 26)
        name = alphabet[nameLength] + (alphabet[remainder] || '') || '';
      }
      else { name = alphabet[ccount] }

      columnNames.push(name);
    }

    return columnNames;
  }

  get columnNames() { return this.#columnNames };
  set columnNames(newValue) { this.#columnNames = newValue };

  get cells() { return this.#cells };
}

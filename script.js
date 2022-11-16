import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { download, date, array, utils, text } = ham;
import { template } from './lib/templater.js';
// import { Cell } from './components/Cell.js';
import { Sheet } from './components/Sheet.js';
import { getCellAddress } from './lib/cell-addresser.js';
import { SheetModel } from './models/sheet.model.js';
import { Application } from './App.js';
import { DEFAULT_SHEET_OPTIONS } from './components/Sheet.js';
const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;



const alphabet = utils.alphabet();


let columnNames = [];
let rowIds = [];

const app = document.querySelector('#app');
const containers = document.querySelectorAll('.container')
const sheet = document.querySelector('.sheet')
const sheetOverlay = sheet.querySelector('.sheet-overlay')
const gridBody = sheet.querySelector('.cellgroup[data-area=body]')
const columnHeaders = sheet.querySelector('.cellgroup[data-area=hrow]')
const rowHeaders = sheet.querySelector('.cellgroup[data-area=hcol]')


// setTimeout(() => {
//   let gridCols = gridBody.style.gridTemplateColumns
 
// let test1 = 'replace(61235, 90px)'
// let regex1 = /replace\((\d)\,/i;
// let regex2 = /##replace\(\d*\,/
//   let ccount = gridCols.match(/Java(Script)/g)
//   let ccount1 = test1.match(/\d+/)
  
//   console.log('ccount1', ccount1)
//   console.log('gridBody.style.gridTemplateColumns',
//   gridBody.style.gridTemplateColumns
//   );
// }, 1000)


const createCell = ({ address, col, row, content, dataType }) => {
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

const insertRow = () => {
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

const insertColumn = ({ address, col, row, content, dataType }) => {
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

const cells = (filter) => [...sheet.querySelectorAll('.cell')]

const activeCells = (filter) => cells().filter((c, i) => c.dataset.active === 'true') || [];


const hcols = (filter) => [...document.querySelector('.cellgroup[data-area=hcol]').children]
const hrows = (filter) => [...document.querySelector('.cellgroup[data-area=hrow]').children]

const dims = { ccount: hrows().length, rcount: hcols().length };

let cellFrag = new DocumentFragment();
gridBody.style.gridTemplateRows = `repeat(${dims.rcount}, ${30}px)`
gridBody.style.gridTemplateColumns = `repeat(${dims.ccount}, ${90}px)`

const application = new Application();
console.log('application', application)
const sheetModel = new SheetModel(dims.rcount, dims.ccount)
const sheetView = new Sheet(DEFAULT_SHEET_OPTIONS)

hrows().forEach((r, i) => {
  if (i >= 26) {
    const nameLength = Math.floor(i / 26) - 1;
    const remainder = (i % 26)
    r.textContent = alphabet[nameLength] + (alphabet[remainder] || '') || '';
  }

  else { r.textContent = alphabet[i] }

  columnNames.push(r.textContent);
});

hcols().forEach((c, i) => {
  c.textContent = i + 1;
  rowIds.push(c.textContent);
});


for (let row = 0; row < dims.rcount; row++) {
  for (let col = 0; col < dims.ccount; col++) {
    let address = columnNames[col] + rowIds[row]
    cellFrag.append(createCell({ address, row, col, content: address }))
  }
}

const sheetActions = {
  drawStart(e) {
    this.isDrawing = true;

    if (this.drawMode === 'RECT') {
      this.current = this.addVertex(new Vertex({
          x: e.touches[0].pageX,
          y: e.touches[0].pageY,
          width: 0,
          height: 0,
        },
        this.vertexSubjects,
        this.children.length,
        this.vertexFill,
        this
      ));

      return this.current
    }
  },

  drawMove(e) {
    e.preventDefault();

    if (this.isDrawing && this.drawMode === 'RECT') {
      this.current.setSize({
        width: e.touches[0].pageX - (this.current.x + 30),
        height: e.touches[0].pageY - (this.current.y + 30)
      });
    }
  },

  drawEnd(e) {
    this.isDrawing = false;

    if (!this.current) return;
    if (this.current.width + this.current.height < 40) {
      this.current.element.remove()
    }

    this.current = null;
  }
}


const selection = {
  cells: new Set(),
  el: null,
  overlay: document.querySelector('.sheet-overlay'),

  start(cell) {
    if (this.el instanceof Element) {
      this.el.remove();
      this.el = null;
    }
    this.el = document.createElement('div');
    const bbox = cell.getBoundingClientRect();
    this.el.classList.add('selection');
    this.el.style.top = bbox.top + 'px'
    this.el.style.left = bbox.left + 'px'
    this.el.style.width = bbox.width + 'px'
    this.el.style.height = bbox.height + 'px'
    sheet.setAttribute('touch-action', 'none')
    sheet.style.touchAction = 'none'
  },
  resize(x, y) {
    console.log('x, y', x, y)
    this.el = document.createElement('div');
    this.el.classList.add('selection');
    const { width, height } = getComputedStyle(this.el)
    this.el.style.top = x + 'px';
    this.el.style.left = y + 'px';
    this.el.style.width = (parseInt(width) + 90) + 'px'
    this.el.style.height = 30 + 'px'
    this.overlay.append(this.el)
  },
  end(cell) {
    const bbox = cell.getBoundingClientRect();
    this.el.style.width = bbox.right + 35 + 'px';
    this.el.style.height = bbox.bottom + 'px';
    sheet.style.touchAction = null
  },
}

const handlePointerDown = (e) => {
  activeCells().forEach((c, i) => {
    c.dataset.active = false;
  });

  let cell = e.target.closest('.cell');
  let sht = e.target.closest('.sheet');
  if (!cell || !sht) return;
  const group = document.createElement('div');
  sht.style.touchAction = 'none';
  group.classList.add('group');
  selection.cells.clear();
  cell.after(group)
  group.append(cell)
  cell.dataset.active = true;
  selection.cells.add(cell)
  return e
};

const handlePointerMove = (e) => {
  let cell = e.target.closest('.cell');
  if (!cell) return;
  selection.cells.add(cell)
  cell.dataset.active = true
  const el = document.elementFromPoint(e.clientX, e.clientY)
  return e
};

const handlePointerUp = (e) => {
  sheet.style.touchAction = null;

  return e
};

const activateCell = (cellDom) => {
  activeCells().forEach((c, i) => {
    cellDom.contentEditable = false;
    c.dataset.active = false;
  });

  cellDom.contentEditable = true;
  cellDom.dataset.active = true;
  return cellDom;
};

const pointerActions$ = {
  start: fromEvent(sheet, 'pointerdown').pipe(
    map(e => handlePointerDown(e))
  ),
  move: fromEvent(sheet, 'pointermove').pipe(
    tap(e => {
      const el = document.elementFromPoint(e.clientX, e.clientY)
    }),
    tap(e => selection.resize(e.clientX + e.offsetX, e.clientY + e.offsetY)),
    tap(handlePointerMove)
  ),
  end: fromEvent(sheet, 'pointerup').pipe(
    map(e => handlePointerUp(e)),
  ),
};


const selectedCells$ = pointerActions$.start.pipe(
  switchMap(() => pointerActions$.move.pipe(
    switchMap(e => pointerActions$.end)))
);
// .subscribe();

const activeCell$ = fromEvent(gridBody, 'click').pipe(
  map(e => e.target.closest('.cell')),
  distinctUntilChanged(),
  filter(cell => cell),
  tap(cell => {
    activateCell(cell)
  }),
  scan((prev, curr) => {
    console.warn('prev, curr', prev, curr)

    return curr.textContent
  }),

  mergeMap(cell => fromEvent(cell, 'blur')
    .pipe(
      map(e => e.target.closest('.cell').textContent),
      filter(cell => cell),
      distinctUntilChanged((prevTextContent, currTextContent) => {
        return prevTextContent === currTextContent
      }),
      tap(x => console.log('BLUR SWITCHMAP AFTER DISTINCT', x)),
      map(x => x),
    ),
  )
).subscribe();

const columnSelection$ = fromEvent(columnHeaders, 'click')
  .pipe(
    map(e => e.target.closest('.cell').textContent.trim()),
    filter(_ => _),
    map(columnName => {
      const col = [...gridBody.querySelectorAll(`.cell`)].filter((c, i) => {
        return c.dataset.address.replace(/[^a-zA-Z]+/g, '') === columnName
      });
      return col;
    }),
    tap(colCells => {
      colCells.forEach(c => c.dataset.selected = c.dataset.selected === 'true' ? false : true)
    }),
  )
// .subscribe();

const rowSelection$ = fromEvent(rowHeaders, 'click')
  .pipe(
    map(e => e.target.closest('.cell').textContent.trim()),
    filter(_ => _),
    map(rowName => {
      const row = [...gridBody.querySelectorAll(`.cell`)]
        .filter((r, i) => {
          return r.dataset.address.replace(/\D+/, '') === rowName
        });

      return row;
    }),
    tap(rowCells => {
      rowCells.forEach(r => r.dataset.selected = r.dataset.selected === 'true' ? false : true)
    }))

merge(
    columnSelection$,
    rowSelection$
  )
  .subscribe();


gridBody.innerHTML = '';
gridBody.append(cellFrag)

const a1 = document.querySelector('.cell[data-address=A1]')

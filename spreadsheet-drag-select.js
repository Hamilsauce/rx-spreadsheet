import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { download, date, array, utils, text } = ham;
import { template } from './lib/templater.js';
// import { Cell } from './components/Cell.js';
// import { Sheet } from './components/Sheet.js';
import { getCellAddress } from './lib/cell-addresser.js';
import { SheetModel } from './models/sheet.model.js';
import { App } from './App.js';
const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const alphabet = utils.alphabet();

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

const dims = { rcount: 31, ccount: 31 };

const application = new App()
const sheetModel = new SheetModel(dims.rcount, dims.ccount)

const a1$ = sheetModel.subscribeToCell('A1');
a1$.subscribe()

let columnNames = [];
let rowIds = [];

const app = document.querySelector('#app');
const containers = document.querySelectorAll('.container')
const sheet = document.querySelector('.sheet')
const sheetOverlay = sheet.querySelector('.sheet-overlay')
const gridBody = sheet.querySelector('.cellgroup[data-area=body]')

const cells = (filter) => [...sheet.querySelectorAll('.cell')]

const activeCells = (filter) => cells().filter((c, i) => c.dataset.active === 'true') || [];

let cellFrag = new DocumentFragment();

const hcols = (filter) => [...document.querySelector('.cellgroup[data-area=hcol]').children]
const hrows = (filter) => [...document.querySelector('.cellgroup[data-area=hrow]').children]

hrows().forEach((r, i) => {
  if (i >= 26) {
    let nameLength = Math.floor(i / 26) - 1;
    let remainder = (i % 26)
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
    // e.stopPropagation()
    this.isDrawing = true;

    if (this.drawMode === 'RECT') {
      this.current = this.addVertex(new Vertex({
          x: e.touches[0].pageX, //- e.target.offsetLeft,
          y: e.touches[0].pageY, //- event.target.offsetTop,
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
  },

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
    // console.log(getComputedStyle(this.el).width);
    // this.el.style.height = cell.style.height
    console.log('this.el.style.height', this.el.style.height)
    this.overlay.append(this.el)
  },
  end(cell) {
    // document.body.clientBoundingRect
    // console.log('cell', cell)
    const bbox = cell.getBoundingClientRect();
    // this.el = document.createElement('div');
    // this.el.classList.add('selection');
    this.el.style.width = bbox.right + 35 + 'px';
    this.el.style.height = bbox.bottom + 'px';
    // this.el.style.height = cell.style.height
    // sheet.setAttribute('touch-action', 'none')
    sheet.style.touchAction = null

    // this.overlay.append(this.el)
  },
}

const handlePointerDown = (e) => {
  // e.stopPropagation()
  activeCells().forEach((c, i) => {
    c.dataset.active = false;
  });

  let cell = e.target.closest('.cell');
  let sht = e.target.closest('.sheet');
  // console.log('handlePointerDown', { sht })
  if (!cell || !sht) return;
  // console.log('handlePointerDown 2', { sht })
  const group = document.createElement('div');
  sht.style.touchAction = 'none';
  group.classList.add('group');
  selection.cells.clear();
  cell.after(group)
  group.append(cell)
  cell.dataset.active = true;
  selection.cells.add(cell)
  // console.log('Down', cell);
  return e
};

const handlePointerMove = (e) => {
  let cell = e.target.closest('.cell');
  if (!cell) return;
  selection.cells.add(cell)
  cell.dataset.active = true
  const el = document.elementFromPoint(e.clientX, e.clientY)
  // console.warn('el.dataset.address', el.dataset.address)
  // console.warn('Move', e.target.dataset.address)
  return e
};

const handlePointerUp = (e) => {
  console.log('Up', e)
  sheet.style.touchAction = null;

  return e
};

const activateCell = (cellDom) => {
  // console.log('Up', e)
  // sheet.style.touchAction = null;

  activeCells().forEach((c, i) => {
    cellDom.contentEditable = false;
    c.dataset.active = false;
  });

  cellDom.contentEditable = true;
  cellDom.dataset.active = true;
  return cellDom;
};



// const sheetPointerStream = pointerEvents$.down

const pointerActions$ = {
  start: fromEvent(sheet, 'pointerdown').pipe(
    map(e => handlePointerDown(e))
  ),
  move: fromEvent(sheet, 'pointermove').pipe(
    // tap(x => console.warn('drag pointermove', x.clientX)),
    tap(e => {
      const el = document.elementFromPoint(e.clientX, e.clientY)
    }),
    tap(e => selection.resize(e.clientX + e.offsetX, e.clientY + e.offsetY)),
    tap(handlePointerMove)
  ),
  end: fromEvent(sheet, 'pointerup').pipe(
    // tap(e => selection.end(e.target)),
    map(e => handlePointerUp(e)),
  ),
};




const selectedCells$ = pointerActions$.start
  .pipe(
    switchMap(() => pointerActions$.move.pipe(
      switchMap(e => pointerActions$.end)))
  );
// .subscribe();

const activeCell$ = fromEvent(sheet, 'click').pipe(
    map(e => e.target.closest('.cell')),
    distinctUntilChanged(),
    filter(cell => cell),
    tap(cell => {
      activateCell(cell)
    }),
    scan((prev, curr) => {
      console.warn('prev, curr', prev, curr)

      // if (prev && curr) {}
      // console.warn('SCAN prev.textContent, curr.textContent', prev, curr)
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

        // tap(x => console.warn('AFYRR distinctUntilChanged BLUR - cell, curr', cell.textContent, x)),
        map(x => x),
        // tap(x => console.warn('switchMap(cell => selectedCells$', x)),

      ),
      // tap(x => console.warn('switchMap(cell => selectedCells$', x)),

    )
    // switchMap(cell => selectedCells$
    //   .pipe(
    //     map(x => x),
    //     tap(x => console.warn('switchMap(cell => selectedCells$', x)),

    //   ),
    //   // tap(x => console.warn('switchMap(cell => selectedCells$', x)),

    // )
  )
  .subscribe();

gridBody.innerHTML = '';

gridBody.append(cellFrag)

const a1 = document.querySelector('.cell[data-address=A1]')
// console.log('a1', a1)

// a1.addEventListener('blur', e => {

//   const cell = e.target.closest('.cell')
//   console.log('a1 change', { cell })
//   console.log('a1 content change', cell.textContent)
// });

// a1.addEventListener('blur', e => {

//   const cell = e.target.closest('.cell')
//   console.log('a1 blur', { cell })
//   console.log('a1 content blur', cell.textContent)
// });
// gridBody.addEventListener('dragmove', e => {

//   console.warn('++++DRAG START', e);
//   const el = document.elementFromPoint(e.clientX, e.clientY)
//   console.warn('elementFromPoint', el.dataset.address)

// });


// ;[...gridBody.children].forEach((ch, i) => {
//   ch.addEventListener('pointerdown', e => {
//     const targetCell = e.target.closest('.cell');

//     activeCells().forEach((c, i) => {
//       c.dataset.active = false;
//     });

//     if (targetCell) {
//       targetCell.dataset.active = targetCell.dataset.active === 'true' ? false : true;
//     }
//   });

// });
// cells() .#




// download('sr-sat-schedule.json', JSON.stringify(schedule,null,2))
// console.log('schedule', schedule)
import { template } from './lib/templater.js';
import { Cell } from './components/Cell.js';
import { Sheet } from './components/Sheet.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const sheet = document.querySelector('.sheet')
const cells = document.querySelectorAll('.cell');


const newCell = Cell.createCell({ r: 5, c: 5 })
console.time('sheet')
const newSheet = new Sheet(200, 200)
console.timeEnd('sheet')

// setTimeout(() => {
console.time('sheet2')
appBody.append(newSheet.render())
console.timeEnd('sheet2');

console.log(' ', );
// }, 1000)

// console.log('newSheet', newSheet.render())

const createCell = (model) => {
  const cell = template('cell');
  return cell;
}

const createSheet = (model) => {
  const cell = template('cell');
  return cell;
}



const onSheetClick = (e) => {
  // const { target } = e;

}

// merge(
//   fromEvent(sheet, 'click').pipe(
//     map(x => x),
//     tap(x => console.log('click', x)),
//     tap(e => {
//       const { target } = e;

//       const cell = target.closest('.cell');
//       if (cell) {
//         let selected = cell.dataset.selected === 'true' ? true : false;
//         cell.dataset.selected = !selected;
//       }
//       // console.log('dblclick', x)
//     })
//   ),
//   fromEvent(sheet, 'dblclick').pipe(
//     map(x => x),
//     tap(e => {
//       const { target } = e;
//       const cell = target.closest('.cell');
//       if (cell) {
//         cell.contentEditable = true;
//         const selected = cell.dataset.selected === 'true' ? true : false
//         cell.dataset.selected = !selected;
//       }
//       // console.log('dblclick', x)
//     })
//   ),
//   fromEvent(cells[1], 'blur').pipe(
//     map(x => x),
//     tap(x => console.log('blur', x))
//   ),
// ).subscribe()

// sheet.addEventListener('click', onSheetClick)

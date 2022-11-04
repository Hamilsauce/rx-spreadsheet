// Import stylesheets
// import './style.css';

// import { fromEvent, combineLatest } from 'rxjs';
// import { switchMap, takeUntil, map, tap, last } from 'rxjs/operators';

const { forkJoin, combineLatest,Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;

const { last,flatMap, takeUntil,reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;
// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `
  <h1>RxJS Drag and Drop</h1>
  <div class="draggable">0</div>
  <div class="draggable">1</div>
  <div class="draggable">2</div>
`;

const mouseMove$ = fromEvent(document, 'pointermove');
const mouseUp$ = fromEvent(document, 'pointerup');

const draggableElements = document.getElementsByClassName('draggable');

Array.from(draggableElements).forEach(createDraggableElement);

function createDraggableElement(element) {
  const mouseDown$ = fromEvent(element, 'pointerdown');

  const dragStart$ = mouseDown$;
  const dragMove$ = dragStart$.pipe(
    switchMap(start =>
      mouseMove$.pipe(
        map(moveEvent => ({
          originalEvent: moveEvent,
          deltaX: moveEvent.pageX - start.pageX,
          deltaY: moveEvent.pageY - start.pageY,
          startOffsetX: start.offsetX,
          startOffsetY: start.offsetY
        })),
        takeUntil(mouseUp$)
      )
    )
  );
  const dragEnd$ = dragStart$.pipe(
    switchMap(start =>
      mouseMove$.pipe(
        map(moveEvent => ({
          originalEvent: moveEvent,
          deltaX: moveEvent.pageX - start.pageX,
          deltaY: moveEvent.pageY - start.pageY,
          startOffsetX: start.offsetX,
          startOffsetY: start.offsetY
        })),
        takeUntil(mouseUp$),
        last(),
      )
    )
  );

  combineLatest([
    dragStart$.pipe(
      tap(event => {
        element.dispatchEvent(
          new CustomEvent('mydragstart', { detail: event })
        );
      })
    ),
    dragMove$.pipe(
      tap(event => {
        element.dispatchEvent(new CustomEvent('mydragmove', { detail: event }));
      })
    ),
    dragEnd$.pipe(
      tap(event => {
        element.dispatchEvent(new CustomEvent('mydragend', { detail: event }));
      })
    )
  ]).subscribe();

  dragMove$.subscribe(move => {
    const offsetX = move.originalEvent.x - move.startOffsetX;
    const offsetY = move.originalEvent.y - move.startOffsetY;
    element.style.left = offsetX + 'px';
    element.style.top = offsetY + 'px';
  });
}

Array.from(draggableElements).forEach((element, i) => {
  element.addEventListener('mydragstart', () =>
    console.log(`mydragstart on element #${i}`)
  );

  element.addEventListener('mydragmove', event =>
    console.log(
      `mydragmove on element #${i}`,
      `delta: (${event.detail.deltaX}, ${event.detail.deltaY})`
    )
  );

  element.addEventListener('mydragend', event =>
    console.log(
      `mydragend on element #${i}`,
      `delta: (${event.detail.deltaX}, ${event.detail.deltaY})`
    )
  );
});

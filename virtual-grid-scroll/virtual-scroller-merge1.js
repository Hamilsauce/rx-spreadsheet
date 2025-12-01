import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils, sleep } = ham;

await sleep(100)

// const container = document.getElementById("grid-container");
const container = document.querySelector('.worksheet')
// const inner = document.getElementById("grid-inner");
const inner = document.getElementById('worksheet-body-inner');
// const container = document.getElementById('worksheet-body');
const wksCorner = document.getElementById('worksheet-headers-corn');
const wksColumnHeaders = document.getElementById('worksheet-headers-row');
const wksRowHeaders = document.getElementById('worksheet-headers-col');

inner.innerHTML = ''
wksCorner.innerHTML = ''
wksRowHeaders.innerHTML = ''
wksColumnHeaders.innerHTML = ''

const totalRows = 10000;
const totalCols = 10000;
const cellWidth = 90;
const cellHeight = 30;

wksColumnHeaders.style.width = `${(totalRows * cellWidth)}px`;
wksRowHeaders.style.height = `${totalCols * cellWidth}px`;
inner.style.width = `${totalCols * cellWidth}px`;
inner.style.height = `${totalRows * cellHeight}px`;

const buffer = 4; // extra rows/cols around viewport
let headerRowCells = [];
let headerColumnCells = [];
let cells = [];

let start
let end
const domParser = new DOMParser();
const render = () => {
  start = performance.now()
  const scrollTop = container.scrollTop;
  const scrollLeft = container.scrollLeft;
  
  const viewportRows = Math.ceil(container.clientHeight / cellHeight);
  const viewportCols = Math.ceil(container.clientWidth / cellWidth);
  
  const startRow = Math.max(0, Math.floor(scrollTop / cellHeight) - buffer);
  const endRow = Math.min(totalRows, startRow + viewportRows + buffer * 2);
  
  const startCol = Math.max(0, Math.floor(scrollLeft / cellWidth) - buffer);
  const endCol = Math.min(totalCols, startCol + viewportCols + buffer * 2);
  
  // Recycle old DOM
  if (cells.length) {
    cells.forEach(c => c.remove());
  }
  if (headerRowCells.length) {
    headerRowCells.forEach(c => c.remove());
  }
  if (headerColumnCells.length) {
    headerColumnCells.forEach(c => c.remove());
  }
  
  let index = 0
  
  cells = [];
  headerRowCells = [];
  headerColumnCells = [];
  
  // for (let c = startCol; c < endCol; c++) {
  //   let colHeader = headerColumnCells[c]
  //   if (!colHeader) {
  //     colHeader = document.createElement('div');
  //     colHeader.className = 'header';
  //     headerColumnCells.push(colHeader);
  //   }
  //   colHeader.innerHTML = `<div class="header-value">${c+1}</div><div class="header-handle"></div>`;
  //   colHeader.style.top = `${c * cellHeight}px`;
  //   wksColumnHeaders.appendChild(colHeader);
  // }
  
  // Column Headers
  for (let c = startCol; c < endCol; c++) {
    let colHeader = headerColumnCells[c]
    if (!colHeader) {
      colHeader = document.createElement('div');
      colHeader.className = 'header';
      headerColumnCells.push(colHeader);
    }
    colHeader.innerHTML = `<div class="header-value">${c}</div><div class="header-handle"></div>`;
    colHeader.style.top = `${c * cellWidth}px`;
    wksColumnHeaders.appendChild(colHeader);
  }
  
  // Row Headers
  // for (let c = startCol; c < endCol; c++) {
  //   let colHeader = headerColumnCells[c]
  //   if (!colHeader) {
  //     colHeader = document.createElement('div');
  //     colHeader.className = 'header';
  //     headerColumnCells.push(colHeader);
  //   }
  //   colHeader.innerHTML = `<div class="header-value">${c}</div><div class="header-handle"></div>`;
  //   colHeader.style.top = `${c * cellWidth}px`;
  //   wksRowHeaders.appendChild(colHeader);
  // }
  
  // Cells
  for (let r = startRow; r < endRow; r++) {
    
    for (let c = startCol; c < endCol; c++) {
      let cell = cells[index]
      if (!cell) {
        cell = document.createElement("div");
        cell.className = "cell";
        cells.push(cell);
      }
      cell.style.top = `${r * cellHeight}px`;
      cell.style.left = `${(c * cellWidth) + 1}px`;
      cell.textContent = `${r},${c}`;
      cell.dataset.address = `${r}_${c}`
      
      inner.appendChild(cell);
      index += 1;
    }
  }
  
  
  // for (let r = startRow; r < endRow; r++) {
  //   let rowHeader = headerColumnCells[r]
  //   if (!rowHeader) {
  //     rowHeader = document.createElement('div');
  //     rowHeader.className = 'header';
  //     headerRowCells.push(rowHeader);
  //   }
  //   rowHeader.innerHTML = `<div class="header-value">${r}</div><div class="header-handle"></div>`;
  //   rowHeader.style.top = `${r * cellWidth}px`;
  //   wksRowHeaders.appendChild(rowHeader);
  
  //   // for (let c = startCol; c < endCol; c++) {
  //   //   let cell = cells[index]
  //   //   if (!cell) {
  //   //     cell = document.createElement("div");
  //   //     cell.className = "cell";
  //   //     cells.push(cell);
  //   //   }
  //   //   cell.style.top = `${r * cellHeight}px`;
  //   //   cell.style.left = `${(c * cellWidth) + 1}px`;
  //   //   cell.textContent = `${r},${c}`;
  //   //   cell.dataset.address = `${r}_${c}`
  
  //   //   inner.appendChild(cell);
  //   //   index += 1;
  //   // }
  
  //   // console.warn('row loop: ',cells.length)
  //   // console.warn('row')
  // }
  
  
  
  // console.warn('final: ', cells.length)
  // console.warn(cells.length)
  
  // end = performance.now()
  // console.warn(end - start)
}

const render1 = () => {
  start = performance.now()
  const scrollTop = container.scrollTop;
  const scrollLeft = container.scrollLeft;
  
  const viewportRows = Math.ceil(container.clientHeight / cellHeight);
  const viewportCols = Math.ceil(container.clientWidth / cellWidth);
  
  const startRow = Math.max(0, Math.floor(scrollTop / cellHeight) - buffer);
  const endRow = Math.min(totalRows, startRow + viewportRows + buffer * 2);
  
  const startCol = Math.max(0, Math.floor(scrollLeft / cellWidth) - buffer);
  const endCol = Math.min(totalCols, startCol + viewportCols + buffer * 2);
  
  // Recycle old DOM
  if (cells.length) {
    cells.forEach(c => c.remove());
  }
  let index = 0
  
  cells = [];
  for (let r = startRow; r < endRow; r++) {
    
    for (let c = startCol; c < endCol; c++) {
      let cell = cells[index]
      if (!cell) {
        cell = document.createElement("div");
        cell.className = "cell";
        cells.push(cell);
      }
      cell.style.top = `${r * cellHeight}px`;
      cell.style.left = `${c * cellWidth}px`;
      cell.textContent = `${r},${c}`;
      cell.dataset.address = `${r}_${c}`
      
      inner.appendChild(cell);
      index += 1;
    }
    
    // console.warn('row loop: ',cells.length)
    
    // console.warn('row')
    
  }
  console.warn('final: ', cells.length)
  
  console.warn(cells.length)
  
  // end = performance.now()
  // console.warn(end - start)
}

// const leftBound = document.querySelector('#left-bound');

container.addEventListener("scroll", render);
// container.addEventListener("click", e => {
//   leftBound.scrollIntoView({
//     behavior: 'smooth',
//     // block: 'start'
//   })
// });
render();
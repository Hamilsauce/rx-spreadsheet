const container = document.getElementById("grid-container");
const inner = document.getElementById("grid-inner");

const totalRows = 10000;
const totalCols = 10000;
const cellWidth = 100;
const cellHeight = 30;

inner.style.width = `${totalCols * cellWidth}px`;
inner.style.height = `${totalRows * cellHeight}px`;

const buffer = 4; // extra rows/cols around viewport
let cells = [];

let start
let end

function render() {
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
      index +=1;
    }
    
    // console.warn('row loop: ',cells.length)

    // console.warn('row')

  }
  console.warn('final: ',cells.length)

    console.warn(cells.length)

  // end = performance.now()
  // console.warn(end - start)
}

const leftBound = document.querySelector('#left-bound');

container.addEventListener("scroll", render);
container.addEventListener("click", e => {
  leftBound.scrollIntoView({
    behavior: 'smooth',
    // block: 'start'
  })
});
render();
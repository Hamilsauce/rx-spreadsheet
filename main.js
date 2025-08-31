import { Application } from './components/Application.js';
import { computed, ref, watch } from 'vue';
import { TileSelector, getTileSelector } from './selection-box/SelectionBox.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils, addPanAction } = ham;


const app = new Application();

const fartState = ref('poo')
const farts = computed(() => fartState.value)

const worksheet = document.querySelector('.worksheet');
const worksheetBody = worksheet.querySelector('.cellgroup[data-area=body]');
// const canvas = document.getElementById('canvas');
// const scrollContainer = canvas.querySelector('g.scroll-container');

worksheetBody.addEventListener('scroll', (e) => {
  const x = worksheet.scrollLeft;
  const y = worksheet.scrollTop;
  console.warn('x,y', x, y)
  scrollContainer.setAttribute('transform', `translate(${-x},${-y})`);
});


// const selector = new TileSelector(canvas)


watch(farts, (oldV, newV) => {
  console.warn('fart update', oldV, newV)
})


setTimeout(() => {
  
const canvas = document.querySelector('#canvas');
const panAction$ = addPanAction(canvas, (e) => {
console.warn('e', e)
  
})
panAction$
.subscribe()
  // app.dom.addEventListener('pointerdown', e => {
  //   console.warn('pointerdown')
  //   e.preventDefault()
  // });
  // app.dom.addEventListener('pointermove', e => {
  //   console.warn('pointermove')
  //   e.preventDefault()
  // });
  // app.dom.addEventListener('pointerup', e => {
  //   console.warn('pointerup')
  //   e.preventDefault()
  // });
  
  // fartState.value = 'fuck ass piss' 
  // console.log('app',[...[...app.components][1][1].components][0][1]);
}, 500)
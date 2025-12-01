import { Application } from '../components/Application.js';
import { computed, ref, watch } from 'vue';

const fartState = ref('poo')
const farts = computed(() => fartState.value)

console.warn('farts', farts.value)

const app = new Application();

watch(farts, (oldV, newV) => {
  console.warn('fart update', oldV, newV)
})


setTimeout(() => {
// fartState.value = 'fuck ass piss' 
  // console.log('app',[...[...app.components][1][1].components][0][1]);
}, 500)
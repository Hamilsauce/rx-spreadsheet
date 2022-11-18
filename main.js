// import {Application} from './App';
import { Application } from './components/Application.js';

const app = new Application();

// console.log('app', app)
const test = 'repeat(60, 90px)'
const digits = test.replace(/\D+/g, '')

// console.warn('digits', digits)

const str =
  'Hi there, my name is repeat(61, 90px), I am [age] years old, and I work in the field of [profession].';

// const matches = +str.match(/(?<=\().+?(?=\,)/)[0]
// console.log(matches);

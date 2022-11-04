const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')


console.time('sheet')
// const table = document.querySelector("table")
const table2 = document.createElement("table")
const thead = table2.createTHead()
const tbody = table2.createTBody()

for (var i = 0; i < 50; i++) {
  let row;

  if (i === 0) {

    row = thead.insertRow(-1);
  } else {
    row = tbody.insertRow(-1);
    
  }

  // var row = document.querySelector("table").insertRow(-1);
  for (var j = 0; j < 30; j++) {
    var letter = String.fromCharCode("A".charCodeAt(0) + j - 1);
    let cell = row.insertCell(-1)
    cell.innerHTML = i && j ? "<input id='" + letter + i + "'/>" : i || letter;
    if (cell.textContent == letter) {

    }
  }
}
appBody.innerHTML = ''
appBody.append(table2)
console.timeEnd('sheet')

let DATA = {},
  INPUTS = [].slice.call(document.querySelectorAll("input"));

INPUTS.forEach((elm) => {
  const data = DATA
  elm.onfocus = function(e) {
    e.target.value = localStorage[e.target.id] || "";
  };
  elm.onblur = function(e) {
    localStorage[e.target.id] = e.target.value;
    computeAll();
  };
  const getter = () => {
    var value = localStorage[elm.id] || "";
    if (value.charAt(0) == "=") {
      // with(DATA)
      // const data = Object.assign({}, DATA)
      // const value2 =DATA.value
      // console.log('value  ', value)
      // const {value} = DATA
      return eval(value.substring(1));
      // return eval(value.substring(1));
    } else { return isNaN(parseFloat(value)) ? value : parseFloat(value); }
  };
  // const getter2 = getter.bind(data)
  Object.defineProperty(data, elm.id, { get: getter });
  Object.defineProperty(data, elm.id.toLowerCase(), { get: getter });
});

(window.computeAll = () => {
  INPUTS.forEach((elm) => { try { elm.value = DATA[elm.id]; } catch (e) {} });
})();
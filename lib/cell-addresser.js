import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { download, date, array, utils, text } = ham;


const alphabet = utils.alphabet();

// const buildAddress = (char, targetString = '') => {
//   return char ? `${targetString}${char}`.trim() : targetString || '';
// };

const buildAddress = (initString = '') => {
  let address = initString;

  return (addressPart) => {
    address = addressPart ? `${address}${addressPart}`.trim() : (address || '');

    return address;
  }
};
// hrows().forEach((r, i) => {
//   if (i >= 26) {
//     let nameLength = Math.floor(i / 26) - 1;
//     let remainder = (i % 26)
//     r.textContent = alphabet[nameLength] + (alphabet[remainder] || '') || '';
//   }

//   else { r.textContent = alphabet[i] }

//   columnNames.push(r.textContent);
// });

// hcols().forEach((c, i) => {
//   c.textContent = i + 1;
//   rowIds.push(c.textContent);
// });


export class ColumnNamer {
  #charLength = 1;

  alphabet = utils.alphabet();

  constructor() {

  }


  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

export const getCellAddress = (rowIndex, columnIndex) => {
  if (!(rowIndex && columnIndex)) return;
  // columnIndex = columnIndex === 0 ? 1 : columnIndex
  let address = ''
  let builder = buildAddress('');
    let remainder = (columnIndex % 26)

  if (columnIndex >= 26) {
    let nameLength = Math.floor(columnIndex / 26);


    for (let charIndex = 0; charIndex <= nameLength; charIndex++) {

      address = builder(alphabet[charIndex])

    }

    // address = builder(remainder)
      address = builder(alphabet[remainder])
    // let col = alphabet[nameLength] + (alphabet[remainder] || '') || '';
    // address = builder((alphabet[remainder] || '') || '')
    // address = appendChar(
    //   alphabet[nameLength] + (alphabet[remainder] || '') || '',
    //   address
    // );
  }
  else {
    address = builder(alphabet[columnIndex])
  }
  address = builder(rowIndex)
  return address

  // return appendChar(rowIndex, address);
}

let grid = document.querySelector('#game');

let guessesAllowed = 3;
let wordLength = 4;

let fragment = document.createDocumentFragment();

const generateGrid = () => {
  Array.from({ length: guessesAllowed }).forEach(() => {
    let row = document.createElement('div');
    row.classList.add('row');

    Array.from({ length: wordLength }).forEach(() => {
      let tile = document.createElement('div');
      tile.classList.add('tile');

      row.appendChild(tile);
    });

    fragment.appendChild(row);
  });

  grid.appendChild(fragment);  
}

// init
generateGrid();

const grid = document.querySelector('#game');

const guessesAllowed = 3;
const wordLength = 4;

const fragment = document.createDocumentFragment();

const generateGrid = () => {
  Array.from({ length: guessesAllowed }).forEach(() => {
    const row = document.createElement('div');
    row.classList.add('row');

    Array.from({ length: wordLength }).forEach(() => {
      const tile = document.createElement('div');
      tile.classList.add('tile');

      row.appendChild(tile);
    });

    fragment.appendChild(row);
  });

  grid.appendChild(fragment);  
}

// init
generateGrid();

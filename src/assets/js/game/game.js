import Alpine from '@alpinejs/csp';
import { Tile } from './Tile';
import { allWords, theWords } from './words';

export function game(num) {
  let guessesAllowed = 3;

  if (num !== undefined) {
    if (typeof num === 'number' && (num >= 3 && num <= 10)) {
      guessesAllowed = num;
    } else {
      console.warn(`Invalid argument passed to game: ${num}. Must be a number between 3–10.`);
    }
  }

  return {
    guessesAllowed: guessesAllowed,
    theWord: theWords[Math.floor(Math.random() * theWords.length)],
    board: [],
    currentRowIndex: 0,
    state: 'active',
    errors: false,
    message: '',
    secret: Alpine.$persist(''),

    letters: [
      'QWERTYUIOP'.split(''),
      'ASDFGHJKL'.split(''),
      ['Enter', ...'ZXCVBNM'.split(''), 'Backspace'],
    ],

    get currentRow() {
      return this.board[this.currentRowIndex];
    },

    get currentGuess() {
      return this.currentRow.map((tile) => tile.letter).join('');
    },

    get remainingGuesses() {
      return this.guessesAllowed - this.currentRowIndex - 1;
    },

    init() {
      this.board = Array.from({ length: this.guessesAllowed }, () => {
        return Array.from({ length: this.theWord.length }, (_, index) => new Tile(index));
      });
    },

    matchingTileForKey(key) {
      return this.board
        .flat()
        .filter((tile) => tile.status)
        .sort((_, tile) => (tile.status === 'correct' ? 1 : -1))
        .find((tile) => tile.letter === key.toLowerCase());
    },

    keyStatus(key) {
      return this.matchingTileForKey(key) ? this.matchingTileForKey(key).status : null;
    },

    onKeyPress(key) {
      this.message = '';
      this.errors = false;

      if (/^[A-z]$/.test(key)) {
        this.fillTile(key);
      } else if (key === 'Backspace') {
        this.emptyTile();
      } else if (key === 'Enter') {
        this.submitGuess();
      }
    },

    fillTile(key) {
      for (const tile of this.currentRow) {
        if (!tile.letter) {
          tile.fill(key);
          break;
        }
      }
    },

    emptyTile() {
      for (const tile of [...this.currentRow].reverse()) {
        if (tile.letter) {
          tile.empty();
          break;
        }
      }
    },

    submitGuess() {
      if (this.currentGuess.length < this.theWord.length) {
        return;
      }

      if (!allWords.includes(this.currentGuess)) {
        this.errors = true;
        this.message = 'Not a word.';
        return;
      }

      Tile.updateStatusesForRow(this.currentRow, this.theWord);

      if (this.currentGuess === this.theWord) {
        this.state = 'complete';
        this.message = 'You win!';
      } else if (this.remainingGuesses <= 0) {
        this.state = 'complete';
        this.message = `Game over. The word was: ${this.theWord.toUpperCase()}`;
      } else {
        this.currentRowIndex++;
        this.message = 'Incorrect';
      }
    },
  };
}

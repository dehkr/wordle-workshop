import { Tile } from './Tile';
import words from './words';

export const game = () => ({
  guessesAllowed: 3,
  theWord: 'cat',
  currentRowIndex: 0,
  state: 'active',
  errors: false,
  message: '',

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

    if (!words.includes(this.currentGuess)) {
      this.errors = true;
      this.message = 'Not a word.';
      return;
    }

    Tile.updateStatusesForRow(this.currentRow, this.theWord);

    if (this.currentGuess === this.theWord) {
      this.state = 'complete';
      this.message = 'You win!';
      return;
    }

    if (this.remainingGuesses <= 0) {
      this.state = 'complete';
      this.message = `Game over. The word was: ${this.theWord}`;
      return;
    }

    this.currentRowIndex++;
    this.message = 'Nope';
  },
});

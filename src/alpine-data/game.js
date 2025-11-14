import { Tile } from './Tile';

export const game = () => ({
  guessesAllowed: 3,
  theWord: 'cat',
  wordLength: 3,
  currentRowIndex: 0,
  
  get currentGuess() {
    return this.currentRow.map(tile => tile.letter).join('');
  },

  init() {
    this.board = Array.from({ length: this.guessesAllowed }, () => {
      return Array.from({ length: this.wordLength }, () => new Tile());
    });
  },

  onKeyPress(key) {
    if (/^[A-z]$/.test(key)) {
      this.fillTile(key);
    } else if (key === 'Enter') {
      this.submitGuess();
    }
  },

  fillTile(key) {
    for (let tile of this.currentRow) {
      if (!tile.letter) {
        tile.fill(key);
        break;
      }
    }
  },

  submitGuess() {
    let guess = this.currentGuess
    if (this.currentGuess.length < this.wordLength) {
      return;
    }
    if (guess === this.theWord) {
      alert('You win!');
    } else {
      alert('Nope');
      this.currentRowIndex++;
    }
  },

  get currentRow() {
    return this.board[this.currentRowIndex];
  },
});

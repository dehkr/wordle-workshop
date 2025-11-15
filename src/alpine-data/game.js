import { Tile } from './Tile';

export const game = () => ({
  guessesAllowed: 3,
  theWord: 'cat',
  currentRowIndex: 0,
  state: 'active',
  message: '',
  
  get currentGuess() {
    return this.currentRow.map(tile => tile.letter).join('');
  },

  init() {
    this.board = Array.from({ length: this.guessesAllowed }, () => {
      return Array.from({ length: this.theWord.length }, () => new Tile());
    });
  },

  onKeyPress(key) {
    this.message = '';
    
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

    if (this.currentGuess.length < this.theWord.length) {
      return;
    }

    if (guess === this.theWord) {
      this.message = 'You win!';
    } else if (this.guessesAllowed === this.currentRowIndex + 1) {
      this.message = 'Game over. You lose.';
      this.state = 'complete';
    } else {
      this.message = 'Nope';
      this.currentRowIndex++;
    }
  },

  get currentRow() {
    return this.board[this.currentRowIndex];
  },
});

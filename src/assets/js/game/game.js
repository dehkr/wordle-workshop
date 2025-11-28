// import Alpine from '@alpinejs/csp';
import { Tile } from './Tile';
import { allWords, theWords } from './words';

export function game(num) {
  let guessesAllowed = 3;

  if (num !== undefined) {
    if (typeof num === 'number' && num >= 3 && num <= 10) {
      guessesAllowed = num;
    } else {
      console.warn(
        `Invalid argument passed to game: ${num}. Must be a number between 3–10.`,
      );
    }
  }

  return {
    guessesAllowed: guessesAllowed,
    theWord: '',
    board: [],
    currentRowIndex: 0,
    state: 'IN_PROGRESS', // IN_PROGRESS, WIN, LOSE
    errors: false,
    message: '',
    // gameState: Alpine.$persist({
    //   guesses: [],
    //   currentRowIndex: 0,
    //   status: 'IN_PROGRESS', 
    // }),

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

    get gameOver() {
      return this.state !== 'IN_PROGRESS';
    },

    init() {
      this.newGame();
    },

    newGame() {
      this.state = 'IN_PROGRESS';
      this.message = '';
      this.theWord = this.selectRandomWord();
      this.generateBoard();
      this.currentRowIndex = 0;
    },

    generateBoard() {
      this.board = Array.from({ length: this.guessesAllowed }, () => {
        return Array.from({ length: this.theWord.length }, (_, index) => new Tile(index));
      });
    },

    selectRandomWord() {
      return theWords[Math.floor(Math.random() * theWords.length)];
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

    rowStatus(index) {
      return {
        current: this.currentRowIndex === index,
        invalid: this.currentRowIndex === index && this.errors,
      };
    },

    onKeyPress(key) {
      if (this.state === 'IN_PROGRESS') {
        if (/^[A-z]$/.test(key)) {
          this.fillTile(key);
        } else if (key === 'Backspace') {
          if (this.errors) {
            this.message = '';
            this.errors = false;
          }
          this.emptyTile();
        } else if (key === 'Enter') {
          this.submitGuess();
        }
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
      // first check if row is full of letters
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
        this.doWin();
      } else if (this.remainingGuesses <= 0) {
        this.doLose();
      } else {
        this.doNextGuess();
      }
    },

    doNextGuess() {
      this.currentRowIndex++;
    },

    doWin() {
      this.state = 'WIN';
      this.message = 'You win!';
    },

    doLose() {
      this.state = 'LOSE';
      this.message = `Sorry, the word is "${this.theWord.toUpperCase()}"`;
    },
  };
}

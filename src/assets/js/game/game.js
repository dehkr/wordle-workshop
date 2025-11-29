import Alpine from '@alpinejs/csp';
import { Tile } from './Tile';
import { allWords, theWords } from './words';

export function game(num) {
  let numGuesses = 3;

  if (num !== undefined) {
    if (typeof num === 'number' && num >= 3 && num <= 10) {
      numGuesses = num;
    } else {
      console.warn(
        `Invalid argument passed to game: ${num}. Must be a number between 3–10.`,
      );
    }
  }

  return {
    /**
     * Array of rows of tile objects defining the game board
     * @type {Array<Array<Tile>>}
     */
    board: [],
    /**
     * Stores game state and persists in local storage
     * @type {{status: 'NONE' | 'IN_PROGRESS' | 'WIN' | 'LOSE'}}
     */
    gameState: Alpine.$persist({
      currentRowIndex: 0,
      errors: false,
      gameId: 0,
      guesses: [],
      message: '',
      numGuesses: numGuesses,
      status: 'NONE', 
    }),

    letters: [
      'QWERTYUIOP'.split(''),
      'ASDFGHJKL'.split(''),
      ['Enter', ...'ZXCVBNM'.split(''), 'Backspace'],
    ],

    get currentRow() {
      return this.board[this.gameState.currentRowIndex];
    },

    get currentGuess() {
      return this.currentRow.map((tile) => tile.letter).join('');
    },

    get remainingGuesses() {
      return this.gameState.numGuesses - this.gameState.currentRowIndex - 1;
    },

    get canPlayAgain() {
      return this.gameState.status === 'WIN' || this.gameState.status === 'LOSE';
    },

    get theWord() {
      return theWords[this.gameState.gameId];
    },

    get message() {
      return this.gameState.message;
    },

    init() {
      if (this.gameState.status === 'NONE') {
        this.newGame();
      } else {
        this.restoreGame();
      }
    },

    newGame() {
      this.gameState.message = '';
      this.gameState.currentRowIndex = 0;
      this.gameState.gameId = this.generateGameId();
      this.gameState.guesses = [];
      this.gameState.status = 'IN_PROGRESS';
      this.generateBoard();
    },

    restoreGame() {
      if (this.gameState.errors === true) {
        this.gameState.message = '';
        this.gameState.errors = false;
      }
      this.generateBoard();
    },

    generateBoard() {
      this.board = Array.from({ length: this.gameState.numGuesses }, () => {
        return Array.from({ length: this.theWord.length }, (_, index) => {
          return new Tile(index);
        });
      });

      const guesses = this.gameState.guesses;

      // if guesses exist, fill tiles with letters then update status
      if (guesses.length > 0) {
        guesses.forEach((guess, index) => {
          const row = this.board[index];
          for (let tile = 0; tile < row.length; tile++) {
            row[tile].letter = guess.charAt(tile);
          }
          Tile.updateStatusesForRow(row, this.theWord);
        });
      }
    },

    generateGameId() {
      return Math.floor(Math.random() * theWords.length);
    },

    isCorrectWord(guess) {
      return guess === theWords[this.gameState.gameId];
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
        current: this.gameState.currentRowIndex === index,
        invalid: this.gameState.currentRowIndex === index && this.gameState.errors,
      };
    },

    onKeyPress(key) {
      if (this.gameState.status === 'IN_PROGRESS') {
        if (/^[A-z]$/.test(key)) {
          this.fillTile(key);
        } else if (key === 'Backspace') {
          if (this.gameState.errors) {
            this.gameState.message = '';
            this.gameState.errors = false;
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
        this.gameState.errors = true;
        this.gameState.message = 'Not a word.';
        return;
      }

      // Confirmed valid word submission at this point
      // Store guess in gameState guesses array
      this.gameState.guesses.push(this.currentGuess);

      Tile.updateStatusesForRow(this.currentRow, this.theWord);

      if (this.isCorrectWord(this.currentGuess)) {
        this.doWin();
      } else if (this.remainingGuesses <= 0) {
        this.doLose();
      } else {
        this.doNextGuess();
      }
    },

    doNextGuess() {
      this.gameState.currentRowIndex++;
    },

    doWin() {
      this.gameState.status = 'WIN';
      this.gameState.message = 'You win!';
    },

    doLose() {
      this.gameState.status = 'LOSE';
      this.gameState.message = `Sorry, the word is "${this.theWord.toUpperCase()}"`;
    },
  };
}

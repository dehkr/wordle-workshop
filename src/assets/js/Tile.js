export class Tile {
  letter = '';
  status = '';

  constructor(position) {
    this.position = position;
  }

  static updateStatusesForRow(row, theWord) {
    // initial status update
    for (const tile of row) {
      tile.updateStatus(theWord);
    }

    // identify tiles that need status changed
    const tilesToDowngrade = row.filter((tile) => {
      return (
        tile.status === 'present' &&
        row.some((t) => t.letter === tile.letter && t.status === 'correct')
      );
    });

    // change status
    for (const tile of tilesToDowngrade) {
      tile.status = 'absent';
    }
  }

  updateStatus(theWord) {
    if (!theWord.includes(this.letter)) {
      this.status = 'absent';
      return;
    }

    if (this.letter === theWord[this.position]) {
      this.status = 'correct';
      return;
    }

    this.status = 'present';
  }

  fill(key) {
    this.letter = key.toLowerCase();
  }

  empty() {
    this.letter = '';
  }
}

export class Tile {
  letter = '';
  status = '';

  fill(key) {
    this.letter = key.toLowerCase();
  }

  empty() {
    this.letter = '';
  }
}
import { html } from 'hono/html';
import { BaseLayout } from '../layouts/BaseLayout';
import { nl } from '../utils/formatting';

export function HomePage() {
  const pageContent = html`<main
    class="main"
    x-data="game(4)"
    x-on:keyup.window="onKeyPress($event.key)"
  >
    <h1 class="logo" aria-label="TryCat">
      <img src="images/trycat-logotype.svg" alt="TryCat">
    </h1>
    <div class="output">
      <p class="message" x-text="message"></p>
      <template x-if="canPlayAgain">
        <button type="button" class="new-game" x-on:click="newGame">New game</button>
      </template>
    </div>
    <div id="game">
      <template x-for="(row, index) in board">
        <div class="row" x-bind:class="rowStatus(index)">
          <template x-for="tile in row">
            <div class="tile" x-bind:class="tile.status" x-text="tile.letter"></div>
          </template>
        </div>
      </template>
    </div>
    <div
      id="keyboard"
      x-on:click.stop="$event.target.matches('button') && onKeyPress($event.target.textContent)"
    >
      <template x-for="row in letters">
        <div class="row">
          <template x-for="key in row">
            <button
              type="button"
              class="key"
              x-bind:class="keyStatus(key)"
              x-text="key"
            ></button>
          </template>
        </div>
      </template>
    </div>
  </main>`;

  return BaseLayout({
    title: 'Play FatCat',
    description: 'The most fun wordle clone in the world.',
    styles: html`<link rel="preconnect" href="https://fonts.googleapis.com">${nl(2)}<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>${nl(2)}<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap">${nl(2)}`,
    children: pageContent,
  });
};

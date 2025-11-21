import { html } from 'hono/html';
import { BaseLayout } from '../layouts/BaseLayout';
import { nl } from '../utils/formatting';

export const HomePage = () => {
  const pageContent = html`<main x-data="game" @keyup.window="onKeyPress($event.key)">
    <h1 class="logo" aria-label="TryCat">
      <img src="images/trycat-logo.svg" alt="TryCat logo">
      <output class="result" x-text="message"></output>
    </h1>
    <div id="game">
      <template x-for="(row, index) in board">
        <div
          class="row"
          x-bind:class="{
            'current': currentRowIndex === index,
            'invalid': currentRowIndex === index && errors,
          }"
        >
          <template x-for="tile in row">
            <div
              class="tile"
              x-bind:class="tile.status"
              x-text="tile.letter"
            ></div>
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
              x-bind:class="matchingTileForKey(key)?.status"
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
}

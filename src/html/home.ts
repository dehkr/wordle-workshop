import { html } from 'hono/html';

export const home = () => html`
  <main x-data="game" @keyup.window="onKeyPress($event.key)">
    <h1 class="logo" aria-label="TryCat">
      <img src="images/trycat-logo.svg" alt="TryCat logo">
      <output class="result" x-text="message"></output>
    </h1>
    <div id="game">
      <template x-for="(row, index) in board">
        <div
          class="row"
          :class="{
            'current': currentRowIndex === index,
            'invalid': currentRowIndex === index && errors,
          }"
        >
          <template x-for="tile in row">
            <div class="tile" :class="tile.status" x-text="tile.letter"></div>
          </template>
        </div>
      </template>
    </div>
    <div
      id="keyboard"
      @click.stop="$event.target.matches('button') && onKeyPress($event.target.textContent)"
    >
      <template x-for="row in letters">
        <div class="row">
          <template x-for="key in row">
            <button
              class="key"
              :class="matchingTileForKey(key)?.status"
              type="button"
              x-text="key"
            ></button>
          </template>
        </div>
      </template>
    </div>
  </main>
`;

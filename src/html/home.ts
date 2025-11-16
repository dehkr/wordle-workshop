import { html } from 'hono/html';

export const home = () => html`
  <main x-data="game" @keyup.window="onKeyPress($event.key)">
    <h1 class="logo" aria-label="TryCat">
      <img src="images/trycat-logo.svg" alt="TryCat logo" />
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
    <output class="result" x-text="message"></output>
  </main>
`;

import { html } from 'hono/html';

export const home = () => html`
  <main x-data="game" @keyup.window="onKeyPress($event.key)">
    <div id="game">
      <template x-for="row in board">
        <div class="row">
          <template x-for="tile in row">
            <div class="tile" x-text="tile.letter"></div>
          </template>
        </div>
      </template>
    </div>
    <output class=result x-text="message"></output>
  </main>
`;
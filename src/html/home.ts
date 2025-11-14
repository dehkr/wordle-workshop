import { html } from 'hono/html';

export const home = () => html`
  <div id="game" x-data="game" @keyup.window="onKeyPress($event.key)">
    <template x-for="row in board">
      <div class="row">
        <template x-for="tile in row">
          <div class="tile" x-text="tile.letter"></div>
        </template>
      </div>
    </template>
  </div>
`;
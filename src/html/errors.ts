import { html } from 'hono/html';

export const notFound = () => html`
  <div>
    <pre>404</pre>
    <p>Nothing here. Go <a href="/">home</a>.</p>
  </div>
`;

export const serverError = (errName: string, errMessage: string) => html`
  <div>
    <pre>Server Error | 500</pre>
    <h3>${errName}</h3>
    <p>${errMessage}</p>
  </div>
`;

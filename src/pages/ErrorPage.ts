import { html } from 'hono/html';
import { BaseLayout } from '../layouts/BaseLayout';

export const ErrorPage = (errName: string, errMessage: string) => {
  const pageContent = html`<div>
    <pre>Server Error | 500</pre>
    <h3>${errName}</h3>
    <p>${errMessage}</p>
  </div>`;

  return BaseLayout({
    title: 'Server Error',
    children: pageContent,
  });
}

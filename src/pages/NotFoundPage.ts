import { html } from 'hono/html';
import { BaseLayout } from '../layouts/BaseLayout';

export function NotFoundPage() {
  const pageContent = html`<div>
    <pre>404</pre>
    <p>Nothing here. Go <a href="/">home</a>.</p>
  </div>`;

  return BaseLayout({
    title: '404 Error: Not found',
    children: pageContent,
  });
};

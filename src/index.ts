import { Hono } from 'hono';
import { html } from 'hono/html';
import { base, type SiteData } from './html/base';
import { home } from './html/home';
import { notFound, serverError } from './html/errors';

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => {
  return c.html(
    base({ title: 'FatCat', body: home() }),
  );
});

app.notFound((c) => {
  return c.html(
    base({ title: 'Page not found', body: notFound() }),
  );
});

app.onError((err, c) => {
  return c.html(
    base({ title: 'Error', body: serverError(err.name, err.message) }),
  );
});

export default app;

import { Hono } from 'hono';
import { base } from './html/base';
import { notFound, serverError } from './html/errors';
import { home } from './html/home';

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

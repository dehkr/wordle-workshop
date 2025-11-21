import { Hono } from 'hono';
import { ErrorPage } from './pages/ErrorPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => {
  return c.html(
    HomePage(),
  );
});

app.notFound((c) => {
  return c.html(
    NotFoundPage(),
  );
});

app.onError((err, c) => {
  return c.html(
    ErrorPage(err.name, err.message),
  );
});

export default app;

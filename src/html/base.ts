import { html } from 'hono/html';
import { type HtmlEscapedString } from 'hono/utils/html';

export type SiteData = {
  title: string;
  body: HtmlEscapedString | Promise<HtmlEscapedString>;
};

export const base = ({ title, body }: SiteData) => html`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="./assets/main.css">
  <script type="module" src="./assets/main.js"></script>
</head>
<body>${body}</body>
</html>
`;

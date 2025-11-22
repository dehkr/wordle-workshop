import { html } from 'hono/html';
import manifest from '../../public/assets/manifest.json';

const assetManifest: Record<string, string> = manifest;

// Return the hashed file name
const getAssetUrl = (assetName: string) => {
  const hashedName = assetManifest[assetName];
  if (!hashedName) {
    throw new Error(`Asset not found in manifest: ${assetName}`);
  }
  return `assets/${hashedName}`;
};

type LayoutProps = {
  title: string;
  description?: string;
  styles?: ReturnType<typeof html>;
  scripts?: ReturnType<typeof html>;
  children: ReturnType<typeof html>;
};

export const BaseLayout = ({
  title,
  description = 'A wordle clone.',
  styles,
  scripts,
  children,
}: LayoutProps) => html`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  ${styles}<link rel="stylesheet" href="${getAssetUrl('main.css')}">
  ${scripts}<script type="module" src="${getAssetUrl('main.js')}"></script>
</head>
<body>
  ${children}
</body>
</html>`;

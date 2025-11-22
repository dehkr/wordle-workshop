export const fmt = {
  r: '\x1b[31m',
  g: '\x1b[32m',
  y: '\x1b[33m',
  b: '\x1b[34m',
  _: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};
export const check = `${fmt.g}✓${fmt._}`;
export const cross = `${fmt.r}✘${fmt._}`;

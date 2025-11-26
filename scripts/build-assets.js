import * as esbuild from 'esbuild';
import fs from 'fs/promises';
import { manifestPlugin } from './manifest-plugin.js';
import { check, cross } from './log-format.js';

const filesToBuild = [
  './src/assets/js/main.js',
  './src/assets/css/main.css',
];
const outDirectory = './public/assets';
const manifestPath = `${outDirectory}/assets.json`;
const isWatchMode = process.argv.includes('--watch');
const isMinify = process.argv.includes('--minify');

async function cleanUp(dirPath) {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
    console.log(`${check} Cleaned up ${dirPath}`);
  } catch (err) {
    console.error(`${cross} Cleanup error: ${err.message}`);
    // Re-throw if not a harmless "does not exist" error
    if (err.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function buildAssets() {
  // esbuild writes over old files in watch mode so only need to clean up once
  await cleanUp(outDirectory);

  const buildCtx = await esbuild.context({
    entryPoints: filesToBuild,
    entryNames: '[name]-[hash]',
    outdir: outDirectory,
    format: 'esm',
    bundle: true,
    minify: isMinify,
    metafile: true,
    plugins: [manifestPlugin(manifestPath)],
  });

  if (isWatchMode) {
    await buildCtx.watch();
    console.log(`${check} Watching...`);
  } else {
    await buildCtx.rebuild();
    buildCtx.dispose();
  }
}

buildAssets().catch((err) => {
  console.error(`${cross} Build process failed: ${err.message}`);
  process.exit(1);
});

import * as esbuild from 'esbuild';
import fs from 'fs/promises';
import path from 'path';

const outdir = './public/assets';
const manifestPath = `${outdir}/manifest.json`;
const isWatchMode = process.argv.includes('--watch');

// Delete the assets folder and contents
async function cleanUp(dirPath) {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
    console.log(`Cleaned up ${dirPath} successfully`);
  } catch (error) {
    console.error(`Cleanup error: ${error.message}`);
    // Re-throw the error if it's not a harmless "does not exist" error
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function writeJsonFile(path, data) {
  await fs.writeFile(path, JSON.stringify(data, null, 2));
  console.log('Assets manifest generated:\n', data);
}

// Plugin to generate an assets manifest file on each build
let manifestPlugin = {
  name: 'manifest',
  setup(build) {
    build.onEnd((result) => {
      // console.log(result.metafile.outputs);
      const manifestData = {};
      for (const hashedFilePath in result.metafile.outputs) {
        const key = path.basename(result.metafile.outputs[hashedFilePath].entryPoint);
        const value = path.basename(hashedFilePath);
        manifestData[key] = value;
      }
      writeJsonFile(manifestPath, manifestData);
    });
  },
}

async function buildAssets() {
  // In watch mode esbuild writes over old files on rebuild even if file name changes
  // So cleanup only needs to be called once initially
  await cleanUp(outdir);

  const buildCtx = await esbuild.context({
    entryPoints: ['./src/assets/js/main.js', './src/assets/css/main.css'],
    entryNames: '[name]-[hash]',
    outdir: './public/assets',
    format: 'esm',
    bundle: true,
    minify: true,
    metafile: true,
    plugins: [manifestPlugin],
  });

  if (isWatchMode) {
    await buildCtx.watch();
    console.log('(⌐⊙_⊙) watching...');
  } else {
    await buildCtx.rebuild();
    buildCtx.dispose();
  }
}

buildAssets().catch((err) => {
  console.error('Build process failed:', err);
  process.exit(1);
});

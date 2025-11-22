import fs from 'fs/promises';
import path from 'path';
import { check, cross, fmt } from './log-format.js';

export const manifestPlugin = (filePath) => ({
  name: 'manifest',
  setup(build) {
    build.onEnd(async (result) => {
      console.log(
        `${check} Build completed at ${new Date().toLocaleTimeString('en-US')}`,
      );

      if (!result.metafile) {
        console.error(`${cross} Manifest generation failed due to missing metafile`);
        return;
      }

      const manifestData = {};
      const outputs = result.metafile.outputs;

      for (const hashedFilePath in outputs) {
        if (outputs[hashedFilePath].entryPoint) {
          const key = path.basename(outputs[hashedFilePath].entryPoint);
          const value = path.basename(hashedFilePath);
          manifestData[key] = value;
        }
      }

      const manifestJson = JSON.stringify(manifestData, null, 2);

      try {
        await fs.writeFile(filePath, manifestJson);
        console.log(
          `${check} Assets manifest generated\n${fmt.dim}${manifestJson}${fmt._}`,
        );
      } catch (err) {
        throw new Error(`Failed to write manifest file: ${err.message}`);
      }
    });
  },
});

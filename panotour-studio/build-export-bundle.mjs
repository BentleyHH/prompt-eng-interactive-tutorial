import { build } from 'esbuild';
import fs from 'node:fs';
const entry = `
import { Viewer } from './public/vendor/psv-core.module.js';
import { MarkersPlugin } from './public/vendor/psv-markers.module.js';
import { AutorotatePlugin } from './public/vendor/psv-autorotate.module.js';
window.PSV = { Viewer, MarkersPlugin, AutorotatePlugin };
`;
fs.writeFileSync('.export-entry.js', entry);
try {
  const r = await build({
    entryPoints: ['.export-entry.js'],
    bundle: true, format: 'iife', minify: true,
    alias: { three: './public/vendor/three.module.js', '@photo-sphere-viewer/core': './public/vendor/psv-core.module.js' },
    outfile: 'public/vendor/psv-export-bundle.js',
    logLevel: 'info',
  });
} catch (e) {
  console.error('BUILD-FEHLER:');
  for (const m of (e.errors||[])) console.error(' -', m.text, m.location && (m.location.file+':'+m.location.line));
} finally { fs.existsSync('.export-entry.js') && fs.unlinkSync('.export-entry.js'); }

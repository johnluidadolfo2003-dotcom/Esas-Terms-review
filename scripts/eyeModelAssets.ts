import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import type {Plugin} from 'vite';

// Keep the script, graph, packed models and WASM on the app's own origin.
// Mixing CDN versions or blocking a third-party download must not break detection.
export function eyeModelAssets():Plugin {
 const require=createRequire(import.meta.url);
 const root=path.dirname(require.resolve('@mediapipe/face_mesh/package.json'));
 const prefix='/eye-model/0.4.1633559619/';
 const files=fs.readdirSync(root).filter(f=>/\.(js|wasm|data|binarypb)$/.test(f));
 return {name:'same-origin-eye-model',
  configureServer(server){server.middlewares.use((req,res,next)=>{
   const url=(req.url||'').split('?')[0];if(!url.startsWith(prefix))return next();
   const name=url.slice(prefix.length);if(!files.includes(name)){res.statusCode=404;res.end();return;}
   res.setHeader('Content-Type',name.endsWith('.js')?'application/javascript':name.endsWith('.wasm')?'application/wasm':'application/octet-stream');
   fs.createReadStream(path.join(root,name)).pipe(res);
  });},
  generateBundle(){for(const name of files)this.emitFile({type:'asset',fileName:prefix.slice(1)+name,source:fs.readFileSync(path.join(root,name))});},
 };
}

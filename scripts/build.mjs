import './check.mjs';
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dist=resolve(root,'dist');
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
// Publish only the website, never documentation, development scripts or design studies.
for(const name of ['index.html','styles.css','app.js','data.js','preview.js','favicon.svg','robots.txt','assets'])await cp(resolve(root,name),resolve(dist,name),{recursive:true});
await writeFile(resolve(dist,'.nojekyll'),'');
console.log('Ready: dist/ — relative URLs support a GitHub Pages project subpath.');

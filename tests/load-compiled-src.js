// The tests import ../src/*.ts. ts-node cannot load those files with
// TypeScript 7, which no longer exposes the JavaScript compiler API it needs,
// so the tests import the compiled output of `tsc` in dist/ instead. `tsc`
// type-checks the whole project before the tests run.
const path = require('node:path');
const { fileURLToPath } = require('node:url');
const { registerHooks } = require('node:module');

const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src') + path.sep;
const distDir = path.join(root, 'dist');

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL && specifier.startsWith('.')) {
      const target = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
      if (target.startsWith(srcDir)) {
        let compiled = path.join(distDir, path.relative(srcDir, target));
        if (!path.extname(compiled)) compiled += '.js';
        return nextResolve(compiled, context);
      }
    }
    return nextResolve(specifier, context);
  }
});

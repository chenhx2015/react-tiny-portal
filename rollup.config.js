import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';

import pkg from './package.json';

export default {
  input: 'src/portal.js' ,
  output: [ { file: pkg.module,format: 'esm'}, 
            { file: pkg.main, format: 'umd' },
  ],
  plugins: [
    json(),
    resolve(),
    commonjs(),
    babel({ exclude: 'node_modules/**' }),
  ],
  external:  Object.keys(pkg.peerDependencies)
};

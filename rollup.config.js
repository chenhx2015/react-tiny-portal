import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js' ,
  output: [ { file: pkg.module,format: 'esm', exports: 'named'}, 
            { file: pkg.main, format: 'umd' , name: 'reactPortal' , exports: 'named'},
  ],
  plugins: [
    json(),
    resolve(),
    babel({ exclude: 'node_modules/**' }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    terser()
  ],
  external:  Object.keys(pkg.peerDependencies)
};

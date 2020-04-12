import pkg from './package.json';
import React from 'react';
import ReactDOM from 'react-dom';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import url from '@rollup/plugin-url';

import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';


const esm = {
  file: pkg.module,
  format: 'esm',
  exports: 'named'
};

const extensions = ['.js', '.jsx'];
const plugins = [
  resolve({ extensions }),
  commonjs({
    namedExports: {
      react: Object.keys(React),
      'react-dom': Object.keys(ReactDOM)
    }
  }),
  url(),
  serve('examples/'),
  livereload(),
  
];

const path = require('path');
const resolve = function (filePath) {
    return path.join(__dirname, '.', filePath)
}
export default {
    input: resolve('src/main.js'), 
    output: { 
        file: resolve('dist/bundle.js'),
        format: 'umd',
        name: 'usePortal'
    }
};
export default {
    input: 'src' ,
    output:  esm,
    plugins,
    external: isDist ? Object.keys(pkg.peerDependencies) : []
};


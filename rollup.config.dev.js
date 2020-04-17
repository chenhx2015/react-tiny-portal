import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';

import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import React from 'react'
import ReactDOM from 'react-dom'

export default {
  input: 'examples/index.js' ,
  output:  { file: 'examples/bundle.js', format: 'umd' , name: 'reactPortal' },
  plugins: [
    json(),
    resolve(),
    babel({ exclude: 'node_modules/**' }),
    commonjs({
      namedExports: {
        react: Object.keys(React),
        'react-dom': Object.keys(ReactDOM)
      }
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),

    serve('examples/'),
    livereload(),
  ],
};

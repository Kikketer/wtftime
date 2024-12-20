import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-only';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    css({
      output: 'bundle.css'
    }),
    terser()
  ]
};

import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
// import { eslint } from 'rollup-plugin-eslint';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  sourceMap: 'inline',
  output: {
    file: 'dist/index.js',
    name: 'eventQueueJs',
    format: 'umd',
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    // eslint({
    //   exclude: 'node_modules/**',
    // }),
    uglify(),
  ],
};

import babel from 'rollup-plugin-babel';
import html from 'rollup-plugin-html';
import json from 'rollup-plugin-json';
import pkg from './package.json';
import { uglify } from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';
import less from './lib/rollup-plugin-less';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';

let htmlPlugin = html ({
    include: [
        '**/*.svg',
        '**/*.html',
    ],
    htmlMinifierOptions: {
        collapseWhitespace: true,
        quoteCharacter: "'", // reduces escape characters
    },
});

let babelPlugin = babel({
    exclude: 'node_modules/**/*',
});

let lessPlugin = less({
    options: {
        paths: [
            'src/helix-ui/styles',
        ]
    }
});

let eslintPlugin = eslint({
    include: [
        '**/*.js',
    ],
});

// Intro/Outro placed INSIDE the applied dependency function
let intro = `window.addEventListener('WebComponentsReady', function () {`;
let outro = `});`;

let browserOutput = {
    format: 'umd',
    intro,
    outro,
    sourcemap: false,
}

export default [
    // src/browser-entry.js --> dist/helix-ui.browser.js (UMD)
    {
        input: 'src/browser-entry.js',
        output: [
            {
                ...browserOutput,
                file: 'dist/scripts/helix-ui.browser.js',
            }
        ],
        plugins: [
            json(),
            resolve(),
            commonjs(),
            htmlPlugin,
            lessPlugin,
            babelPlugin,
        ],
        watch: {
            include: 'src/**/*',
            exclude: 'node_modules/**',
        },
    },

    // src/browser-entry.js --> dis/helix-ui.browser.min.js (UMD)
    {
        input: 'src/browser-entry.js',
        output: [
            {
                ...browserOutput,
                file: 'dist/scripts/helix-ui.browser.min.js',
            }
        ],
        plugins: [
            json(),
            resolve(),
            commonjs(),
            htmlPlugin,
            lessPlugin,
            eslintPlugin,
            babelPlugin,
            uglify({}, minify),
        ],
        watch: {
            include: 'src/**/*',
            exclude: 'node_modules/**',
        },
    },

    // src/node-entry.js --> dist/helix-ui.js (CJS)
    // src/node-entry.js --> dist/helix-ui.es.js (ESM)
    {
        input: 'src/node-entry.js',
        output: [
            {
                file: pkg.main,
                format: 'cjs',
            },
            {
                file: pkg.module,
                format: 'es',
            }
        ],
        plugins: [
            json(),
            resolve(),
            commonjs(),
            htmlPlugin,
            lessPlugin,
        ],
    },

    // src/polyfills.js --> dis/helix-ui.polyfills.js (IIFE)
    {
        input: 'src/polyfills.js',
        output: [
            {
                file: 'dist/scripts/helix-ui.polyfills.js',
                format: 'iife',
            }
        ],
        plugins: [
            babelPlugin,
        ],
    },

    // src/polyfills.js --> dis/helix-ui.polyfills.min.js (IIFE)
    {
        input: 'src/polyfills.js',
        output: [
            {
                file: 'dist/scripts/helix-ui.polyfills.min.js',
                format: 'iife',
            }
        ],
        plugins: [
            babelPlugin,
            uglify({}, minify),
        ],
    },
]

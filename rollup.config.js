const rollupNodeResolve = require('@rollup/plugin-node-resolve').nodeResolve
const rollupCommonjs = require('@rollup/plugin-commonjs')
const rollupJson = require('@rollup/plugin-json')
const rollupBabel = require('@rollup/plugin-babel')

const rollupPlugins = (isEs5) => {
    return [
        rollupCommonjs({
            // Remove "require('crypto')" and "require('buffer')"" from the bundle.
            ignoreTryCatch: 'remove',
        }),
        rollupNodeResolve({
            moduleDirectories: ['node_modules'],
        }),
        rollupJson(),
        rollupBabel.babel({
            babelHelpers: 'bundled',
        }),
    ]
}

// Mute `The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten` warning and `Error when using sourcemap for reporting an error: ${error.message}`
// The latter warning comes from the first warning
// The this is undefined warnings come for TS boilerplate code where it's expected that this is undefined
const onWarn = (warning, warn) => {
    if (warning.code === 'THIS_IS_UNDEFINED' || warning.code === 'SOURCEMAP_ERROR') return
    warn(warning)
}

/**
 * @type {import('rollup').RollupOptions}
 */
const config = [
    {
        input: ['temp/lcjs-themes/es5/index.js'],
        plugins: rollupPlugins(true),
        external: ['@arction/lcjs', 'immutable', '@arction/eventer', 'earcut', /@babel\/runtime/],
        output: [
            {
                file: 'dist/lcjs-themes.esm.js',
                format: 'esm',
                name: 'lcjsThemes',
                sourcemap: false,
                plugins: [],
            },
            {
                file: 'dist/lcjs-themes.js',
                format: 'cjs',
                name: 'lcjsThemes',
                sourcemap: false,
                plugins: [],
            },
        ],
        onwarn: onWarn,
    },
    {
        input: ['temp/lcjs-themes/es5/index.js'],
        plugins: rollupPlugins(true),
        external: ['@arction/lcjs'],
        output: [
            {
                file: 'dist/lcjs-themes.iife.js',
                format: 'iife',
                name: 'lcjsThemes',
                sourcemap: false,
                plugins: [],
                globals: { '@arction/lcjs': 'lcjs' },
            },
        ],
        onwarn: onWarn,
    },
    {
        input: ['temp/lcjs-themes/es2019/index.js'],
        plugins: rollupPlugins(false),
        external: ['@arction/lcjs', 'immutable', '@arction/eventer', 'earcut', /@babel\/runtime/],
        output: [
            {
                file: 'dist/lcjs-themes.mjs',
                format: 'esm',
                name: 'lcjsThemes',
                sourcemap: false,
                plugins: [],
            },
            {
                file: 'dist/lcjs-themes.cjs',
                format: 'cjs',
                name: 'lcjsThemes',
                sourcemap: false,
                plugins: [],
            },
        ],
        onwarn: onWarn,
    },
    {
        input: ['temp/lcjs-themes/es2019/index.js'],
        plugins: rollupPlugins(false),
        external: ['@arction/lcjs'],
        output: [
            {
                file: 'dist/lcjs-themes.iife.es2019.js',
                format: 'iife',
                name: 'lcjsThemes',
                sourcemap: false,
                plugins: [],
                globals: { '@arction/lcjs': 'lcjs' },
            },
        ],
        onwarn: onWarn,
    },
]

export default config

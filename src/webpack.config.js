const webpack = require('webpack');

module.exports = {
    resolve: {
        fallback: {
            crypto: require.resolve('crypto-browserify'), // Polyfill para crypto
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser', // Polyfill para process
        }),
    ],
};

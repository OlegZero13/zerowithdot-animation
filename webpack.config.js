const path = require('path');
const webpack = require('webpack');


module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        app: './main.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/assets',
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'src'),
        port: 8000,
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env'] },
                }],
            },
            {
                test: /three\/examples\/js/,
                use: 'imports-loader?THREE=three'
            },
            {
                test: /\.js$/i,
                exclude: [/node_modules/],
                use: [{
                    loader: 'eslint-loader',
                    options: {},
                }],
            }
        ],
    },
    resolve: {
        alias: {
            'three-examples': path.join(__dirname, './node_modules/three/examples/js')
        },
    },
};

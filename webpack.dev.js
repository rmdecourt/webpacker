/******************************************************************************
 * IMPORTS.
 *****************************************************************************/
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/******************************************************************************
 * VARIABLES.
 *****************************************************************************/
const postCssConfig = {
    loader: 'postcss-loader',
    options: {
        sourceMap: true,
        plugins: (loader) => [
            require('postcss-import')({}),
            require('postcss-cssnext')({
                'browsers': ['last 5 versions', '> 5%']
            }),
            require('lost')({})
        ]
    }
}

const extractCss = false;

/******************************************************************************
 * BUNDLE DEFINITIONS.
 *****************************************************************************/
module.exports = merge(common.config, {

    /**
     * Define Webpack Enviroment.
     */
    mode: 'development',

    /**
     * Include Source Maps.
     */
    devtool: 'cheap-eval-source-maps',

    /**
     * Output Location.
     */
    output: {
        path: common.paths.output,
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        // publicPath: './dist'
    },

    /**
     * Module Rules.
     */
    module: {
        rules: [

            /**
             * Stylus Loader.
             */
            (extractCss) ? {
                test: /\.styl/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    postCssConfig,
                    'stylus-loader'
                ]
            } : {
                test: /\.styl/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    postCssConfig,
                    'stylus-loader'
                ]
            },

            /**
             * Sass Loader.
             */
            (extractCss) ? {
                test: /\.scss/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    postCssConfig,
                    'sass-loader'
                ]
            } : {
                test: /\.scss/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    postCssConfig,
                    'sass-loader'
                ]
            },

        ]
    },

    plugins: [

        /**
         * Hot Module Replacement.
         */
        new webpack.HotModuleReplacementPlugin(),

    ]

});
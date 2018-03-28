/******************************************************************************
 * IMPORTS.
 *****************************************************************************/
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
            require('lost')({}),
            require('cssnano')({
                preset: 'default'
            })
        ]
    }
}

const extractCss = true;

/******************************************************************************
 * BUNDLE DEFINITIONS.
 *****************************************************************************/
module.exports = merge(common.config, {

    /**
     * Define Webpack Enviroment.
     */
    mode: 'production',

    /**
     * Include Source Maps.
     */
    devtool: 'source-maps',

    /**
     * Output Location.
     */
    output: {
        path: common.paths.output,
        filename: 'js/[name].[chunkhash:6].js',
        chunkFilename: 'js/[name].[chunkhash:6].js'
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
                    'css-loader',
                    postCssConfig,
                    'stylus-loader'
                ]
            } : {
                test: /\.styl/,
                use: [
                    'style-loader',
                    'css-loader',
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
                    'css-loader',
                    postCssConfig,
                    'sass-loader'
                ]
            } : {
                test: /\.scss/,
                use: [
                    'style-loader',
                    'css-loader',
                    config.postCss,
                    'sass-loader'
                ]
            },

        ]
    },

    plugins: [

        /**
         * Extract CSS into a separated file.
         */
        new MiniCssExtractPlugin({
            filename: 'css/[name].[chunkhash].css',
            chunkFilename: 'css/[name].[chunkhash:6].css'
        }),

    ]

});
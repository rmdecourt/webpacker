/******************************************************************************
 * IMPORTS.
 *****************************************************************************/
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/******************************************************************************
 * FUNCTIONS.
 *****************************************************************************/
function page(name, chunks, ext = '.pug') {
    return new HtmlWebpackPlugin({
        filename: name + '.html',
        template: path.join(paths.html, name + '.pug'),
        chunks: chunks
        // inject: false
    });
}

exports.page = page;

/******************************************************************************
 * VARIABLES.
 *****************************************************************************/
const paths = {
    html: path.resolve(__dirname + '/src/html'),
    css: path.resolve(__dirname + '/src/css'),
    entries: path.resolve(__dirname + '/src/js/entries'),
    output: path.resolve(__dirname + '/dist')
};

exports.paths = paths;

/******************************************************************************
 * BUNDLE DEFNITIONS.
 *****************************************************************************/
exports.config = {

    /**
     * Entry Points.
     */
    entry: {
        app: path.resolve(paths.entries + '/app.js')
    },

    /**
     * Development Server.
     */
    devServer: {

        /* Defines port number. */
        port: 8080,

        /* Defines host. */
        host: 'localhost',

        /* Open application in the browser after starting the server. */
        open: true,

        /* Tell the server where to serve content from. */
        contentBase: './dist',

        /* Enables hot-module-replacement. */
        hot: true
    },

    /**
     * Module Rules.
     */
    module: {
        rules: [

            /**
             * HTML Rules.
             */
            {
                test: /\.html$/,
                use: ['html-loader']
            },

            /**
             * Image Rules.
             */
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/,
                use: [

                    /* Loads files as base64 encoded url */
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[hash:6].[ext]',
                            outputPath: 'img/',
                            publicPath: 'img/'
                        },
                    },

                    /* Optimize image sizes */
                    {
                        loader: 'img-loader',
                        options: {

                            /* Optimizations for GIFS */
                            gifsicle: {
                                interlaced: false
                            },

                            /* Optimizations for JPEGS */
                            mozjpeg: {
                                progressive: true,
                                arithmetic: false,
                                quality: 100
                            },

                            /* Optimizations for PNGS */
                            optipng: false,
                            pngquant: {
                                floyd: 0.5,
                                speed: 2
                            },

                            /* Optimizations for SVGS */
                            svgo: {
                                plugins: [{
                                        removeTitle: true
                                    },
                                    {
                                        convertPathData: false
                                    }
                                ]
                            }

                        }
                    }

                ]
            },

            /**
             * Pug Rules.
             */
            {
                test: /\.(pug)$/,
                use: ['html-loader', 'pug-html-loader']
            },

            /**
             * Javascript Rules.
             */
            {
                test: /\.js$/,
                use: [

                    /* Transpiles ES6 code */
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env'],
                            plugins: ['syntax-dynamic-import']
                        }

                    }

                ],
                exclude: /node_modules/
            },

        ]
    },

    /**
     * Optimizations.
     */
    optimization: {

        /**
         * Separate manifest in it's own file.
         */
        runtimeChunk: {
            name: 'manifest'
        },

        /**
         * Split Chunks.
         */
        splitChunks: {
            // minSize: 30000,
            // minChunks: 1,
            // maxInitialRequest: 3,
            // maxAsyncRequest: 5
            cacheGroups: {

                /* Separate common imports in its own file. */
                commons: {
                    chunks: 'initial',
                    name: 'common',
                },

                /* Separate vendor imports in its own file. */
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10
                }

            }
        }

    },

    /**
     * Plugins.
     */
    plugins: [

        /**
         * Compiles Pug files and injects Javascript.
         */
        page('index', ['app', 'manifest', 'common', 'vendor']),

        /**
         * Cleans up dist directory before every build.
         */
        new CleanWebpackPlugin(['dist']),

        /**
         * Provide Plugin.
         */
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     _: 'lodash'
        // })

    ]

}
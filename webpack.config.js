const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
var path = require('path')
var webpack = require('webpack')

module.exports = {
    stats: {
        children: false
    },
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].bundle.js'
    },

    optimization: {
        minimizer: [
            new TerserPlugin()
            // we specify a custom UglifyJsPlugin here to get source maps in production
            // new UglifyJsPlugin({
            //     cache: true,
            //     parallel: true,
            //     uglifyOptions: {
            //         compress: false,
            //         ecma: 6,
            //         mangle: true
            //     },
            //     sourceMap: true
            //         // splitChunks: {
            //         //     chunks: 'all'
            //         // }
            // })
        ]
    },

    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: { minimize: true }
                }]

            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                use: [
                        'file-loader'
                    ]
                    // loader: 'file-loader',
                    // options: {
                    //     name: '[name].[ext]?[hash]'
                    // }

            },
            {
                test: /\.(css|scss)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    // "sass-loader"
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
            filename: "./index.html"
        }),
        new CopyWebpackPlugin([
            { from: "src/data", to: "data" },
        ]),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 9000,
        historyApiFallback: true,
        // noInfo: true,
        // overlay: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',

}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
        // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),

    ]);
}
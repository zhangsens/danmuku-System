const webpack = require("webpack");

module.exports = {
    entry: "./src/cDraw.js",
    output: {
        path: __dirname + "/dist",
        filename: "cDanmaku.min.js",
        library: "cDanmaku",
        libraryTarget: "umd"
    },
    module: {
        rules: [{
                test: /\.js/,
                loader: "eslint-loader",
                include: __dirname + "src"
            },
            {
                test: /\.js/,
                loader: "babel-loader",
                options: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [new webpack.optimize.UglifyJsPlugin()]
};
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// user-agent包将浏览器UserAgent变成一个对象
module.exports = {
    entry: './src/index.js',
    context: process.cwd(),
    mode: 'development', // 不会压缩代码
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'monitor.js',
    },
    devServer: {
        // before使用来配置路由的, 内部启动了一个express服务器
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            devServer.app.get('/success', function (_, res) {
                res.json({ id: 1 }); // 200
            });

            devServer.app.post('/error', function (_, res) {
                res.sendStatus(500);
            })

            return middlewares;
        },
        // contentBase: path.resolve(__dirname, 'dist'), // 已经被弃用了
        static: {
            directory: path.join(__dirname, 'dist'),
        },

        compress: true,
        port: 9000,
        open: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'head',
        })
    ]
}
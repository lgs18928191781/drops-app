const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
    let target = ''

    // test路由的请求都会被转发到 www.test.net
    if (req.url.startsWith('/followapi')) {
        target = 'https://man-test.metaid.io`'
    }

    createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            // 路径重写，去掉test路径
            '^/followapi': '/api'
        }
    })(req, res)
}
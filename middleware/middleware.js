// middleware.js
const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // Modify the request headers here
    const token = req.headers.authorization?.split(' ')[1];
    if (token && token.length > 5000) {
      // Example: Splitting the token if it's too large
      proxyReq.setHeader('X-Token-Chunk', token.slice(0, 5000));
      proxyReq.setHeader('X-Token-Rest', token.slice(5000));
    }
  },
});

module.exports = proxy;

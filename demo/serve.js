#!/usr/bin/env node

/**
 * Simple HTTP server for demo
 * Usage: node serve.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Parse URL
  let filePath = req.url === '/' ? '/index.html' : req.url;
  
  // Map core modules to dist
  if (filePath.startsWith('/core/')) {
    filePath = filePath.replace('/core/', '/dist/core/');
  }

  // Resolve file path
  const fullPath = path.join(__dirname, '..', filePath);
  const ext = path.extname(fullPath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Read and serve file
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      console.error('Error:', err.message);
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║                                        ║
║   🎬 Stereo Demo Server Running!      ║
║                                        ║
║   URL: http://localhost:${PORT}          ║
║                                        ║
║   Press Ctrl+C to stop                 ║
║                                        ║
╚════════════════════════════════════════╝
  `);
});

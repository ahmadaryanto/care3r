const http = require('http');
http.get('http://localhost:3000', (r) => {
  console.log('Server responding with status:', r.statusCode);
  r.resume();
}).on('error', e => console.log('Server not ready or error:', e.message));

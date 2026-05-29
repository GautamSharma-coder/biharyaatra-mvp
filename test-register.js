const http = require('http');

const data = JSON.stringify({
  name: "Test User 2",
  email: "gautamksharma45+test2@gmail.com",
  password: "password123",
  phone: "9876543211"
});

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/api/v1/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(`STATUS: ${res.statusCode} | BODY: ${body} | BYTES: ${Buffer.byteLength(body)}`));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();

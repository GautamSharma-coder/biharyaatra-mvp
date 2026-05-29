const http = require('http');

const data = JSON.stringify({
  email: "gautamksharma45@gmail.com"
});

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/api/v1/auth/send-email-otp',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(`STATUS: ${res.statusCode} | BODY: ${body}`));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();

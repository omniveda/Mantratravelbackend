const http = require('http');

const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/auth/init-admin',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`StatusCode: ${res.statusCode}`);
        console.log(`Response: ${data}`);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.end();

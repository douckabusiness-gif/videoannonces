const http = require('http');

const getId = 'cmji9afma0001kcp8xa36b6ks';

const urls = [
    `http://localhost:3000/api/boosts`,
    `http://localhost:3000/api/payment-methods`,
    `http://localhost:3000/api/listings/${getId}`
];

urls.forEach(url => {
    http.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log(`URL: ${url}`);
            console.log(`Status: ${res.statusCode}`);
            console.log(`Body: ${data.substring(0, 100)}...`); // Show first 100 chars
            console.log('---');
        });
    }).on('error', (err) => {
        console.error(`Error fetching ${url}:`, err.message);
    });
});


import fs from 'fs';

async function main() {
    try {
        console.log('Fetching /api/auth/session...');
        const res = await fetch('http://localhost:3000/api/auth/session');
        console.log('Status:', res.status);
        const text = await res.text();
        fs.writeFileSync('error.html', text);
        console.log('Saved error.html');
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

main();


async function main() {
    try {
        console.log('Fetching /api/auth/session...');
        const res = await fetch('http://localhost:3000/api/auth/session');
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body length:', text.length);
        console.log('Body preview:', text.substring(0, 500));
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

main();

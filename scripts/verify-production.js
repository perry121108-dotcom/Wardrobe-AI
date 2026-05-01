const baseUrl = process.argv[2] || 'https://wardrobe-ai-backend-a3fl.onrender.com';

const checks = [
  '/api/test',
  '/api/health/db',
  '/api/meta/seasons',
  '/api/meta/occasions',
  '/api/meta/materials',
];

async function main() {
  let failed = 0;

  for (const path of checks) {
    const url = `${baseUrl}${path}`;
    try {
      const response = await fetch(url);
      const text = await response.text();
      const ok = response.ok;
      console.log(`${ok ? 'PASS' : 'FAIL'} ${response.status} ${url}`);
      if (!ok) {
        failed += 1;
        console.log(text.slice(0, 500));
      }
    } catch (error) {
      failed += 1;
      console.log(`FAIL ${url}`);
      console.log(error.message);
    }
  }

  if (failed > 0) {
    process.exit(1);
  }
}

main();

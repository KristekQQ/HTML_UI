const tests = ['layoutEngine.test.js', 'designMode.test.js'];
let failed = 0;
for (const t of tests) {
  try {
    await import('./' + t);
    console.log('\x1b[32m✓ ' + t + '\x1b[0m');
  } catch (e) {
    failed++;
    console.error('\x1b[31m✗ ' + t + '\x1b[0m', e);
  }
}
if (failed) process.exit(1);

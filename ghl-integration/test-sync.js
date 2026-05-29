const { syncLead } = require('./sync-lead');

const testLead = {
  email: 'test-auditor-lead@example.com',
  name: 'Test Lead',
  url: 'https://test-dental-site.com',
  grade: 'F',
  leakEstimate: 4800,
  niche: 'Dental'
};

syncLead(testLead)
  .then(result => console.log('Test successful:', result))
  .catch(err => {
    console.error('Test failed as expected with current token:');
    console.error(err.message);
  });

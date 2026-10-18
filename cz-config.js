const policy = require('./.conventions/commit-policy.json');

module.exports = {
  types: policy.types.map((type) => ({ value: type, name: type })),
  scopes: [
    'account',
    'auth',
    'member',
    'auction',
    'payment',
    'search',
    'admin',
    'profile',
    'frontend',
    'gitops',
    'tooling',
  ].map((scope) => ({ name: scope })),
  allowCustomScopes: true,
  subjectLimit: 72,
  messages: {
    type: 'Select commit type:',
    scope: 'Select capability or tool:',
    subject: 'Describe the change in imperative English:',
    body: 'Optional body:',
    confirmCommit: 'Create this commit? (y/n)',
  },
  skipQuestions: ['breaking', 'footer'],
};

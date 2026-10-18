const policy = require('./.conventions/commit-policy.json');

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', policy.types],
    'header-max-length': [2, 'always', policy.header_max_length],
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-empty': [2, 'never'],
  },
};

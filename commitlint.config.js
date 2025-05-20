module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: ['commitlint-plugin-gitmoji'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'refactor', 'test', 'chore', 'design', 'hotfix'],
    ],
    'subject-empty': [0, 'never'],
    'header-max-length': [2, 'always', 100],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [0, 'never'],
    'start-with-gitmoji': [2, 'always'],
  },
};

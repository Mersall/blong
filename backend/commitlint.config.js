module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // A new feature
        'fix',      // A bug fix
        'docs',     // Documentation only changes
        'style',    // Changes that do not affect the meaning of the code
        'refactor', // A code change that neither fixes a bug nor adds a feature
        'perf',     // A code change that improves performance
        'test',     // Adding missing tests or correcting existing tests
        'chore',    // Changes to the build process or auxiliary tools
        'ci',       // Changes to CI configuration files and scripts
        'build',    // Changes that affect the build system or external dependencies
        'revert',   // Reverts a previous commit
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-enum': [
      2,
      'always',
      [
        'auth',     // Authentication related changes
        'profile',  // User profile related changes
        'quiz',     // Quiz system related changes
        'matching', // Matching algorithm related changes
        'messages', // Messaging system related changes
        'dates',    // Date planning related changes
        'venues',   // Venue recommendations related changes
        'api',      // General API changes
        'db',       // Database related changes
        'config',   // Configuration changes
        'deps',     // Dependencies updates
        'security', // Security related changes
        'perf',     // Performance related changes
        'docs',     // Documentation changes
        'test',     // Test related changes
        'ci',       // CI/CD related changes
        'release',  // Release related changes
      ],
    ],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 72],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [2, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
};
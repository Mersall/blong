module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', {
        unstable_transformProfile: 'hermes-stable'
      }]
    ],
    plugins: [
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }],
      '@babel/plugin-transform-export-namespace-from',
      '@babel/plugin-transform-flow-strip-types',
      '@babel/plugin-transform-runtime'
    ],
    env: {
      test: {
        presets: [
          ['babel-preset-expo', {
            unstable_transformProfile: 'hermes-stable'
          }]
        ],
        plugins: [
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          ['@babel/plugin-transform-private-methods', { loose: true }],
          ['@babel/plugin-transform-private-property-in-object', { loose: true }],
          '@babel/plugin-transform-export-namespace-from',
          '@babel/plugin-transform-flow-strip-types'
        ]
      }
    }
  };
};
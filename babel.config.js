module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    'react-native-reanimated/plugin',
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      allowlist: ['SUPABASE_URL', 'SUPABASE_ANON_KEY'],
      safe: true,
      allowUndefined: false
    }]
  ]
};
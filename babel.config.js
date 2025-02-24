module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-transform-private-methods',
    'react-native-reanimated/plugin',
    '@babel/plugin-proposal-private-methods',
    '@babel/plugin-proposal-class-properties',
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      allowlist: ['SUPABASE_URL', 'SUPABASE_ANON_KEY'],
      safe: true,
      allowUndefined: false
    }]
  ]
};
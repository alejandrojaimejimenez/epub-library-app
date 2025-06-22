const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    mode: env.mode === 'production' ? 'production' : 'development',
    babel: {
      dangerouslyAddModulePathsToTranspile: ['@codler/react-native-keyboard-aware-scroll-view']
    }
  }, argv);

  // Configuración adicional
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, 'src'),
  };

  // Habilitar source maps en desarrollo
  if (config.mode === 'development') {
    config.devtool = 'eval-source-map';
  }

  // Configuración del servidor de desarrollo
  config.devServer = {
    ...config.devServer,
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 19006,
    hot: true
  };

  return config;
};

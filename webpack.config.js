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
    '@assets': path.resolve(__dirname, 'assets'),
    '@application': path.resolve(__dirname, 'src/application'),
    '@services': path.resolve(__dirname, 'src/application/services'),
    '@usecases': path.resolve(__dirname, 'src/application/usecases'),
    '@domain': path.resolve(__dirname, 'src/domain'),
    '@interfaces': path.resolve(__dirname, 'src/domain/interfaces'),
    '@models': path.resolve(__dirname, 'src/domain/models'),
    '@repositories': path.resolve(__dirname, 'src/domain/repositories'),
    '@infrastructure': path.resolve(__dirname, 'src/infrastructure'),
    '@api': path.resolve(__dirname, 'src/infrastructure/api'),
    '@core': path.resolve(__dirname, 'src/infrastructure/core'),
    '@data': path.resolve(__dirname, 'src/infrastructure/data'),
    '@storage': path.resolve(__dirname, 'src/infrastructure/storage'),
    '@presentation': path.resolve(__dirname, 'src/presentation'),
    '@components': path.resolve(__dirname, 'src/presentation/components'),
    '@navigation': path.resolve(__dirname, 'src/presentation/navigation'),
    '@screens': path.resolve(__dirname, 'src/presentation/screens'),
    '@theme': path.resolve(__dirname, 'src/presentation/theme'),
    '@shared': path.resolve(__dirname, 'src/shared'),
    '@constants': path.resolve(__dirname, 'src/shared/constants'),
    '@context': path.resolve(__dirname, 'src/shared/context'),
    '@hooks': path.resolve(__dirname, 'src/shared/hooks'),
    '@utils': path.resolve(__dirname, 'src/shared/utils'),
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

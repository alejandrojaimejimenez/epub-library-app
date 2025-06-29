const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
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
  '@mqtt': path.resolve(__dirname, 'src/infrastructure/mqtt'),
  '@notifications': path.resolve(__dirname, 'src/infrastructure/notifications'),
  '@storage': path.resolve(__dirname, 'src/infrastructure/storage'),
  '@presentation': path.resolve(__dirname, 'src/presentation'),
  '@components': path.resolve(__dirname, 'src/presentation/components'),
  '@atoms': path.resolve(__dirname, 'src/presentation/components/atoms'),
  '@molecules': path.resolve(__dirname, 'src/presentation/components/molecules'),
  '@organisms': path.resolve(__dirname, 'src/presentation/components/organisms'),
  '@templates': path.resolve(__dirname, 'src/presentation/components/templates'),
  '@features': path.resolve(__dirname, 'src/presentation/components/features'),
  '@navigation': path.resolve(__dirname, 'src/presentation/navigation'),
  '@screens': path.resolve(__dirname, 'src/presentation/screens'),
  '@theme': path.resolve(__dirname, 'src/presentation/theme'),
  '@shared': path.resolve(__dirname, 'src/shared'),
  '@constants': path.resolve(__dirname, 'src/shared/constants'),
  '@context': path.resolve(__dirname, 'src/shared/context'),
  '@hooks': path.resolve(__dirname, 'src/shared/hooks'),
  '@types': path.resolve(__dirname, 'src/shared/types'),
  '@utils': path.resolve(__dirname, 'src/shared/utils'),
};

config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: false,
  },
});

module.exports = config;

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ["./src"], 
          extensions: [
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
            '.json',
            '.svg',
            '.png',
            '.jpg',
          ],
          alias: {
            '@assets': './assets',
            '@application': './src/application',
            '@services': './src/application/services',
            '@usecases': './src/application/usecases',
            '@domain': './src/domain',
            '@interfaces': './src/domain/interfaces',
            '@models': './src/domain/models',
            '@repositories': './src/domain/repositories',
            '@infrastructure': './src/infrastructure',
            '@api': './src/infrastructure/api',
            '@core': './src/infrastructure/core',
            '@data': './src/infrastructure/data',
            '@storage': './src/infrastructure/storage',
            '@presentation': './src/presentation',
            '@components': './src/presentation/components',
            '@navigation': './src/presentation/navigation',
            '@screens': './src/presentation/screens',
            '@theme': './src/presentation/theme',
            '@shared': './src/shared',
            '@constants': './src/shared/constants',
            '@context': './src/shared/context',
            '@hooks': './src/shared/hooks',
            '@utils': './src/shared/utils',
          },
        },
      ],
      '@babel/plugin-proposal-export-namespace-from',
    ],
  };
};

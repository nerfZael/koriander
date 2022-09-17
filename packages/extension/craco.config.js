module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return {
        ...webpackConfig,
        entry: {
          main: [env === 'development' && require.resolve('react-dev-utils/webpackHotDevClient'), paths.appIndexJs].filter(Boolean),
          content: './src/chromeServices/content.ts',
          background: './src/chromeServices/background.ts',
          inject: './src/chromeServices/inject.ts',
        },
        output: {
          ...webpackConfig.output,
          filename: 'static/js/[name].js',
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false,
        },
        resolve: {
          ...webpackConfig.resolve,
          // fallback: {
          //   "fs": false,
          //   "path": false,
          //   "url": false,
          //   "http": false,
          //   "https": false,
          //   "util": false
          // }
        }
      }
    },
  }
}
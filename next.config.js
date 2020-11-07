const { resolve } = require('path');
const path = require('path');
const  JsonPostProcessPlugin = require('json-post-process-webpack-plugin');
module.exports = {
  target: 'serverless',
  trailingSlash: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    
    // const envFilePath = dev ? './atlassian-connect.dev.json' : './atlassian-connect.prod.json';

    // console.log('Custom Webpack Config\n',
    //   '\tEnvironment', dev ? 'Development' : 'Production',
    //   '\tConfig File', envFilePath);

    // config.module.rules.push({
    //   test: /atlassian-connect\.json$/,
    //   loader: 'file-replace-loader',
    //   options: {
    //     condition: !dev,
    //     replacement: path.resolve('./atlassian-connect.prod.json'),
    //     async: true,
    //   }
    // })

    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty',
        path: 'empty'
      }
    }

    // // Note: we provide webpack above so you should not `require` it
    // // Perform customizations to webpack config
    // config.plugins.push(new webpack.NormalModuleReplacementPlugin(
    //   /atlassian-connect.json/,
    //   envFilePath
    // ));

    config.plugins.push(new JsonPostProcessPlugin({
      matchers: [{
        matcher: /atlassian-connect\.json$/,
        action: (currentJsonContent) => ({ ...currentJsonContent, someNewStuff: '...' })
      }]
    }));



    // Important: return the modified config
    return config
  },
}

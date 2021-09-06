/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/': {
      // target: 'http://192.168.0.17:3000',
      target: 'http://192.168.0.113:3000',
      // target: 'http://zpldongxie.gicp.net:3000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  ssh: {
    '/api/': {
      target: 'http://api.test.xianyunshipei.com',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};

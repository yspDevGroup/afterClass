// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    // ENV_backUrl: 'http://192.168.0.17:3000',
    ENV_host: 'http://localhost:8000',
    ENV_backUrl: 'http://192.168.0.113:3000',
    authType: 'password',
    clientId: 'ww20993d96d6755f55',
    clientSecret: 'wy83uVM6xgfDtE2XS5WQ',
  },
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  webpack5: {
    // lazyCompilation: {},
  },
});

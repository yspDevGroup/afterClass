// https://umijs.org/config/
import { defineConfig } from 'umi';
import CompressionWebpackPlugin from 'compression-webpack-plugin';

import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
import theme from './theme';

const { REACT_APP_ENV } = process.env;
const prodGzipList = ['js', 'css'];

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  define: {
    ENV_title: '课后服务平台',
    ENV_subTitle: '校园版',
    ENV_debug: false,
    testStudentId: '',
    testStudentBJId: '',
    testStudentNJId: '',
    testStudentXQSJId: '',
    testTeacherId: '',
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme,
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  chainWebpack: (config) => {
    // 以下为gzip配置内容
    if (process.env.NODE_ENV === 'production') {
      // 生产模式开启
      config.plugin('compression-webpack-plugin').use(
        new CompressionWebpackPlugin({
          // filename: 文件名称，这里我们不设置，让它保持和未压缩的文件同一个名称
          algorithm: 'gzip', // 指定生成gzip格式
          test: new RegExp('\\.(' + prodGzipList.join('|') + ')$'), // 匹配哪些格式文件需要压缩
          threshold: 10240, //对超过10k的数据进行压缩
          minRatio: 0.6, // 压缩比例，值为0 ~ 1
        }),
      );
    }
  },
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'http://api.test.xianyunshipei.com/documentation/json',
      // schemaPath: 'http://192.168.0.113:3000/documentation/json',
      // schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
  ],
});

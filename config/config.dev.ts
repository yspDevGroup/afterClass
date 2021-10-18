// https://umijs.org/config/
import { defineConfig } from 'umi';
import proxy from './proxy';

export default defineConfig({
  define: {
    ENV_title: '课后服务平台',
    ENV_subTitle: '课后服务平台',
    ENV_copyRight: '2021 版权所有：陕西五育汇智信息技术有限公司',
    ENV_host: 'http://afterclass.test.xianyunshipei.com',
    // ENV_backUrl: 'http://api.test.xianyunshipei.com',
    ENV_backUrl: 'http://192.168.0.113:3000',
    ssoHost: 'http://sso.test.xianyunshipei.com',
    authType: 'wechat',
    clientId: 'ww20993d96d6755f55',
    clientSecret: 'yqw2KwiyUCLv4V2_By-LYcDxD_vVyDI2jqlLOkqIqTY',
  },
  proxy: proxy['dev'],
});

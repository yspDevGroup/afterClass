import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  layout: 'side',
  contentWidth: 'Fluid',
  headerHeight: 0,
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: '课后服务平台',
  pwa: false,
  // logo: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
  // splitMenus: true,
};

export default Settings;

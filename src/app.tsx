import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import Footer from '@/components/Footer';
import type { ResponseError } from 'umi-request';
import { currentUser as queryCurrentUser } from './services/after-class/user';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { getLoginPath } from './utils/utils';
import headerTop from '@/assets/headerTop.png';

const isDev = false; // 取消openapi 在菜单中的展示 process.env.NODE_ENV === 'development';
const loginPath: string = getLoginPath();
const authCallbackPath = '/auth_callback';
// let currentToken: string;

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  // loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const currentUserRes = await queryCurrentUser({
        plat: 'school',
      });
      if (currentUserRes.status === 'ok') {
        // sessionStorage.setItem('csrf', currentUser?.csrfToken || '');
        const { info } = currentUserRes.data || {};
        if (!info) {
          // 如果后台未查询到用户信息，则跳转到登录页
          // 此时不能无条件跳转向认证页，否则可能产生无限循环
          history.push('/user/login');
          // currentToken = '';
          localStorage.removeItem('token');
          return undefined;
        }
        // currentToken = token;
        // localStorage.setItem('token', token || '');
        return info as API.CurrentUser;
      }
    } catch (error) {
      // history.push(loginPath);
      window.location.href = loginPath;
    }
    return undefined;
  };
  // 处理微信端多身份数据重合问题
  if (window.location.pathname === '/' && history.length <= 2) {
    localStorage.removeItem('token');
  }
  // 如果是登录页面及认证跳转页，不执行
  if (history.location.pathname !== loginPath && history.location.pathname !== authCallbackPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// https://umijs.org/zh-CN/plugins/plugin-layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: false,
    disableContentMargin: false,
    waterMarkProps: {
      // content: initialState?.currentUser?.name,
    },
    pageTitleRender: () => {
      return `${ENV_subTitle}`;
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录或第一次进入首页，重定向到 login
      if (
        !initialState?.currentUser &&
        ![loginPath, authCallbackPath].includes(location.pathname)
      ) {
        if (loginPath.startsWith('http')) {
          // 企业微信端打开
          window.location.href = loginPath;
        } else {
          history.push(loginPath);
        }
      }
    },
    links: isDev
      ? [
        <Link to="/umi/plugin/openapi" target="_blank">
          <LinkOutlined />
          <span>openAPI 文档</span>
        </Link>,
        <Link to="/~docs" target="_blank">
          <BookOutlined />
          <span>业务组件文档</span>
        </Link>,
      ]
      : [],
    collapsedButtonRender: false,
    menuHeaderRender: () => {
      return (
        <div className='cusHeaderLogo'>
          <Link to="/">
            <img src={headerTop} />
          </Link>
          <h1>— 学校端 —</h1>
        </div>
      );
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/** 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

// https://umijs.org/zh-CN/plugins/plugin-request
export const request: RequestConfig = {
  errorHandler,
  credentials: 'include',
  prefix: '/api',
  // headers: {
  //   // 'X-Csrf-Token': sessionStorage.getItem('csrf') || '',
  //   Authorization: `Bearer ${localStorage.getItem('token')}`,
  // },
  middlewares: [
    async function middlewareA(ctx, next) {
      ctx.req.options.headers = {
        ...ctx.req.options.headers,
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };
      await next();
    },
  ],
};

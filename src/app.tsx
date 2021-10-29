/* eslint-disable no-console */
import { notification } from 'antd';
import type { RequestConfig } from 'umi';
import { history, Link } from 'umi';
import type { ResponseError } from 'umi-request';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';

import { getAuthorization, getUserCache, removeOAuthToken, saveUserInfoCache } from './utils/utils';
import { regWechatAPI } from './utils/wx';
import PageLoading from '@/components/PageLoading';
import Footer from '@/components/Footer';
import headerTop from '@/assets/headerTop.png';
import headerTopSmall from '@/assets/headerTopSmall.png';

import { currentUser as queryCurrentUser } from './services/after-class/user';
import { currentWechatUser } from './services/after-class/wechat';

const isDev = false; // 取消openapi 在菜单中的展示 process.env.NODE_ENV === 'development';
const authCallbackPath = '/auth_callback';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<InitialState> {
  const fetchUserInfo = async () => {
    try {
      const currentUserRes =
        authType === 'wechat'
          ? await currentWechatUser({ plat: 'school' })
          : await queryCurrentUser({ plat: 'school' });
      if (currentUserRes.status === 'ok') {
        const { info } = currentUserRes.data || {};
        if (info) {
          saveUserInfoCache(info);
          return info as API.CurrentUser;
        }
      }
    } catch (error) {
      console.warn(error);
      history.push(`/403?title=登录失败${error}`);
    }
    removeOAuthToken();
    return undefined;
  };
  const userInfoCache = getUserCache();
  if (window.location.pathname !== '/' && userInfoCache) {
    return {
      fetchUserInfo,
      currentUser: userInfoCache,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// https://umijs.org/zh-CN/plugins/plugin-layout
export const layout = ({ initialState }: { initialState: InitialState }) => {
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
      const path = window.location.pathname.toLowerCase();

      // 如果未登录，且不在首页（分发页），且不在认证页，且不是404、403等特殊页面，则重定向到403
      if (
        !initialState?.currentUser &&
        path !== '/' &&
        !path.startsWith(authCallbackPath) &&
        !path.startsWith('/40')
      ) {
        history.push('/403');
      }
      (async () => {
        if (initialState?.currentUser) await regWechatAPI();
      })();
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
    menuHeaderRender: (logo: any, title: any, props: any) => {
      if (props?.collapsed) {
        return (
          <div className="cusHeaderLogoSmall">
            <Link to="/">
              <img src={headerTopSmall} />
            </Link>
            <span>
              学校
              <br />端
            </span>
          </div>
        );
      }
      return (
        <div className="cusHeaderLogo">
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
    async function middlewareA(ctx: any, next: any) {
      ctx.req.options.headers = {
        ...ctx.req.options.headers,
        Authorization: getAuthorization(),
      };
      await next();
      if (
        ctx.res.status !== 'ok' &&
        (ctx.res.message?.includes('Authorization token is invalid') ||
          ctx.res.message?.includes('Invalid Token'))
      ) {
        history.replace('/403?title=认证信息已失效，请重新登录');
      }
    },
  ],
};

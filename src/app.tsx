/* eslint-disable no-console */
import { message, notification } from 'antd';
import type { RequestConfig } from 'umi';
import { history, Link } from 'umi';
import type { ResponseError } from 'umi-request';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';

import { getAuthorization, getBuildOptions, getOauthToken, removeOAuthToken } from './utils/utils';
import { regWechatAPI } from './utils/wx';
import PageLoading from '@/components/PageLoading';
import Footer from '@/components/Footer';
import headerTop from '@/assets/headerTop.png';
import headerTopSmall from '@/assets/headerTopSmall.png';

import { currentUser as queryCurrentUser } from './services/after-class/auth';
import { currentWechatUser } from './services/after-class/wechat';
import Version from './components/Version';
import type { LocationDescriptor, Location } from 'history';
import type { ReactChild, ReactFragment, ReactPortal } from 'react';

const isDev = process.env.NODE_ENV === 'development';
const authCallbackPath = '/auth';
const loginPath = '/user';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<InitialState> {
  console.log('process.env.REACT_APP_ENV: ', process.env.REACT_APP_ENV);
  const buildOptions = await getBuildOptions();
  const fetchUserInfo = async () => {
    const authType = localStorage.getItem('authType') || 'none';
    let res;
    let dataUser: CurrentUser | undefined;
    switch (authType) {
      case 'wechat':
        res = await currentWechatUser({ plat: 'school' });
        if (res.status === 'ok') {
          const data = res?.data?.info;
          dataUser = data;
        }
        break;
      case 'password':
      default:
        res = await queryCurrentUser({ plat: 'school' });
        // console.log('res', res);

        if (res.status === 'ok') {
          const data = res?.data;
          dataUser = {
            ...data,
            xxId: data?.QYId,
            JSId: data?.UserId,
            type: data?.userType?.map((item: { name: string }) => item.name),
            student: data?.student?.map((item: any) => {
              return {
                ...item,
                name: item.XM,
              };
            }),
            // student: [
            //   {
            //     student_userid: '3587a5bd08c4178f770727d140aa1ecd',
            //     name: '刘二',
            //     department: [99],
            //     parents: [
            //       {
            //         parent_userid: '16c5f23c3a4048e64201bd4054a29a66',
            //         relation: '妈妈',
            //         is_subscribe: 1,
            //         external_userid: 'wmFmXKCAAARzx9BBO4Ppm3SRgJHDruPA',
            //       },
            //     ],
            //     XSJBSJId: 'e002debe-9649-4a88-bac0-39ee141e2b28',
            //     BJSJId: 'f5823d30-505e-4813-a9b7-efbfa2f9aacf',
            //     NJSJId: '50a8d460-b098-11ec-95a1-52540033d8e0',
            //     XQSJId: 'a25f6c6c-647c-431e-83ee-3c510c352ba6',
            //   },
            //   {
            //     student_userid: '61017999180010',
            //     name: '刘大',
            //     department: [130],
            //     parents: [
            //       {
            //         parent_userid: '16c5f23c3a4048e64201bd4054a29a66',
            //         relation: '妈妈',
            //         is_subscribe: 1,
            //         external_userid: 'wmFmXKCAAARzx9BBO4Ppm3SRgJHDruPA',
            //       },
            //     ],
            //     XSJBSJId: 'b82676c5-ce3a-4c40-bfc0-3970d48a74c0',
            //     BJSJId: 'e6ce60c8-069a-4edb-8167-b210a68077e2',
            //     NJSJId: '50aa4384-b098-11ec-95a1-52540033d8e0',
            //     XQSJId: 'a25f6c6c-647c-431e-83ee-3c510c352ba6',
            //   },
            //   {
            //     student_userid: '5c230c28c87014b4f688eb4523e8c8c0',
            //     name: '刘三',
            //     department: [99],
            //     parents: [
            //       {
            //         parent_userid: '16c5f23c3a4048e64201bd4054a29a66',
            //         relation: '妈妈',
            //         is_subscribe: 1,
            //         external_userid: 'wmFmXKCAAARzx9BBO4Ppm3SRgJHDruPA',
            //       },
            //     ],
            //     XSJBSJId: '74b68816-969e-4a30-9f71-9bcc9b9d9c2e',
            //     BJSJId: 'f5823d30-505e-4813-a9b7-efbfa2f9aacf',
            //     NJSJId: '50a8d460-b098-11ec-95a1-52540033d8e0',
            //     XQSJId: 'a25f6c6c-647c-431e-83ee-3c510c352ba6',
            //   },
            // ],
          };
        }
        break;
    }
    return dataUser;
  };
  const token = getOauthToken();
  if (token) {
    return {
      fetchUserInfo,
      currentUser: await fetchUserInfo(),
      settings: {},
      buildOptions,
    };
  }
  return {
    fetchUserInfo,
    settings: {},
    buildOptions,
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
      return `${ENV_title}`;
    },
    footerRender: () => <Footer copyRight={initialState.buildOptions.ENV_copyRight} />,
    onPageChange: () => {
      const path = location.pathname.toLowerCase();
      // 如果未登录，且不在首页（分发页），且不在认证页，且不是404、403等特殊页面，则重定向到403
      if (
        !initialState?.currentUser &&
        path !== '/' &&
        !path.startsWith(authCallbackPath) &&
        !path.startsWith(loginPath) &&
        !path.startsWith('/40') &&
        !path.startsWith('/user/parent')
      ) {
        console.log('initialState', initialState.currentUser);
        history.push('/403');
      }
      (async () => {
        if (initialState?.currentUser) await regWechatAPI();
      })();
    },
    links: isDev
      ? [
          <Link
            key="openapi"
            to="/umi/plugin/openapi"
            target="_blank"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            <LinkOutlined />
            <span>openAPI 文档</span>
          </Link>,
          <Link
            key="docs"
            to="/~docs"
            target="_blank"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
          <Version key="version" />,
        ]
      : [
          <Version
            key="version"
            style={{ color: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', fontSize: '10px' }}
          />,
        ],
    collapsedButtonRender: false,
    menuItemRender: (
      item: {
        name: string;
        itemPath:
          | LocationDescriptor<unknown>
          | ((location: Location<unknown>) => LocationDescriptor<unknown>);
      },
      dom: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined,
    ) => {
      const isComWx = /wxwork/i.test(navigator.userAgent);
      if (isComWx === true && item?.name === '学生管理') {
        return <></>;
      }
      return <Link to={item?.itemPath}>{dom}</Link>;
    },
    onMenuHeaderClick: (e: React.MouseEvent<HTMLDivElement>) => {
      console.log(e.target);
    },

    menuHeaderRender: (logo: any, title: any, props: any) => {
      if (props?.collapsed) {
        return (
          <div className="cusHeaderLogoSmall">
            <img src={headerTopSmall} />
            <span>
              学校
              <br />端
            </span>
          </div>
        );
      }
      return (
        <div className="cusHeaderLogo">
          <img src={headerTop} />
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
  const { response, data } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    console.error(errorText);
    message.error(`请求错误 ${status}: ${url}`);

    // notification.error({
    //   message: `请求错误 ${status}: ${url}`,
    //   description: errorText,
    // });
  }
  if (response?.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    switch (response.status) {
      // 单独处理400分支
      case 400:
        if (data.error && data.error_description) {
          switch (data.error) {
            case 'invalid_grant':
              message.error('用户名或密码错误');
              break;
            default:
              message.error(data.error_description);
              break;
          }
        } else {
          message.error(errorText);
        }
        break;
      case 401:
        {
          removeOAuthToken();
          const path = location.pathname.toLowerCase();
          const isAuthPage = path.startsWith(authCallbackPath);
          if (!isAuthPage) {
            console.log('401');
            history.push(`/403`);
            return;
          }
        }
        break;
      default:
        message.error(errorText);
        break;
    }
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
      const path = window.location.pathname.toLowerCase();
      if (
        ctx.res.status !== 'ok' &&
        path !== '/' &&
        !path.startsWith(authCallbackPath) &&
        !path.startsWith('/40') &&
        !path.startsWith('/user/parent') &&
        (ctx.res.message?.includes('Authorization token is invalid') ||
          ctx.res.message?.includes('Invalid Token'))
      ) {
        removeOAuthToken();
        history.replace('/403?title=认证信息已失效，请重新登录');
      }
    },
  ],
};

/* eslint-disable no-useless-escape */
/* eslint-disable no-param-reassign */
import { parse } from 'querystring';
import { message } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';
import { getKHPKSJByBJID } from '@/services/after-class/khpksj';
import { getKHBJSJ } from '@/services/after-class/khbjsj';
import { getEnv } from '@/services/after-class/other';
import { DateRange, Week } from './Timefunction';
import type { MenuDataItem } from '@ant-design/pro-layout/lib/typings';

export const envjudge = () => {
  const isMobile = window.navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
  ); // 是否手机端
  const isWx = /micromessenger/i.test(navigator.userAgent); // 是否微信
  const isComWx = /wxwork/i.test(navigator.userAgent); // 是否企业微信
  if (isMobile) {
    if (isComWx) {
      return 'com-wx-mobile'; // 手机端企业微信
    }
    if (isWx) {
      return 'wx-mobile'; // 手机端微信
    }
    return 'mobile'; // 手机
  }
  if (isComWx) {
    return 'com-wx-pc'; // PC端企业微信
  }
  if (isWx) {
    return 'wx-pc'; // PC端微信
  }
  return 'pc'; // PC
};

/**
 * 实时获取部署环境信息
 *
 * @return {*}  {Promise<BuildOptions>}
 */
export const getBuildOptions = async (): Promise<BuildOptions> => {
  const { data = {} } = ENV_debug ? {} : await getEnv();
  const { yspAppEnv = 'local', nodeEnv } = data;
  console.log('nodeEnv: ', nodeEnv);

  switch (yspAppEnv) {
    case 'production':
      // 生产环境
      return {
        ENV_type: 'prod',
        ENV_copyRight: '2021 版权所有：陕西五育汇智信息技术有限公司',
        ENV_host: 'http://afterclass.prod.xianyunshipei.com',
        ssoHost: 'http://sso.prod.xianyunshipei.com',
        xaeduSsoHost: 'http://www.xaedu.cloud',
        crpHost: 'http://crpweb.prod.xianyunshipei.com',
      };
    case 'chanming':
      // 禅鸣环境
      return {
        ENV_type: 'chanming',
        ENV_copyRight: '2021 版权所有：蝉鸣科技（西安）有限公司',
        ENV_host: 'http://afterclass.wuyu.imzhiliao.com',
        ssoHost: 'http://sso.wuyu.imzhiliao.com',
        crpHost: 'http://crpweb.wuyu.imzhiliao.com',
      };
    case '9dy':
      // 9朵云环境
      return {
        ENV_type: '9dy',
        ENV_copyRight: '2021 版权所有：广东九朵云科技有限公司',
        ENV_host: 'http://afterclass.9cloudstech.com',
        ssoHost: 'http://sso.9cloudstech.com',
        crpHost: 'http://crpweb.9cloudstech.com',
      };
    case 'development':
      // 开发测试环境
      return {
        ENV_type: 'dev',
        ENV_copyRight: '2021 版权所有：陕西五育汇智信息技术有限公司',
        ENV_host: 'http://afterclass.test.xianyunshipei.com',
        ssoHost: 'http://sso.test.xianyunshipei.com',
        crpHost: 'http://crpweb.test.xianyunshipei.com',
      };
    default:
      // 默认为local，本地开发模式下请在此处修改配置，但不要提交此处修改
      return {
        ENV_type: 'dev',
        ENV_copyRight: '2021 版权所有：陕西五育汇智信息技术有限公司',
        ENV_host: 'http:/localhost:8000',
        ssoHost: 'http://platform.test.xianyunshipei.com',
        crpHost: 'http://crpweb.test.xianyunshipei.com',
        // crpHost: 'http://localhost:8001',
      };
  }
};

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

type AhType = {
  path: string;
  Jurisdictions: {
    DepTag: {
      name: string;
    };
    canRead: boolean;
    canWrite: boolean;
  }[];
};

/**
 * 解析单个模块权限
 *
 * @param {MenuDataItem} router
 * @param {AhType[]} ahList
 * @return {*}  {(string[] | undefined)}
 */
const getAuthorityList = (router: MenuDataItem, ahList: AhType[]): string[] | undefined => {
  const { path, authority = [] } = router;
  if (path === '/') return undefined;
  const currentAh = ahList.find((ah) => ah.path === router.path);
  let jur: string[];
  if (currentAh) {
    // 有配置
    jur = currentAh.Jurisdictions.filter((item) => item.canRead).map((item) => item.DepTag.name);
  } else {
    // 无配置，默认为无权限
    jur = [];
  }
  // console.log('authority', authority);
  // console.log('jur', [ ...authority, ...jur ]);
  return [...authority, ...jur];
};

/**
 * 解析权限树
 *
 * @param {MenuDataItem} router
 * @param {AhType[]} ahList
 * @return {*}  {MenuDataItem}
 */
export const mergeAuthority = (router: MenuDataItem, ahList: AhType[]): MenuDataItem => {
  // TODO: 最好能使用后台功能配置覆盖router配置
  return {
    ...router,
    authority: getAuthorityList(router, ahList),
    children: router.children
      ? router.children.map((item: MenuDataItem) => mergeAuthority(item, ahList))
      : undefined,
  };
};

/**
 * 从缓存中取出oAuth token
 *
 * @return {*}
 */
export const getOauthToken = () => {
  return {
    ysp_access_token: localStorage.getItem('ysp_access_token'),
    ysp_expires_in: localStorage.getItem('ysp_expires_in'),
    ysp_refresh_token: localStorage.getItem('ysp_refresh_token'),
    ysp_token_type: localStorage.getItem('ysp_token_type'),
  };
};

/**
 * 客户端保存oAuth token
 *
 * @param {TokenInfo} token
 */
export const saveOAuthToken = async (token: TokenInfo) => {
  return new Promise((resolve) => {
    localStorage.setItem('ysp_access_token', token.access_token);
    localStorage.setItem('ysp_expires_in', token.expires_in || '0');
    localStorage.setItem('ysp_refresh_token', token.refresh_token || '');
    localStorage.setItem('ysp_token_type', token.token_type || 'Bearer');
    setTimeout(() => {
      resolve('');
    }, 200);
  });
};

/**
 * 客户端清除oAuth token
 *
 */
export const removeOAuthToken = () => {
  localStorage.removeItem('ysp_access_token');
  localStorage.removeItem('ysp_expires_in');
  localStorage.removeItem('ysp_refresh_token');
  localStorage.removeItem('ysp_token_type');
};

/**
 * 组装请求头部token信息
 *
 * @return {*}  {string}
 */
export const getAuthorization = (): string => {
  const tokenType = localStorage.getItem('ysp_token_type') || 'Bearer';
  const accessToken = localStorage.getItem('ysp_access_token');
  if (tokenType && accessToken) {
    return `${tokenType} ${accessToken}`;
  }
  return '';
};

/**
 * 封装获取 cookie 的方法
 *
 * @param {string} name
 * @return {*}
 */
export const getCookie = (name: string): string => {
  const cookieReg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const arr = document.cookie.match(cookieReg);
  if (arr) {
    return unescape(arr[2]);
  }
  return '';
};

type GetLoginPathProps = {
  /** 企微登录时回传的应用id */
  suiteID?: string;
  /** 是否管理员，用于企微学校端管理端和老师端的区分 */
  isAdmin?: 'true';
  /** 动态获取到的运行环境配置 */
  buildOptions?: BuildOptions;
  /** 是否强制重登录，强制重登录时，sso不会使用上次的登录缓存进行自动登录 */
  reLogin?: 'true';
};

/**
 * 动态获取登录链接
 *
 * @param {GetLoginPathProps} { suiteID, isAdmin, buildOptions, reLogin }
 * @return {*}  {string}
 */
export const getLoginPath = ({ suiteID, buildOptions, reLogin }: GetLoginPathProps): string => {
  const { ssoHost, ENV_host, xaeduSsoHost } = buildOptions || {};
  const authType: AuthType = (localStorage.getItem('authType') as AuthType) || 'local';
  let loginPath: string;
  switch (authType) {
    case 'wechat':
      // 前提是本应该已经注册为微信认证，且正确配置认证回调地址为 ${ENV_host}/auth_callback/wechat
      loginPath = `${ssoHost}/wechat/authorizeUrl?suiteID=${suiteID}`;
      break;
    case 'xaedu': {
      const callbackUrl = encodeURIComponent(`${ENV_host}/auth_callback/xaedu`);
      loginPath = `${xaeduSsoHost}/sso/login?service=${callbackUrl}`;
      break;
    }
    case 'password':
    default:
      {
        // 为方便本地调试登录，认证回调地址通过参数传递给后台
        const callback = encodeURIComponent(`${ENV_host}/auth_callback/password`);
        const url = new URL(`${ssoHost}/oauth2/password`);
        url.searchParams.append('response_type', authType);
        url.searchParams.append('client_id', ENV_clientId);
        url.searchParams.append('logo', `${ENV_host}/logo.png`);
        url.searchParams.append('title', `${ENV_title}`);
        url.searchParams.append('subtitle', `${ENV_subTitle}`);
        url.searchParams.append('redirect_uri', callback);
        url.searchParams.append('reLogin', String(reLogin || 'false'));
        loginPath = url.href;
      }
      break;
  }
  return loginPath;
};

/**
 * 动态获取资源平台跳转地址
 *
 * @param {BuildOptions} buildOptions
 * @param {('0' | '1')} isAdmin
 * @return {*}
 */
export const getCrpUrl = (buildOptions: BuildOptions, isAdmin: '0' | '1') => {
  const { crpHost, ENV_host } = buildOptions;
  const url = new URL(crpHost);
  url.pathname = '/auth_callback/thirdPart';

  const url_api = decodeURIComponent(new URL(`${ENV_host}/api`).href);
  const ysp_token_type = localStorage.getItem('ysp_token_type');
  const ysp_access_token = localStorage.getItem('ysp_access_token');
  const params = JSON.stringify({ plat: 'school' });

  url.searchParams.append('url_api', url_api);
  url.searchParams.append('clientId', ENV_clientId);
  url.searchParams.append('token_type', ysp_token_type || 'Bearer');
  url.searchParams.append('access_token', ysp_access_token || '');
  url.searchParams.append('params', params);
  url.searchParams.append('isAdmin', isAdmin);

  return url.href;
};

/**
 * 跳转到指定URL连接
 *
 * @param {string} url 跳转链接
 * @param {boolean} onTop 是否在top上跳转
 */
export const gotoLink = (url: string, onTop?: boolean) => {
  if (url.startsWith('http')) {
    // 外部连接
    const win = onTop ? window.top || window : window;
    win.location.href = url;
  } else {
    // 本系统内跳转
    history.push(url);
  }
};

/**
 * 根据路径search拼接参数获取参数对应的值
 *
 * @export
 * @returns
 */
export const getQueryString = (name: string) => {
  const regs = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = decodeURI(window.location.search.substr(1)).match(regs);
  if (r != null) return unescape(r[2]);
  return null;
};

/**
 * 根据认证方式和url参数获取登录链接并跳转
 *
 */
export const gotoLogin = (buildOptions?: BuildOptions) => {
  const query = getPageQuery();
  const suiteID = (query.SuiteID || query.suiteID || '') as string;
  const authType: AuthType = (localStorage.getItem('authType') as AuthType) || 'local';
  if (authType === 'wechat' && !suiteID) {
    history.replace('/403?title=未指定应用ID');
    return;
  }
  const loginPath = getLoginPath({
    suiteID,
    buildOptions,
  });
  localStorage.removeItem('afterclass_role');
  gotoLink(loginPath);
};

/**
 * 进入管理员界面
 *
 */
export const gotoAdmin = () => {
  localStorage.setItem('afterclass_role', 'admin');
  const ej = envjudge();
  if (ej.includes('mobile')) {
    gotoLink('/information/home');
  } else {
    gotoLink('/homepage');
  }
};

/**
 * 进入教师界面
 *
 */
export const gotoTeacher = () => {
  localStorage.setItem('afterclass_role', 'teacher');
  gotoLink('/teacher/home');
};

/**
 * 进入家长界面
 *
 */
export const gotoParent = () => {
  localStorage.setItem('afterclass_role', 'parent');
  localStorage.removeItem('studentId');
  localStorage.removeItem('studentName');
  localStorage.removeItem('studentXQSJId');
  localStorage.removeItem('studentNjId');
  localStorage.removeItem('studentBJId');
  gotoLink('/parent/home');
};

/**
 * 根据当前时间获取学年学期
 *
 * @param {API.XNXQ[]} list
 * @return {*}  {(API.XNXQ | null)}
 */
export const getCurrentXQ = (list: API.XNXQ[], date?: string): API.XNXQ | null => {
  if (!list.length) {
    return null;
  }
  const today = date ? new Date(date) : new Date();
  const currentXQ = list.find((xq: any) => {
    const begin = new Date(xq.KSRQ);
    const end = new Date(xq.JSRQ);
    if (begin <= today && today <= end) {
      return true;
    }
    return false;
  });
  if (currentXQ) {
    return currentXQ;
  }
  // 未找到匹配学期时返回前一个
  // 先按降序排序
  const tempList = list.sort((a, b) => new Date(b.KSRQ).getTime() - new Date(a.KSRQ).getTime());
  const previousXQ = tempList.find((xq) => new Date() >= new Date(xq.JSRQ));
  if (previousXQ) {
    return previousXQ;
  }
  return tempList[tempList.length - 1];
};

/**
 * 根据当前时间获取移动端时段
 *
 * @param {string} KKKSRQ 开课开始时间
 * @param {string} KKJSRQ 开课结束时间
 * @return {*}
 */
export const getCurrentStatus = (KKKSRQ: string, KKJSRQ: string) => {
  let currentStatus:
    | 'unstart'
    | 'enroll'
    | 'enrolling'
    | 'enrolled'
    | 'education'
    | 'end'
    | 'noTips'
    | 'empty' = 'empty';
  const today = new Date();
  const KKbegin = new Date(KKKSRQ);
  const KKend = new Date(KKJSRQ);

  // if (today < BMbegin) {
  //   currentStatus = 'unstart';
  // } else if (BMbegin <= today && today <= BMend) {
  //   currentStatus = 'enroll';
  //   if (KKbegin <= today && today <= BMend) {
  //     // const nowSta = (today.getTime() - KKbegin.getTime()) / 7 / 24 / 60 / 60 / 1000;
  //     // if (nowSta > 2) {
  //     //   currentStatus = 'noTips';
  //     // } else {
  //     currentStatus = 'enrolling';
  //     // }
  //   }
  // } else if (BMbegin <= today && today <= KKbegin) {
  if (today <= KKbegin) {
    currentStatus = 'enrolling';
  } else if (KKbegin <= today && today <= KKend) {
    const nowSta = (today.getTime() - KKbegin.getTime()) / 7 / 24 / 60 / 60 / 1000;
    if (nowSta > 2) {
      currentStatus = 'noTips';
    } else {
      currentStatus = 'education';
    }
  } else if (today > KKend) {
    currentStatus = 'end';
  }
  return currentStatus;
};

/**
 * 根据返回错误信息优化页面错误提示
 *
 * @param msg: string
 */
export const enHenceMsg = (msg?: string) => {
  if (msg && msg.indexOf('Cannot') > -1) {
    message.error(`操作失败，该项存在关联数据,请清除关联数据后再试`);
  } else if ((msg && msg.indexOf('token') > -1) || (msg && msg.indexOf('Token') > -1)) {
    history.replace('/403?title=认证信息已失效，请重新登录');
  } else if (msg && msg.indexOf('Validation') > -1) {
    message.error('操作失败，该项未通过校验，请检查数据是否重复后再试');
  } else {
    message.error(`${msg || '请联系管理员或稍后再试'}`);
  }
};
/**
 * 获取班级出勤信息
 * @param wkd 课程周几上课
 * @param start 开课时间
 * @param end 结课时间
 * @param bjid 班级ID
 * @param xsId 学生ID
 * @returns {}
 */
export const getCqDay = async (
  wkd?: any[],
  start?: string,
  end?: string,
  bjid?: string,
  xsId?: string,
) => {
  const myDate = new Date();
  const nowDate = new Date(moment(myDate).format('YYYY/MM/DD'));
  const res = await getAllKHXSCQ({
    xsId: xsId || '',
    bjId: bjid || '',
    CQZT: undefined,
    CQRQ: '',
  });
  if (res.status === 'ok') {
    if (start && end && wkd) {
      const arr = DateRange(start, end);
      const classbegins: any[] = [];
      arr.forEach((record: any) => {
        for (let i = 0; i < wkd.length; i += 1) {
          if (Week(record) === wkd[i] && !classbegins.includes(record)) {
            const current = new Date(moment(record).format('YYYY/MM/DD'));
            let status = current < nowDate ? '出勤' : '待上';
            if (res.data && res.data.length) {
              res.data.forEach((date: any) => {
                if (date.CQRQ === record) {
                  status = date.CQZT;
                }
              });
            }
            classbegins.push({
              status,
              date: moment(record).format('MM/DD'),
            });
          }
        }
      });
      return classbegins;
    }
  }
  return [];
};
/**
 * 组装班级出勤信息
 * @param bjid 班级ID
 * @param xsId 学生ID
 * @returns {}
 */
export const getData = async (bjid: string, xsId?: string) => {
  const res1 = await getKHPKSJByBJID({ id: bjid });
  if (res1.status === 'ok' && res1.data) {
    const attend = [...new Set(res1.data.map((n: { WEEKDAY?: any }) => n.WEEKDAY))];
    const res = await getKHBJSJ({ id: bjid });
    if (res.status === 'ok' && res.data && attend) {
      const start = res.data.KKRQ ? res.data.KKRQ : res.data.KHKCSJ!.KKRQ;
      const end = res.data.JKRQ ? res.data.JKRQ : res.data.KHKCSJ!.JKRQ;
      let ZJS: any;
      res.data.KHBJJs.forEach((item: any) => {
        if (item.JSLX === '主教师') {
          ZJS = item.JZGJBSJ?.XM;
        }
      });
      return {
        title: res.data.BJMC,
        start,
        end,
        kss: res.data.KSS,
        XQName: res.data.XQName,
        kcmc: res.data.KHKCSJ!.KCMC,
        skjs: ZJS || '',
        data: await getCqDay(attend, start, end, bjid, xsId),
      };
    }
  }
  return {
    status: 'nothing',
  };
};

export const getTableWidth = (columns: any[]) => {
  if (columns.length > 0) {
    let sum: number = 0;
    columns.forEach(({ width }) => {
      if (Number.isFinite(width)) {
        sum += width;
      } else {
        // 如果width 不是number类型默认家100
        sum += 100;
      }
    });
    // console.log('列表宽度',sum);
    return sum;
  }
  return 1300;
};
export const getCorpId = () => {
  return localStorage.getItem('corp') || '';
};

export const setCorpId = (corp: string) => {
  localStorage.setItem('corp', corp);
};

export const setAuthType = (authType: string) => {
  if (authType) {
    localStorage.setItem('authType', authType);
  }
};
export const getAuthType = () => {
  return localStorage.getItem('authType') || 'password';
};
export const removeAuthType = () => {
  localStorage.removeItem('authType');
};

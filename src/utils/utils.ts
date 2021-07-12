/* eslint-disable no-param-reassign */
import { parse } from 'querystring';
import type { MenuDataItem } from '@ant-design/pro-layout/lib/typings';
import { message } from 'antd';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  // if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
  //   return true;
  // }
  return window.location.hostname === 'preview.pro.ant.design';
};

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
      ? router.children.map((item) => mergeAuthority(item, ahList))
      : undefined,
  };
};

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

export const getLoginPath = () => {
  let loginPath: string;
  switch (envjudge()) {
    case 'com-wx-pc': // PC端企业微信
      loginPath = `${ENV_backUrl}/wechat/platAuth?plat=qywx&isMobile=false`;
      break;
    case 'com-wx-mobile': // 手机端企业微信
      loginPath = `${ENV_backUrl}/wechat/platAuth?plat=qywx&isMobile=true`;
      break;
    case 'wx-pc': // PC端微信
      loginPath = `${ENV_backUrl}/wechat/platAuth?plat=wx&isMobile=false`;
      break;
    case 'wx-mobile': // 手机端微信
      loginPath = `${ENV_backUrl}/wechat/platAuth?plat=wx&isMobile=true`;
      break;
    case 'mobile': // 手机
    case 'pc': // PC
    default:
      loginPath = '/user/login'; // `${ENV_backUrl}/auth/wechat`;
      break;
  }
  return loginPath;
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
 * 根据当前时间获取学年学期
 *
 * @param {API.XNXQ[]} list
 * @return {*}  {(API.XNXQ | null)}
 */
export const getCurrentXQ = (list: API.XNXQ[]): API.XNXQ | null => {
  if (!list.length) {
    return null;
  }
  const today = new Date();
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
 * @param {string} BMKSRQ 报名开始时间
 * @param {string} BMJSRQ 报名结束时间
 * @param {string} KKKSRQ 开课开始时间
 * @param {string} KKJSRQ 开课结束时间
 * @return {*}
 */
export const getCurrentStatus = (
  BMKSRQ: string,
  BMJSRQ: string,
  KKKSRQ: string,
  KKJSRQ: string,
) => {
  let currentStatus: 'enroll' | 'enrolling' | 'enrolled' | 'education' | 'noTips' | 'empty' =
    'empty';
  const today = new Date();
  const BMbegin = new Date(BMKSRQ);
  const BMend = new Date(BMJSRQ);
  const KKbegin = new Date(KKKSRQ);
  const KKend = new Date(KKJSRQ);

  if (BMbegin <= today && today <= BMend) {
    currentStatus = 'enroll';
    if (KKbegin <= today && today <= BMend) {
      // const nowSta = (today.getTime() - KKbegin.getTime()) / 7 / 24 / 60 / 60 / 1000;
      // if (nowSta > 2) {
      //   currentStatus = 'noTips';
      // } else {
      currentStatus = 'enrolling';
      // }
    }
  } else if (BMbegin <= today && today <= KKbegin) {
    currentStatus = 'enrolled';
  } else if (KKbegin <= today && today <= KKend) {
    const nowSta = (today.getTime() - KKbegin.getTime()) / 7 / 24 / 60 / 60 / 1000;
    if (nowSta > 2) {
      currentStatus = 'noTips';
    } else {
      currentStatus = 'education';
    }
  }
  return currentStatus;
};

/**
 * 根据返回错误信息优化页面错误提示
 *
 * @param msg: string
 */
 export const enHenceMsg = (msg: string) => {
  if (msg.indexOf('Cannot') > -1) {
    message.error(`删除失败，请先删除关联数据,请联系管理员或稍后再试`);
  } else if (msg.indexOf('token') > -1) {
    message.error('身份验证过期，请重新登录');
  } else if (msg.indexOf('Validation') > -1) {
    message.error('已存在该数据，请勿重复添加');
  } else {
    message.error(`${msg},请联系管理员或稍后再试`);
  }
};
/* eslint-disable no-param-reassign */
import { parse } from 'querystring';
import type { MenuDataItem } from '@ant-design/pro-layout/lib/typings';

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
}
/**
 * 根据当前时间获取学年学期
 *
 * @export getCurrentXQ
 * @returns currentXQ || null
 */
export const getCurrentXQ = (list: any[]) => {
  const today = new Date();
  const currentXQ = list.find((xq: any) => {
    const begin = new Date(xq.KSRQ);
    const end = new Date(xq.JSRQ);
    if (begin <= today && today <= end) {
      return true;
    }
    return false;
  })
  return currentXQ;
}
/**
 * 根据当前时间获取移动端时段
 *
 * @export getCurrentStatus
 * @returns string
 */
export const getCurrentStatus = (BMKSRQ: string, BMJSRQ: string, KKKSRQ: string, KKJSRQ: string) => {
  let currentStatus = 'empty';
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
}
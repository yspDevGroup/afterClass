/* eslint-disable no-param-reassign */
import { parse } from 'querystring';
import type { MenuDataItem } from '@ant-design/pro-layout/lib/typings';
import { message } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';
import { getKHPKSJByBJID } from '@/services/after-class/khpksj';
import { getKHBJSJ } from '@/services/after-class/khbjsj';
import { DateRange, Week } from './Timefunction';

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
export const enHenceMsg = (msg?: string) => {
  if (msg && msg.indexOf('Cannot') > -1) {
    message.error(`操作失败，该项存在关联数据,请清除关联数据后再试`);
  } else if (msg && msg.indexOf('token') > -1 || msg && msg.indexOf('Token') > -1) {
    history.replace('/auth_callback/overDue');
  } else if (msg && msg.indexOf('Validation') > -1) {
    message.error('操作失败，该项未通过校验，请检查数据是否重复后再试');
  } else {
    message.error(`${msg},请联系管理员或稍后再试`);
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
export const getCqDay = async (wkd?: any[], start?: string, end?: string, bjid?: string, xsId?: string) => {
  const myDate = new Date();
  const nowDate = new Date(moment(myDate).format('YYYY/MM/DD'));
  const res = await getAllKHXSCQ({
    xsId: xsId || '',
    bjId: bjid || '',
    CQZT: '',
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
              })
            }
            classbegins.push({
              status,
              date: moment(record).format('MM/DD'),
            })
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
    const attend = [...new Set(res1.data.map((n: { WEEKDAY: any; }) => n.WEEKDAY))];
    const res = await getKHBJSJ({ id: bjid });
    if (res.status === 'ok' && res.data && attend) {
      const start = res.data.KKRQ ? res.data.KKRQ : res.data.KHKCSJ!.KKRQ;
      const end = res.data.JKRQ ? res.data.JKRQ : res.data.KHKCSJ!.JKRQ;
      return {
        title: res.data.BJMC,
        start,
        end,
        kss: res.data.KSS,
        XQName: res.data.XQName,
        kcmc: res.data.KHKCSJ!.KCMC,
        data: await getCqDay(attend, start, end, bjid, xsId)
      }
    }
  }
  return {
    status: 'nothing'
  };
};
/**
 * 修改头部标题的函数
 * @param title 
 */
export const ChangePageTitle = (title: string) => {
  document.title = title;
  const iframe = document.createElement('iframe');
  iframe.style.cssText ='display: none;';
  document.body.appendChild(iframe);
  iframe.onload = () =>{
    setTimeout(()=> {
      iframe.onload =()=>{};
    }, 0);
  }
};
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-console */
/*
 * @description:
 * @author: zpl
 * @Date: 2021-06-09 08:57:20
 * @LastEditTime: 2021-10-18 14:02:48
 * @LastEditors: zpl
 */
import {
  createWechatToken,
  getQYJsSignature,
  getYYJsSignature,
} from '@/services/after-class/wechat';
import { removeOAuthToken, saveOAuthToken } from './utils';

/**
 * 保存微信缓存
 *
 * @param {{
 *   suiteID?: string;
 *   CorpId?: string;
 *   userInfo?: Record<string, unknown>;
 * }} param
 */
export const saveWechatInfo = (param: {
  suiteID?: string;
  CorpId?: string;
  userInfo?: Record<string, unknown>;
}) => {
  const { suiteID, CorpId, userInfo } = param;
  if (suiteID) localStorage.setItem('suiteID', suiteID);
  if (CorpId) localStorage.setItem('CorpId', CorpId);
  if (userInfo) localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

/**
 * 读取微信缓存
 *
 * @return {*}  {Promise<{
 *   suiteID: string;
 *   CorpId: string;
 * }>}
 */
export const getWechatInfo = (): {
  /** 应用ID */
  suiteID: string;
  /** 企业ID */
  CorpId: string;
  /** 用户信息 */
  userInfo: Record<string, unknown>;
} => {
  let userInfo;
  try {
    userInfo = JSON.parse(localStorage.getItem('userInfo') || '');
  } catch (error) {
    // do nothing
  }
  return {
    suiteID: localStorage.getItem('suiteID') || '',
    CorpId: localStorage.getItem('CorpId') || '',
    userInfo,
  };
};

/**
 * 清除微信缓存
 *
 */
export const removeWechatInfo = () => {
  localStorage.removeItem('suiteID');
  localStorage.removeItem('CorpId');
  localStorage.removeItem('userInfo');
};

/**
 * 查看缓存，判断是否需要发送请求来获取微信用户信息
 *
 * @param {string} [suiteID] 应用ID
 * @return {*}  {boolean}
 */
export const needGetWechatUserInfo = (suiteID?: string): boolean => {
  if (authType !== 'wechat') {
    return true;
  }
  // 认证回调页不发起
  if (window.location.pathname.startsWith('/auth_callback')) return false;

  const wechatInfo = getWechatInfo();
  return wechatInfo.suiteID !== suiteID || !wechatInfo.userInfo;
};

/**
 * 通知后台创建微信认证token并在前端进行缓存
 *
 * @param {Record<string, string>} params
 * @return {*}  {Promise<boolean>}
 */
export const creatTokenForWechat = async (params: Record<string, string>): Promise<boolean> => {
  const tokenRes = await createWechatToken({ params });
  if (tokenRes.status === 'ok') {
    saveWechatInfo(params);
    await saveOAuthToken({
      access_token: tokenRes.data,
    });
    return true;
  }
  removeOAuthToken();
  removeWechatInfo();
  return false;
};

/**
 * 通过config接口注入权限验证配置
 *
 * @param {*} jsApiList 需要使用的JS接口列表，凡是要调用的接口都需要传进来
 */
export const initWXConfig = async (jsApiList: string[], num = 1) => {
  const res = await getQYJsSignature({ url: window.location.href.split('#')[0] });
  if (res.status === 'ok') {
    const { appId, timestamp = 0, nonceStr, signature = '' } = res.data || {};
    const currentConf = {
      beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId, // 必填，企业微信的corpID
      timestamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
      jsApiList: jsApiList || ['checkJsApi'], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
    };
    return new Promise((resolve, reject) => {
      console.log('权限验证配置: ', currentConf);
      wx.config(currentConf);
      wx.ready(() => {
        console.log('权限验证配置注入成功');
        resolve('权限验证配置注入成功');
      });
      wx.error((err: any) => {
        console.log('wx.error', err);
        reject(`注入权限验证配置失败： ${JSON.stringify(err)}`);
        if (num <= 3) {
          // eslint-disable-next-line no-param-reassign
          num += 1;
          setTimeout(async () => {
            await initWXConfig(jsApiList, num);
          }, 100);
        }
      });
    });
  }
  return Promise.reject(`获取签名失败： ${res.message}`);
};

/**
 * 通过agentConfig注入应用的权限
 *
 * @param {string[]} jsApiList 需要使用的接口名称
 */
export const initWXAgentConfig = async (jsApiList: string[], num = 1) => {
  const res = await getYYJsSignature({ url: window.location.href.split('#')[0] });
  if (res.status === 'ok') {
    const { corpid, agentid, timestamp = 0, nonceStr, signature = '' } = res.data || {};
    const currentConf = {
      corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
      agentid, // 必填，企业微信的应用id （e.g. 1000247）
      timestamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
      jsApiList: jsApiList || ['selectExternalContact'], // 必填，传入需要使用的接口名称
    };
    console.log('注入应用权限: ', currentConf);
    return new Promise((resolve, reject) => {
      wx.agentConfig({
        ...currentConf,
        success: (r: any) => {
          // 回调
          console.log('应用的权限注入成功');
          resolve(r);
        },
        fail: (r: any) => {
          console.log('注入应用权限失败:', r);
          if (r.errMsg.indexOf('function not exist') > -1) {
            console.log('版本过低请升级');
          }
          reject(`注入应用权限失败： ${r}`);
          if (num <= 3) {
            // eslint-disable-next-line no-param-reassign
            num += 1;
            setTimeout(async () => {
              await initWXAgentConfig(jsApiList, num);
            }, 100);
          }
        },
      });
    });
  }
  return Promise.reject(`获取签名失败： ${res.message}`);
};

export const regWechatAPI = async (apiList?: string[]) => {
  const jsApiList = apiList || ['checkJsApi'];
  if (/MicroMessenger/i.test(navigator.userAgent)) {
    await initWXConfig(jsApiList);
  }
  await initWXAgentConfig(jsApiList);
};

/**
 * 显示用户名称
 *
 * @param {(HTMLElement | null)} [container]
 * @param {string} [openid]
 * @return {*}
 */
export const showUserName = (container?: HTMLElement | null, openid?: string, multi?: boolean) => {
  if (!container || !openid) return;
  const element = document.createElement('ww-open-data');
  element.setAttribute('type', 'userName');
  element.setAttribute('openid', openid);
  if (!multi) {
    // eslint-disable-next-line no-param-reassign
    container.innerHTML = '';
  }
  container.appendChild(element);
};

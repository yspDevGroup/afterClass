// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 微信扫码认证 GET /wechat/auth */
export async function wechatOauth(options?: { [key: string]: any }) {
  return request<any>('/wechat/auth', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 微信终端认证 GET /wechat/platAuth */
export async function wechatPlatOauth(options?: { [key: string]: any }) {
  return request<any>('/wechat/platAuth', {
    method: 'GET',
    ...(options || {}),
  });
}

/** wechat认证回调 GET /wechat/auth/callback */
export async function wechatAuthCallback(options?: { [key: string]: any }) {
  return request<any>('/wechat/auth/callback', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 企业微信服务商数据回调验证 GET /wechat/dataCallback */
export async function wechatDataCallback(options?: { [key: string]: any }) {
  return request<any>('/wechat/dataCallback', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 企业微信服务商数据回调 POST /wechat/dataCallback */
export async function wechatDataCallback_2(options?: { [key: string]: any }) {
  return request<any>('/wechat/dataCallback', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 企业微信服务商指令回调验证 GET /wechat/cmdCallback */
export async function wechatDataCallback_3(options?: { [key: string]: any }) {
  return request<any>('/wechat/cmdCallback', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 企业微信服务商指令回调 POST /wechat/cmdCallback */
export async function wechatDataCallback_4(options?: { [key: string]: any }) {
  return request<any>('/wechat/cmdCallback', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 微信应用设置 GET /wechat/settings */
export async function settingOnWechat(options?: { [key: string]: any }) {
  return request<any>('/wechat/settings', {
    method: 'GET',
    ...(options || {}),
  });
}

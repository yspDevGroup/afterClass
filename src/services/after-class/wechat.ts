// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 微信扫码认证 GET /wechat/auth */
export async function wechatOauth(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/wechat/auth', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 微信终端认证 GET /wechat/platAuth */
export async function wechatPlatOauth(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/wechat/platAuth', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** wechat认证回调 GET /wechat/auth/callback */
export async function wechatAuthCallback(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/wechat/auth/callback', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 企业微信服务商数据回调验证 GET /wechat/dataCallback */
export async function wechatDataCallback(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/wechat/dataCallback', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 企业微信服务商数据回调 POST /wechat/dataCallback */
export async function wechatDataCallback_2(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/wechat/dataCallback', {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 企业微信服务商指令回调验证 GET /wechat/cmdCallback */
export async function wechatDataCallback_3(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/wechat/cmdCallback', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 企业微信服务商指令回调 POST /wechat/cmdCallback */
export async function wechatDataCallback_4(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/wechat/cmdCallback', {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取wx.config签名 POST /wechat/getQYJsSignature */
export async function getQYJsSignature(
  params: {
    // path
  },
  body: {
    /** 签名用的url必须是调用JS接口页面的完整URL */
    url?: string;
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: { appId?: string; timestamp?: number; nonceStr?: string; signature?: string };
    message?: string;
  }>('/wechat/getQYJsSignature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 获取wx.agentConfig签名 POST /wechat/getYYJsSignature */
export async function getYYJsSignature(
  params: {
    // path
  },
  body: {
    /** 签名用的url必须是调用JS接口页面的完整URL */
    url?: string;
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      corpid?: string;
      agentid?: string;
      timestamp?: number;
      nonceStr?: string;
      signature?: string;
    };
    message?: string;
  }>('/wechat/getYYJsSignature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 微信应用设置 GET /wechat/settings */
export async function settingOnWechat(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/wechat/settings', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取部门列表 GET /wechat/getDepList */
export async function getDepList(
  params: {
    // query
    /** 部门id。获取指定部门及其下的子部门。 如果不填，默认获取全量组织架构 */
    id?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/wechat/getDepList', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 获取部门成员详情 GET /wechat/getDepUsers */
export async function getDepUsers(
  params: {
    // query
    /** 部门id */
    id: string;
    /** 1/0：是否递归获取子部门下面的成员 */
    fetch_child: 0 | 1;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/wechat/getDepUsers', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 获取部门成员列表(教师) GET /wechat/getDepUserList */
export async function getDepUserList(
  params: {
    // query
    /** 部门id */
    id: string;
    /** 1/0：是否递归获取子部门下面的成员 */
    fetch_child: 0 | 1;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/wechat/getDepUserList', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 获取部门列表(学校) GET /wechat/getSchDepList */
export async function getSchDepList(
  params: {
    // query
    /** 部门id */
    id?: string;
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/wechat/getSchDepList', {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** wechat支付回调 POST /wechat/trade/callback */
export async function wechatTradeCallback(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<any>('/wechat/trade/callback', {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

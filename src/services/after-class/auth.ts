// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 账密登录 POST /auth/account */
export async function postAccount(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: { currentAuthority?: string[]; token?: string; type?: 'account' | 'mobile' | 'github' };
    message?: string;
  }>('/auth/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 退出登录 POST /auth/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<{ status?: 'ok' | 'error' }>('/auth/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 账密登录 POST /auth/login */
export async function login(
  body: {
    /** 登录平台 */
    plat?: string;
    /** 教师ID */
    JZGJBSJId?: string;
    /** 密码 */
    password?: string;
  },
  options?: { [key: string]: any },
) {
  return request<any>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

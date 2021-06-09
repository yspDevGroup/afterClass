// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** github认证回调 GET /auth/github/callback */
export async function githubCallback(options?: { [key: string]: any }) {
  return request<any>('/auth/github/callback', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Route used by the frontend app to validate the session and retrieve the CSRF token. GET /user/refresh */
export async function getUserRefresh(options?: { [key: string]: any }) {
  return request<{ csrfToken?: string }>('/user/refresh', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 查询所有用户 GET /user/ */
export async function getAllUser(options?: { [key: string]: any }) {
  return request<{ status?: 'ok' | 'error'; data?: API.CurrentUser[]; message?: string }>(
    '/user/',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 获取当前用户 GET /user/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data?: {
      info: {
        id?: string;
        XXDM?: string;
        loginName?: string;
        username?: string;
        avatar?: string;
        identityId?: string;
        departmentId?: string;
        status?: number;
        auth?: '老师' | '家长' | '管理员';
        userId?: string;
      };
      token?: string;
    };
    message?: string;
  }>('/user/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新当前用户信息 PUT /user/currentUser */
export async function updateUser(body: API.CreateUser, options?: { [key: string]: any }) {
  return request<{ status?: 'ok' | 'error'; message?: string }>('/user/currentUser', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建用户 PUT /user/create */
export async function createUser(body: API.CreateUser, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      XXDM?: string;
      loginName?: string;
      username?: string;
      avatar?: string;
      identityId?: string;
      departmentId?: string;
      status?: number;
      auth?: '老师' | '家长' | '管理员';
      userId?: string;
    };
    message?: string;
  }>('/user/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户数据 DELETE /user/${param0} */
export async function deleteUser(
  params: {
    // path
    /** 用户ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/user/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

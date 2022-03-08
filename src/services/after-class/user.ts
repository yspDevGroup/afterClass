// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

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
export async function currentUser(
  params: {
    // query
    /** 登录平台类型 */
    plat?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    status?: 'ok' | 'error';
    data?: {
      info?: {
        id?: string;
        jgId?: string | any;
        jyjId?: string | any;
        xxId?: string | any;
        XXDM?: string;
        XD?: string;
        XZQHM?: string | any;
        loginName?: string;
        username?: string;
        avatar?: string;
        identityId?: string;
        departmentId?: string;
        status?: number;
        userType?: string;
        type?: string;
        auth?: '老师' | '家长' | '管理员' | { authType?: string; appName?: string }[];
        adminAuth?: string[];
        userId?: string;
        UserId?: string;
        CorpId?: string;
        subscriber_info?: {
          remark?: string;
          children?: {
            njId?: string;
            department?: string[];
            student_userid?: string;
            name?: string;
          }[];
        };
        roles?: {
          id?: string;
          name?: string;
          describe?: string;
          roleType?: string;
          orderIndex?: number;
          rules?: {
            id?: string;
            permission?: { id?: string; describe?: string; permission?: string };
            subApp?: {
              id?: string;
              describe?: string;
              icon?: string;
              isEnabled?: boolean;
              isShow?: string;
              name?: string;
              orderIndex?: string;
              path?: string;
              subAppGroupId?: string;
              target?: string;
            };
          }[];
        }[];
      };
    };
    message?: string;
  }>('/user/currentUser', {
    method: 'GET',
    params: {
      ...params,
    },
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
    data?: {
      id?: string;
      jgId?: string | any;
      jyjId?: string | any;
      xxId?: string | any;
      XXDM?: string;
      XD?: string;
      XZQHM?: string | any;
      loginName?: string;
      username?: string;
      avatar?: string;
      identityId?: string;
      departmentId?: string;
      status?: number;
      userType?: string;
      type?: string;
      auth?: '老师' | '家长' | '管理员' | { authType?: string; appName?: string }[];
      adminAuth?: string[];
      userId?: string;
      UserId?: string;
      CorpId?: string;
      subscriber_info?: {
        remark?: string;
        children?: {
          njId?: string;
          department?: string[];
          student_userid?: string;
          name?: string;
        }[];
      };
      roles?: {
        id?: string;
        name?: string;
        describe?: string;
        roleType?: string;
        orderIndex?: number;
        rules?: {
          id?: string;
          permission?: { id?: string; describe?: string; permission?: string };
          subApp?: {
            id?: string;
            describe?: string;
            icon?: string;
            isEnabled?: boolean;
            isShow?: string;
            name?: string;
            orderIndex?: string;
            path?: string;
            subAppGroupId?: string;
            target?: string;
          };
        }[];
      }[];
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
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/user/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 用户获取首页信息 POST /user/homepage */
export async function homePageInfo(
  body: {
    /** 年级ID */
    njId?: string;
    /** 年级ID */
    bjId?: string;
    /** 校区ID */
    XQSJId?: string;
    /** 学年学期ID */
    XNXQId?: string;
    /** 学校ID */
    XXJBSJId?: string;
    /** 学生ID */
    XSId?: string;
    /** 教师ID */
    JSId?: string;
  },
  options?: { [key: string]: any },
) {
  return request<any>('/user/homepage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 刷新Token GET /user/refreshToken */
export async function refreshToken(options?: { [key: string]: any }) {
  return request<{ status?: 'ok' | 'error'; data?: string; message?: string }>(
    '/user/refreshToken',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** github认证回调 GET /auth/github/callback */
export async function githubCallback(options?: { [key: string]: any }) {
  return request<any>('/auth/github/callback', {
    method: 'GET',
    ...(options || {}),
  });
}

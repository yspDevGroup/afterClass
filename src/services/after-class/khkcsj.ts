// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取课后课程数据 GET /khkcsj/${param0} */
export async function getKHKCSJ(
  params: {
    // path
    /** 课后课程ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      KCMC?: string;
      KCTP?: string;
      KCSC?: number;
      KCZT?: string;
      KCMS?: string;
      XNXQId?: string;
      XNXQ?: { id?: string; XN?: string; XQ?: string; KSRQ?: string; JSRQ?: string };
      KHKCLX?: { id?: string; KCLX?: string };
      KHBJSJs?: {
        id?: string;
        BJMC?: string;
        BJMS?: string;
        BJZT?: string;
        ZJS?: string;
        FJS?: string;
        BJRS?: number;
        KSS?: number;
        FY?: number;
        KKRQ?: string;
        JKRQ?: string;
        KBYS?: string;
      }[];
    };
    message?: string;
  }>(`/khkcsj/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除课后课程数据 DELETE /khkcsj/${param0} */
export async function deleteKHKCSJ(
  params: {
    // path
    /** 课后课程ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khkcsj/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有课后课程数据 POST /khkcsj/ */
export async function getAllKHKCSJ(
  body: {
    /** 学年 */
    xn?: string;
    /** 学期 */
    xq?: string;
    /** 页数 */
    page?: number;
    /** 每页记录数 */
    pageCount?: number;
    /** 课程名称 */
    name?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ status?: 'ok' | 'error'; data?: API.KHKCSJ[]; message?: string }>('/khkcsj/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建课后课程数据 PUT /khkcsj/create */
export async function createKHKCSJ(body: API.CreateKHKCSJ, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      KCMC?: string;
      KCTP?: string;
      KCSC?: number;
      KCZT?: string;
      KCMS?: string;
      XNXQId?: string;
      XNXQ?: { id?: string; XN?: string; XQ?: string; KSRQ?: string; JSRQ?: string };
      KHKCLX?: { id?: string; KCLX?: string };
      KHBJSJs?: {
        id?: string;
        BJMC?: string;
        BJMS?: string;
        BJZT?: string;
        ZJS?: string;
        FJS?: string;
        BJRS?: number;
        KSS?: number;
        FY?: number;
        KKRQ?: string;
        JKRQ?: string;
        KBYS?: string;
      }[];
    };
    message?: string;
  }>('/khkcsj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新课后课程数据 PUT /khkcsj/update/${param0} */
export async function updateKHKCSJ(
  params: {
    // path
    /** 课后课程ID */
    id: string;
  },
  body: API.UpdateKHKCSJ,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khkcsj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

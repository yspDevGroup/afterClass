// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取课后班级数据 GET /khbjsj/${param0} */
export async function getKHBJSJ(
  params: {
    // path
    /** 课后班级ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
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
      KHKCSJId?: string;
      KHKCSJ?: {
        id?: string;
        KCMC?: string;
        KCLX?: string;
        KCTP?: string;
        KCSC?: number;
        KCZT?: string;
        KCMS?: string;
      };
      NJSJs?: { id?: string; NJ?: number; NJMC?: string }[];
      KHPKSJs?: { id?: string; WEEKDAY?: '0' | '1' | '2' | '3' | '4' | '5' | '6' }[];
    };
    message?: string;
  }>(`/khbjsj/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除课后班级数据 DELETE /khbjsj/${param0} */
export async function deleteKHBJSJ(
  params: {
    // path
    /** 课后班级ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khbjsj/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有课后班级数据 POST /khbjsj/ */
export async function getAllKHBJSJ(
  body: {
    /** 课后课程ID */
    kcId?: string;
    /** 年级ID */
    njId?: string;
    /** 学年学期ID */
    xnxqId?: string;
    /** 页数 */
    page?: number;
    /** 每页记录数 */
    pageCount?: number;
    /** 班级名称 */
    name?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ status?: 'ok' | 'error'; data?: API.KHBJSJ[]; message?: string }>('/khbjsj/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建课后班级数据 PUT /khbjsj/create */
export async function createKHBJSJ(body: API.CreateKHBJSJ, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: {
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
      KHKCSJId?: string;
      KHKCSJ?: {
        id?: string;
        KCMC?: string;
        KCLX?: string;
        KCTP?: string;
        KCSC?: number;
        KCZT?: string;
        KCMS?: string;
      };
      NJSJs?: { id?: string; NJ?: number; NJMC?: string }[];
      KHPKSJs?: { id?: string; WEEKDAY?: '0' | '1' | '2' | '3' | '4' | '5' | '6' }[];
    };
    message?: string;
  }>('/khbjsj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新课后班级数据 PUT /khbjsj/update/${param0} */
export async function updateKHBJSJ(
  params: {
    // path
    /** 课后班级ID */
    id: string;
  },
  body: API.UpdateKHBJSJ,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khbjsj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

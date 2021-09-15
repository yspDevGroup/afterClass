// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 创建课后服务-课程评价数据 PUT /khbjpj/create */
export async function createKHBJPJ(body: API.CreateKHBJPJ, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      PJFS?: number;
      PY?: string;
      XSId?: string;
      XSXM?: string;
      KHBJSJId?: string;
    };
    message?: string;
  }>('/khbjpj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取课后服务-课程评价数据 POST /khbjpj/getAll */
export async function getKHBJPJ(
  body: {
    /** 班级ID */
    KHBJSJId?: string;
    /** 学生ID */
    XSId?: string;
    /** 学校ID */
    XXJBSJId?: string;
    /** 学年学期ID */
    XNXQId?: string;
    /** 页数 */
    page?: number;
    /** 每页记录数 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    status?: 'ok' | 'error';
    data?: { count?: number; rows?: API.KHBJPJ[] };
    message?: string;
  }>('/khbjpj/getAll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除课后服务-课程评价数据 DELETE /khbjpj/${param0} */
export async function deleteKHBJPJ(
  params: {
    // path
    /** 课后服务-课程评价数据ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khbjpj/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 更新课后服务-课程评价数据 PUT /khbjpj/update/${param0} */
export async function updateKHBJPJ(
  params: {
    // path
    /** 课后服务-课程评价数据ID */
    id: string;
  },
  body: API.UpdateKHBJPJ,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khbjpj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

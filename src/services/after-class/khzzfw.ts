// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 创建课后增值服务 PUT /khzzfw/create */
export async function createKHZZFW(body: API.CreateKHZZFW, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: { id?: string; FWMC?: string; FWNR?: string; FWJGMC?: string; FWZT?: number };
    message?: string;
  }>('/khzzfw/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取课后增值服务 POST /khzzfw/getAll */
export async function getKHZZFW(
  body: {
    /** 学校ID */
    XXJBSJId?: string;
    /** 页数 */
    page?: number;
    /** 每页记录数 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    status?: 'ok' | 'error';
    data?: { count?: number; rows?: API.KHZZFW[] };
    message?: string;
  }>('/khzzfw/getAll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除课后增值服务 DELETE /khzzfw/${param0} */
export async function deleteKHZZFW(
  params: {
    // path
    /** 课后增值服务ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khzzfw/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 更新课后增值服务 PUT /khzzfw/update/${param0} */
export async function updateKHZZFW(
  params: {
    // path
    /** 课后增值服务数据ID */
    id: string;
  },
  body: API.UpdateKHZZFW,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khzzfw/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}
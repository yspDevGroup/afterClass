// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 创建课后服务退课记录 PUT /khtksj/create */
export async function createKHTKSJ(body: API.CreateKHTKSJ[], options?: { [key: string]: any }) {
  return request<{ status?: 'ok' | 'error'; message?: string }>('/khtksj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取课后服务退课记录 POST /khtksj/getAll */
export async function getKHTKSJ(
  body: {
    /** 退课状态 */
    ZT?: number;
    /** 学生ID */
    XSId?: string;
    /** 学年学期ID */
    XNXQId?: string;
    /** 课后服务班级ID */
    KHBJSJId?: string;
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
    data?: { count?: number; rows?: API.KHTKSJ[] };
    message?: string;
  }>('/khtksj/getAll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除课后服务退课记录 DELETE /khtksj/${param0} */
export async function deleteKHTKSJ(
  params: {
    // path
    /** 课后服务退课记录ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khtksj/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 更新课后服务退课记录 PUT /khtksj/update/${param0} */
export async function updateKHTKSJ(
  params: {
    // path
    /** 课后服务退课记录ID */
    id: string;
  },
  body: API.UpdateKHTKSJ,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khtksj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}
// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 创建课后服务-服务班 PUT /khfwbj/create */
export async function createKHFWBJ(
  body: {
    BJSJId?: string;
    XNXQId?: string;
    ZT?: number;
    FWMC?: string;
    FWTP?: string;
    FWMS?: string;
    FWFY?: number;
    KXSL?: number;
    KHBJSJIds?: { KHBJSJId?: string; LX?: number }[];
  },
  options?: { [key: string]: any },
) {
  return request<any>('/khfwbj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取课后服务-服务班 POST /khfwbj/getDetail */
export async function getKHFWBJ(
  body: {
    BJSJId?: string;
    XNXQId?: string;
  },
  options?: { [key: string]: any },
) {
  return request<any>('/khfwbj/getDetail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除课后服务-服务班 DELETE /khfwbj/${param0} */
export async function deleteKHFWBJ(
  params: {
    // path
    /** 课后服务-服务班ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khfwbj/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新课后服务-服务班 PUT /khfwbj/update/${param0} */
export async function updateKHFWBJ(
  params: {
    // path
    /** 课后服务-服务班ID */
    id: string;
  },
  body: {
    BJSJId?: string;
    XNXQId?: string;
    ZT?: number;
    FWMC?: string;
    FWTP?: string;
    FWMS?: string;
    FWFY?: number;
    KXSL?: number;
    KHBJSJIds?: { KHBJSJId?: string; LX?: number }[];
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khfwbj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 学生批量报名服务班 PUT /khfwbj/studentRegistration */
export async function studentRegistration(
  body: {
    KHFWBJId?: string;
    ZT?: number;
    XSJBSJIds?: string[];
    KHBJSJIds?: string[];
  },
  options?: { [key: string]: any },
) {
  return request<{ status?: 'ok' | 'error'; data?: string; message?: string }>(
    '/khfwbj/studentRegistration',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

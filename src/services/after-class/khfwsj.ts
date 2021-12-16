// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取课后服务数据 GET /khfwsj/${param0} */
export async function getKHFWSJ(
  params: {
    // path
    /** 课后服务ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      FWMC?: string;
      FWMS?: string;
      FWTP?: string;
      FWZT?: number;
      FWFY?: number;
      ZDKCS?: number;
      XQSJId?: string;
      XQSJ?: { id?: string; XQMC?: string; XQH?: string; XQDZ?: string };
      XNXQId?: string;
      XNXQ?: { id?: string; XN?: string; XQ?: string };
    };
    message?: string;
  }>(`/khfwsj/${param0}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/** 更新课后服务数据 PUT /khfwsj/${param0} */
export async function updateKHFWSJ(
  params: {
    // path
    /** 课后服务ID */
    id: string;
  },
  body: API.UpdateKHFWSJ,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<any>(`/khfwsj/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

/** 删除课后服务数据 DELETE /khfwsj/${param0} */
export async function deleteKHFWSJ(
  params: {
    // path
    /** 课后服务数据id */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khfwsj/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 新增课后服务数据 PUT /khfwsj/create */
export async function createKHFWSJ(body: API.CreateKHFWSJ, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      FWMC?: string;
      FWMS?: string;
      FWTP?: string;
      FWZT?: number;
      FWFY?: number;
      ZDKCS?: number;
      XQSJId?: string;
      XQSJ?: { id?: string; XQMC?: string; XQH?: string; XQDZ?: string };
      XNXQId?: string;
      XNXQ?: { id?: string; XN?: string; XQ?: string };
    };
    message?: string;
  }>('/khfwsj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

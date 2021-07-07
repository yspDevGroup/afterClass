// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取排课数据 GET /pksj/${param0} */
export async function getPKSJ(
  params: {
    // path
    /** 排课ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      KCH?: string;
      SKJSGH?: string;
      FJBH?: string;
      SKRQ?: string;
      KSKJS?: number;
      JSKJS?: number;
    };
    message?: string;
  }>(`/pksj/${param0}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/** 删除排课数据 DELETE /pksj/${param0} */
export async function deletePKSJ(
  params: {
    // path
    /** 排课ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/pksj/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 查询所有排课数据 GET /pksj/ */
export async function getAllPKSJ(options?: { [key: string]: any }) {
  return request<{ status?: 'ok' | 'error'; data?: API.PKSJ[]; message?: string }>('/pksj/', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建排课数据 PUT /pksj/create */
export async function createPKSJ(body: API.CreatePKSJ, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      KCH?: string;
      SKJSGH?: string;
      FJBH?: string;
      SKRQ?: string;
      KSKJS?: number;
      JSKJS?: number;
    };
    message?: string;
  }>('/pksj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新排课数据 PUT /pksj/update/${param0} */
export async function updatePKSJ(
  params: {
    // path
    /** 排课ID */
    id: string;
  },
  body: API.UpdatePKSJ,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/pksj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

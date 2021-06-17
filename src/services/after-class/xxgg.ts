// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取学校公告记录 GET /xxgg/${param0} */
export async function getXXGG(
  params: {
    // path
    /** 学校配置ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{
    status?: 'ok' | 'error';
    data?: { BT?: string; NR?: string };
    message?: string;
  }>(`/xxgg/${param0}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/** 删除学校公告记录 DELETE /xxgg/${param0} */
export async function deleteXXGG(
  params: {
    // path
    /** 学校配置ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xxgg/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 查询所有学校公告记录 GET /xxgg/all */
export async function getAllXXGG(options?: { [key: string]: any }) {
  return request<{ status?: 'ok' | 'error'; data?: API.XXGG[]; message?: string }>('/xxgg/all', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建学校公告记录 PUT /xxgg/create */
export async function createXXGG(body: API.CreateXXGG[], options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data?: { BT?: string; NR?: string };
    message?: string;
  }>('/xxgg/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新学校公告记录 PUT /xxgg/update/${param0} */
export async function updateXXGG(
  params: {
    // path
    /** 学校配置ID */
    id: string;
  },
  body: API.UpdateXXGG,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xxgg/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}
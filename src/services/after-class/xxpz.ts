// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取学校配置数据 GET /xxpz/${param0} */
export async function getXXPZ(
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
    data?: { KEY?: 'BMKSSJ' | 'BMJSSJ' | 'KKRQ' | 'JKRQ'; VALUE?: string; REMARK?: string };
    message?: string;
  }>(`/xxpz/${param0}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/** 删除学校配置数据 DELETE /xxpz/${param0} */
export async function deleteXXPZ(
  params: {
    // path
    /** 学校配置ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xxpz/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 查询所有学校配置数据 GET /xxpz/all */
export async function getAllXXPZ(options?: { [key: string]: any }) {
  return request<{ status?: 'ok' | 'error'; data?: API.XXPZ[]; message?: string }>('/xxpz/all', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建学校配置数据 PUT /xxpz/create */
export async function createXXPZ(body: API.CreateXXPZ[], options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data?: { KEY?: 'BMKSSJ' | 'BMJSSJ' | 'KKRQ' | 'JKRQ'; VALUE?: string; REMARK?: string };
    message?: string;
  }>('/xxpz/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新学校配置数据 PUT /xxpz/update/${param0} */
export async function updateXXPZ(
  params: {
    // path
    /** 学校配置ID */
    id: string;
  },
  body: API.UpdateXXPZ,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xxpz/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

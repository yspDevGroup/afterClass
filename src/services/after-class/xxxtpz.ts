// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取学校系统配置数据 GET /xxxtpz/${param0} */
export async function getXXXTPZ(
  params: {
    // path
    /** 学校系统配置ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      KSSJ?: string;
      JSSJ?: string;
      KJS?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
      XXJBSJ?: {
        id?: string;
        XXDM?: string;
        XXMC?: string;
        XXYWMC?: string;
        XXDZ?: string;
        XXYZBM?: string;
        XZQHM?: string;
      };
    };
    message?: string;
  }>(`/xxxtpz/${param0}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/** 删除学校系统配置数据 DELETE /xxxtpz/${param0} */
export async function deleteXXXTPZ(
  params: {
    // path
    /** 学校系统配置ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xxxtpz/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 查询所有学校系统配置数据 GET /xxxtpz/all/${param0} */
export async function getAllXXXTPZ(
  params: {
    // path
    /** 学校ID */
    xxid: string;
  },
  options?: { [key: string]: any },
) {
  const { xxid: param0 } = params;
  return request<{ status?: 'ok' | 'error'; data?: API.XXXTPZ[]; message?: string }>(
    `/xxxtpz/all/${param0}`,
    {
      method: 'GET',
      params: { ...params },
      ...(options || {}),
    },
  );
}

/** 创建学校系统配置数据 PUT /xxxtpz/create */
export async function createXXXTPZ(body: API.CreateXXXTPZ, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      KSSJ?: string;
      JSSJ?: string;
      KJS?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
      XXJBSJ?: {
        id?: string;
        XXDM?: string;
        XXMC?: string;
        XXYWMC?: string;
        XXDZ?: string;
        XXYZBM?: string;
        XZQHM?: string;
      };
    };
    message?: string;
  }>('/xxxtpz/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新学校系统配置数据 PUT /xxxtpz/update/${param0} */
export async function updateXXXTPZ(
  params: {
    // path
    /** 学校系统配置ID */
    id: string;
  },
  body: API.UpdateXXXTPZ,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xxxtpz/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

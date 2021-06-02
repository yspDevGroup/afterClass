// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取校内机构数据 GET /xnjgsj/${param0} */
export async function getXNJGSJ(
  params: {
    // path
    /** 校内机构ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      JGH?: string;
      LSJGH?: string;
      JGMC?: string;
      JGJC?: string;
      FZRGH?: string;
    };
    message?: string;
  }>(`/xnjgsj/${param0}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/** 删除校内机构数据 DELETE /xnjgsj/${param0} */
export async function deleteXNJGSJ(
  params: {
    // path
    /** 校内机构ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xnjgsj/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 查询所有校内机构数据 GET /xnjgsj/ */
export async function getAllXNJGSJ(options?: { [key: string]: any }) {
  return request<{ status?: 'ok' | 'error'; data?: API.XNJGSJ[]; message?: string }>('/xnjgsj/', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建校内机构数据 PUT /xnjgsj/create */
export async function createXNJGSJ(body: API.CreateXNJGSJ, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      JGH?: string;
      LSJGH?: string;
      JGMC?: string;
      JGJC?: string;
      FZRGH?: string;
    };
    message?: string;
  }>('/xnjgsj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新校内机构数据 PUT /xnjgsj/update/${param0} */
export async function updateXNJGSJ(
  params: {
    // path
    /** 校内机构ID */
    id: string;
  },
  body: API.UpdateXNJGSJ,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xnjgsj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

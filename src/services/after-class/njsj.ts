// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取年级数据 GET /njsj/${param0} */
export async function getNJSJ(
  params: {
    // path
    /** 年级ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: { id?: string; NJ?: number; NJMC?: string };
    message?: string;
  }>(`/njsj/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除年级数据 DELETE /njsj/${param0} */
export async function deleteNJSJ(
  params: {
    // path
    /** 年级ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/njsj/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有年级数据 GET /njsj/all/${param0} */
export async function getAllNJSJ(
  params: {
    // path
    xxid: string;
  },
  options?: { [key: string]: any },
) {
  const { xxid: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; data?: API.NJSJ[]; message?: string }>(
    `/njsj/all/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 创建年级数据 PUT /njsj/create */
export async function createNJSJ(
  params: {
    // path
  },
  body: API.CreateNJSJ,
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: { id?: string; NJ?: number; NJMC?: string };
    message?: string;
  }>('/njsj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 更新年级数据 PUT /njsj/update/${param0} */
export async function updateNJSJ(
  params: {
    // path
    /** 年级ID */
    id: string;
  },
  body: API.UpdateNJSJ,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/njsj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

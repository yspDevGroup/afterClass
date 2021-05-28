// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取校历数据 GET /xl/${param0} */
export async function getXL(
  params: {
    // path
    /** 校历ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: { id?: string; BT?: string; KSRQ?: string; JSRQ?: string };
    message?: string;
  }>(`/xl/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除校历数据 DELETE /xl/${param0} */
export async function deleteXL(
  params: {
    // path
    /** 校历ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xl/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有校历数据 GET /xl/ */
export async function getAllXL(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; data?: API.XL[]; message?: string }>('/xl/', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 创建校历数据 PUT /xl/create */
export async function createXL(
  params: {
    // path
  },
  body: API.CreateXL,
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: { id?: string; BT?: string; KSRQ?: string; JSRQ?: string };
    message?: string;
  }>('/xl/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 更新校历数据 PUT /xl/update/${param0} */
export async function updateXL(
  params: {
    // path
    /** 校历ID */
    id: string;
  },
  body: API.UpdateXL,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xl/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

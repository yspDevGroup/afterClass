// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取学年学期数据 GET /xnxq/${param0} */
export async function getXNXQ(
  params: {
    // path
    /** 学年学期ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      XN?: string;
      XQ?: string;
      KSRQ?: string;
      JSRQ?: string;
      XXJBSJId?: string;
    };
    message?: string;
  }>(`/xnxq/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除学年学期数据 DELETE /xnxq/${param0} */
export async function deleteXNXQ(
  params: {
    // path
    /** 学年学期ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xnxq/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有学年学期数据 GET /xnxq/all/${param0} */
export async function getAllXNXQ(
  params: {
    // path
    /** 学校ID */
    xxid: string;
  },
  options?: { [key: string]: any },
) {
  const { xxid: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; data?: API.XNXQ[]; message?: string }>(
    `/xnxq/all/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 创建学年学期数据 PUT /xnxq/create */
export async function createXNXQ(body: API.CreateXNXQ, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      XN?: string;
      XQ?: string;
      KSRQ?: string;
      JSRQ?: string;
      XXJBSJId?: string;
    };
    message?: string;
  }>('/xnxq/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新学年学期数据 PUT /xnxq/update/${param0} */
export async function updateXNXQ(
  params: {
    // path
    /** 学年学期ID */
    id: string;
  },
  body: API.UpdateXNXQ,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xnxq/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

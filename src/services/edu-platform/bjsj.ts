// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取班级数据 GET /bjsj/${param0} */
export async function getBJSJ(
  params: {
    // path
    /** 班级ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      BH?: string;
      BJ?: string;
      JBNY?: string;
      BZRGH?: string;
      BZXH?: string;
      BJRYCH?: string;
      XZ?: string;
      BJLXM?: string;
      WLLX?: string;
      BYRQ?: string;
      SFSSMZSYJXB?: string;
      SYJXMSM?: string;
      XXJBSJId?: string;
      NJSJId?: string;
    };
    message?: string;
  }>(`/bjsj/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除班级数据 DELETE /bjsj/${param0} */
export async function deleteBJSJ(
  params: {
    // path
    /** 班级ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/bjsj/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有班级数据 GET /bjsj/ */
export async function getAllBJSJ(options?: { [key: string]: any }) {
  return request<{ status?: 'ok' | 'error'; data?: API.BJSJ[]; message?: string }>('/bjsj/', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建班级数据 PUT /bjsj/create */
export async function createBJSJ(body: API.CreateBJSJ, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      BH?: string;
      BJ?: string;
      JBNY?: string;
      BZRGH?: string;
      BZXH?: string;
      BJRYCH?: string;
      XZ?: string;
      BJLXM?: string;
      WLLX?: string;
      BYRQ?: string;
      SFSSMZSYJXB?: string;
      SYJXMSM?: string;
      XXJBSJId?: string;
      NJSJId?: string;
    };
    message?: string;
  }>('/bjsj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新班级数据 PUT /bjsj/update/${param0} */
export async function updateBJSJ(
  params: {
    // path
    /** 班级ID */
    id: string;
  },
  body: API.UpdateBJSJ,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/bjsj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取课程数据 GET /kcsj/${param0} */
export async function getKCSJ(
  params: {
    // path
    /** 课程ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      KCMC?: string;
      KCM?: string;
      KCDJM?: string;
      KCBM?: string;
      KCJJ?: string;
      KCYQ?: string;
      ZXS?: number;
      ZHXS?: number;
      ZXXS?: number;
      SKFSM?: string;
      JCBM?: string;
      CKSM?: string;
    };
    message?: string;
  }>(`/kcsj/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除课程数据 DELETE /kcsj/${param0} */
export async function deleteKCSJ(
  params: {
    // path
    /** 课程ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/kcsj/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取学校全部课程数据 GET /kcsj/xxdm/${param0} */
export async function getKCSJByXX(
  params: {
    // path
    /** 学校代码 */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; data?: API.KCSJ[]; message?: string }>(
    `/kcsj/xxdm/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 创建课程数据 PUT /kcsj/create */
export async function createKCSJ(
  params: {
    // path
  },
  body: API.CreateKCSJ,
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      KCMC?: string;
      KCM?: string;
      KCDJM?: string;
      KCBM?: string;
      KCJJ?: string;
      KCYQ?: string;
      ZXS?: number;
      ZHXS?: number;
      ZXXS?: number;
      SKFSM?: string;
      JCBM?: string;
      CKSM?: string;
    };
    message?: string;
  }>('/kcsj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 更新课程数据 PUT /kcsj/update/${param0} */
export async function updateKCSJ(
  params: {
    // path
    /** 课程ID */
    id: string;
  },
  body: API.UpdateKCSJ,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/kcsj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

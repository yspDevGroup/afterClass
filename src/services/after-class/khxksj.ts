// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 创建巡课安排 PUT /khxksj/create */
export async function createKHXKSJ(body: API.CreateKHXKSJ[], options?: { [key: string]: any }) {
  return request<{ status?: 'ok' | 'error'; data?: string; message?: string }>('/khxksj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取巡课安排 POST /khxksj/getAll */
export async function getKHXKSJ(
  body: {
    /** 学校ID */
    XXJBSJId?: string;
    /** 日期 */
    RQ?: string;
    /** 教师ID */
    KHJSSJId?: string;
    /** 页数 */
    page?: number;
    /** 每页记录数 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    status?: 'ok' | 'error';
    data?: { count?: number; rows?: API.KHXKSJ[] };
    message?: string;
  }>('/khxksj/getAll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除巡课安排 DELETE /khxksj/${param0} */
export async function deleteKHXKSJ(
  params: {
    // path
    /** 巡课安排ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khxksj/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 更新巡课安排 PUT /khxksj/update/${param0} */
export async function updateKHXKSJ(
  params: {
    // path
    /** 巡课安排数据ID */
    id: string;
  },
  body: API.UpdateKHXKSJ,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khxksj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

/** 根据日期查询当天的排课数据 POST /khxksj/getScheduleByDate */
export async function getScheduleByDate(
  body: {
    /** 日期 */
    RQ?: string;
    /** 周几 */
    WEEKDAY?: string;
    /** 学校ID */
    XXJBSJId?: string;
  },
  options?: { [key: string]: any },
) {
  return request<any>('/khxksj/getScheduleByDate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

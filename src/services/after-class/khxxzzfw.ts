// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 创建学校课后增值服务 PUT /khxxzzfw/create */
export async function createKHXXZZFW(body: API.CreateKHXXZZFW, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      FWMC?: string;
      FWNR?: string;
      FWZT?: number;
      FY?: number;
      KSRQ?: string | any;
      JSRQ?: string | any;
      BMKSSJ?: string;
      BMJSSJ?: string;
    };
    message?: string;
  }>('/khxxzzfw/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取学校课后增值服务 POST /khxxzzfw/getAll */
export async function getKHXXZZFW(
  body: {
    /** 学生ID */
    XSJBSJId?: string;
    /** 页数 */
    page?: number;
    /** 每页记录数 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    status?: 'ok' | 'error';
    data?: { count?: number; rows?: API.KHXXZZFW[] };
    message?: string;
  }>('/khxxzzfw/getAll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除学校课后增值服务 DELETE /khxxzzfw/${param0} */
export async function deleteKHXXZZFW(
  params: {
    // path
    /** 学校课后增值服务ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khxxzzfw/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 更新学校课后增值服务 PUT /khxxzzfw/update/${param0} */
export async function updateKHXXZZFW(
  params: {
    // path
    /** 学校课后增值服务数据ID */
    id: string;
  },
  body: API.UpdateKHXXZZFW,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khxxzzfw/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

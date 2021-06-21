// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取学校基本数据 GET /xxjbsj/${param0} */
export async function getXXJBSJ(
  params: {
    // path
    /** 学校代码 */
    XXDM: string;
  },
  options?: { [key: string]: any },
) {
  const { XXDM: param0, ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      XXDM?: string;
      XXMC?: string;
      XXYWMC?: string;
      XXDZ?: string;
      XXYZBM?: string;
      XZQHM?: string;
      JXNY?: string;
      XQR?: string;
      XXBXLXM?: string;
      XXZGBMM?: string;
      FDDBRH?: string;
      FRZSH?: string;
      XZGH?: string;
      XZXM?: string;
      DWFZRH?: string;
      ZZJGM?: string;
      LXDH?: string;
      CZDH?: string;
      DZXX?: string;
      ZYDZ?: string;
      LSYG?: string;
      XXBBM?: string;
      SSZGDWM?: string;
      SZDCXLXM?: string;
      SZDJJSXM?: string;
      SZDMZSX?: string;
      XXXZ?: number;
      XXRXNL?: number;
      CZXZ?: number;
      CZRXNL?: number;
      GZXZ?: number;
      ZJXYYM?: string;
      FJXYYM?: string;
      ZSBJ?: string;
    };
    message?: string;
  }>(`/xxjbsj/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有学校基本数据 GET /xxjbsj/ */
export async function getAllXXJBSJ(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; data?: API.XXJBSJ[]; message?: string }>('/xxjbsj/', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 创建学校基本数据 PUT /xxjbsj/create */
export async function createXXJBSJ(
  params: {
    // path
  },
  body: API.CreateXXJBSJ,
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      XXDM?: string;
      XXMC?: string;
      XXYWMC?: string;
      XXDZ?: string;
      XXYZBM?: string;
      XZQHM?: string;
      JXNY?: string;
      XQR?: string;
      XXBXLXM?: string;
      XXZGBMM?: string;
      FDDBRH?: string;
      FRZSH?: string;
      XZGH?: string;
      XZXM?: string;
      DWFZRH?: string;
      ZZJGM?: string;
      LXDH?: string;
      CZDH?: string;
      DZXX?: string;
      ZYDZ?: string;
      LSYG?: string;
      XXBBM?: string;
      SSZGDWM?: string;
      SZDCXLXM?: string;
      SZDJJSXM?: string;
      SZDMZSX?: string;
      XXXZ?: number;
      XXRXNL?: number;
      CZXZ?: number;
      CZRXNL?: number;
      GZXZ?: number;
      ZJXYYM?: string;
      FJXYYM?: string;
      ZSBJ?: string;
    };
    message?: string;
  }>('/xxjbsj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除学校基本数据 DELETE /xxjbsj/${param0} */
export async function deleteXXJBSJ(
  params: {
    // path
    /** 学校ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xxjbsj/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新学校基本数据 PUT /xxjbsj/update/${param0} */
export async function updateXXJBSJ(
  params: {
    // path
    /** 学校ID */
    id: string;
  },
  body: API.UpdateXXJBSJ,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xxjbsj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

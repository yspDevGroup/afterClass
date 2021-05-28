// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取学生数据 GET /xsjbsj/${param0} */
export async function getXSJBSJ(
  params: {
    // path
    /** 学生ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      XH?: string;
      XM?: string;
      YWXM?: string;
      XMPY?: string;
      CYM?: string;
      XBM?: string;
      CSRQ?: string;
      CSDM?: string;
      JG?: string;
      MZM?: string;
      GJDQM?: string;
      SFZJLXM?: string;
      SFZJH?: string;
      HYZKM?: string;
      GATQWM?: string;
      ZZMMM?: string;
      JKZKM?: string;
      XYZJM?: string;
      XXM?: string;
      SFZJYXQ?: string;
      DSZYBZ?: string;
      RXNY?: string;
      NJ?: number;
      BH?: string;
      XSLBM?: string;
      XZZ?: string;
      HKSZD?: string;
      HKXZM?: string;
      SFLDRK?: string;
      TC?: string;
      LXDH?: string;
      TXDZ?: string;
      YZBM?: string;
      DZXX?: string;
      ZYDZ?: string;
      XJH?: string;
    };
    message?: string;
  }>(`/xsjbsj/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除学生数据 DELETE /xsjbsj/${param0} */
export async function deleteXSJBSJ(
  params: {
    // path
    /** 学生ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xsjbsj/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有学生数据 GET /xsjbsj/ */
export async function getAllXSJBSJ(options?: { [key: string]: any }) {
  return request<{ status?: 'ok' | 'error'; data?: API.XSJBSJ[]; message?: string }>('/xsjbsj/', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建学生数据 PUT /xsjbsj/create */
export async function createXSJBSJ(body: API.CreateXSJBSJ, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      XH?: string;
      XM?: string;
      YWXM?: string;
      XMPY?: string;
      CYM?: string;
      XBM?: string;
      CSRQ?: string;
      CSDM?: string;
      JG?: string;
      MZM?: string;
      GJDQM?: string;
      SFZJLXM?: string;
      SFZJH?: string;
      HYZKM?: string;
      GATQWM?: string;
      ZZMMM?: string;
      JKZKM?: string;
      XYZJM?: string;
      XXM?: string;
      SFZJYXQ?: string;
      DSZYBZ?: string;
      RXNY?: string;
      NJ?: number;
      BH?: string;
      XSLBM?: string;
      XZZ?: string;
      HKSZD?: string;
      HKXZM?: string;
      SFLDRK?: string;
      TC?: string;
      LXDH?: string;
      TXDZ?: string;
      YZBM?: string;
      DZXX?: string;
      ZYDZ?: string;
      XJH?: string;
    };
    message?: string;
  }>('/xsjbsj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新学生数据 PUT /xsjbsj/update/${param0} */
export async function updateXSJBSJ(
  params: {
    // path
    /** 学生ID */
    id: string;
  },
  body: API.UpdateXSJBSJ,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/xsjbsj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取教职工基本数据 GET /jzgjbsj/${param0} */
export async function getJZGJBSJ(
  params: {
    // path
    /** 教职工ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      GH?: string;
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
      JGH?: string;
      JTZZ?: string;
      XZZ?: string;
      HKSZD?: string;
      HKXZM?: string;
      XLM?: string;
      GZNY?: string;
      LXNY?: string;
      CJNY?: string;
      BZLBM?: string;
      DABH?: string;
      DAWB?: string;
      TXDZ?: string;
      LXDH?: string;
      YZBM?: string;
      DZXX?: string;
      ZYDZ?: string;
      TC?: string;
      GWZYM?: string;
      ZYRKXD?: string;
      XXJBSJId?: string;
    };
    message?: string;
  }>(`/jzgjbsj/${param0}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/** 删除教职工基本数据 DELETE /jzgjbsj/${param0} */
export async function deleteJZGJBSJ(
  params: {
    // path
    /** 教职工ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/jzgjbsj/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 查询所有教职工基本数据 GET /jzgjbsj/ */
export async function getAllJZGJBSJ(options?: { [key: string]: any }) {
  return request<{ status?: 'ok' | 'error'; data?: API.JZGJBSJ[]; message?: string }>('/jzgjbsj/', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建教职工基本数据 PUT /jzgjbsj/create */
export async function createJZG(body: API.CreateJZGJBSJ, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      GH?: string;
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
      JGH?: string;
      JTZZ?: string;
      XZZ?: string;
      HKSZD?: string;
      HKXZM?: string;
      XLM?: string;
      GZNY?: string;
      LXNY?: string;
      CJNY?: string;
      BZLBM?: string;
      DABH?: string;
      DAWB?: string;
      TXDZ?: string;
      LXDH?: string;
      YZBM?: string;
      DZXX?: string;
      ZYDZ?: string;
      TC?: string;
      GWZYM?: string;
      ZYRKXD?: string;
      XXJBSJId?: string;
    };
    message?: string;
  }>('/jzgjbsj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新教职工基本数据 PUT /jzgjbsj/update/${param0} */
export async function updateJZGJBSJ(
  params: {
    // path
    /** 教职工ID */
    id: string;
  },
  body: API.UpdateJZGJBSJ,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/jzgjbsj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

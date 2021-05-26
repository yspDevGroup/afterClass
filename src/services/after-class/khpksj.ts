// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取课后排课数据 GET /khpksj/${param0} */
export async function getKHPKSJ(
  params: {
    // path
    /** 课后排课ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      WEEKDAY?: '0' | '1' | '2' | '3' | '4' | '5' | '6';
      KHBJSJ?: {
        id?: string;
        BJMC?: string;
        BJMS?: string;
        BJZT?: string;
        ZJS?: string;
        FJS?: string;
        BJRS?: number;
        KSS?: number;
        KKRQ?: string;
        JKRQ?: string;
      };
      XXXTPZ?: {
        id?: string;
        KSSJ?: string;
        JSSJ?: string;
        KJS?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
      };
      FJSJ?: {
        id?: string;
        FJBH?: string;
        FJMC?: string;
        FJLC?: string;
        FJJZMJ?: number;
        FJSYMJ?: number;
        FJRS?: number;
        FJLX?: string;
      };
      XXJBSJ?: {
        id?: string;
        XXDM?: string;
        XXMC?: string;
        XXYWMC?: string;
        XXDZ?: string;
        XXYZBM?: string;
        XZQHM?: string;
      };
    };
    message?: string;
  }>(`/khpksj/${param0}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/** 删除课后排课数据 DELETE /khpksj/${param0} */
export async function deleteKHPKSJ(
  params: {
    // path
    /** 课后排课ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khpksj/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 查询所有课后排课数据 POST /khpksj/ */
export async function getAllKHPKSJ(
  body: {
    /** 学校ID */
    xxId?: string;
    /** 年级ID */
    njId?: string;
    /** 学年 */
    xn?: string;
    /** 学期 */
    xq?: string;
    /** 课程名称 */
    name?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ status?: 'ok' | 'error'; data?: API.KHPKSJ[]; message?: string }>('/khpksj/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建课后排课数据 PUT /khpksj/create */
export async function createKHPKSJ(body: API.CreateKHPKSJ, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      WEEKDAY?: '0' | '1' | '2' | '3' | '4' | '5' | '6';
      KHBJSJ?: {
        id?: string;
        BJMC?: string;
        BJMS?: string;
        BJZT?: string;
        ZJS?: string;
        FJS?: string;
        BJRS?: number;
        KSS?: number;
        KKRQ?: string;
        JKRQ?: string;
      };
      XXXTPZ?: {
        id?: string;
        KSSJ?: string;
        JSSJ?: string;
        KJS?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
      };
      FJSJ?: {
        id?: string;
        FJBH?: string;
        FJMC?: string;
        FJLC?: string;
        FJJZMJ?: number;
        FJSYMJ?: number;
        FJRS?: number;
        FJLX?: string;
      };
      XXJBSJ?: {
        id?: string;
        XXDM?: string;
        XXMC?: string;
        XXYWMC?: string;
        XXDZ?: string;
        XXYZBM?: string;
        XZQHM?: string;
      };
    };
    message?: string;
  }>('/khpksj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新课后排课数据 PUT /khpksj/update/${param0} */
export async function updateKHPKSJ(
  params: {
    // path
    /** 课后排课ID */
    id: string;
  },
  body: API.UpdateKHPKSJ,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khpksj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

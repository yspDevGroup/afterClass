// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取房间数据 GET /fjsj/${param0} */
export async function getFJSJ(
  params: {
    // path
    /** 房间ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      FJBH?: string;
      FJMC?: string;
      FJLC?: string;
      FJJZMJ?: number;
      FJSYMJ?: number;
      FJRS?: number;
      JXL?: string;
      BZXX?: string;
      XXJBSJ?: {
        id?: string;
        XXDM?: string;
        XXMC?: string;
        XXYWMC?: string;
        XXDZ?: string;
        XXYZBM?: string;
        XZQHM?: string;
      };
      XQSJ?: {
        id?: string;
        XQH?: string;
        XQMC?: string;
        XQDZ?: string;
        XQYZBM?: string;
        XQLXDH?: string;
        XQCZDH?: string;
      };
      FJLX?: { id?: string; FJLX?: string };
    };
    message?: string;
  }>(`/fjsj/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除房间数据 DELETE /fjsj/${param0} */
export async function deleteFJSJ(
  params: {
    // path
    /** 房间ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/fjsj/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有房间数据 POST /fjsj/ */
export async function getAllFJSJ(
  body: {
    /** 场地类型ID */
    lxId?: string;
    /** 页数 */
    page?: number;
    /** 每页记录数 */
    pageCount?: number;
    /** 场地名称 */
    name?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ status?: 'ok' | 'error'; data?: API.FJSJ[]; message?: string }>('/fjsj/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建房间数据 PUT /fjsj/create */
export async function createFJSJ(body: API.CreateFJSJ, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: {
      id?: string;
      FJBH?: string;
      FJMC?: string;
      FJLC?: string;
      FJJZMJ?: number;
      FJSYMJ?: number;
      FJRS?: number;
      JXL?: string;
      BZXX?: string;
      XXJBSJ?: {
        id?: string;
        XXDM?: string;
        XXMC?: string;
        XXYWMC?: string;
        XXDZ?: string;
        XXYZBM?: string;
        XZQHM?: string;
      };
      XQSJ?: {
        id?: string;
        XQH?: string;
        XQMC?: string;
        XQDZ?: string;
        XQYZBM?: string;
        XQLXDH?: string;
        XQCZDH?: string;
      };
      FJLX?: { id?: string; FJLX?: string };
    };
    message?: string;
  }>('/fjsj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新房间数据 PUT /fjsj/update/${param0} */
export async function updateFJSJ(
  params: {
    // path
    /** 房间ID */
    id: string;
  },
  body: API.UpdateFJSJ,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/fjsj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 查询房间占用情况 POST /fjsj/plan */
export async function getFJPlan(
  body: {
    /** 场地类型ID */
    lxId?: string;
    /** 场地ID */
    fjId?: string;
    /** 学年学期ID */
    xnxqId?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    status?: 'ok' | 'error';
    data?: {
      id?: string;
      FJBH?: string;
      FJMC?: string;
      FJLC?: string;
      JXL?: string;
      BZXX?: string;
      KHPKSJs?: {
        id?: string;
        WEEKDAY?: '0' | '1' | '2' | '3' | '4' | '5' | '6';
        XXSJPZ?: {
          id?: string;
          KJS?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
          KSSJ?: string;
          JSSJ?: string;
          SDMC?: string;
          BZXX?: string;
        };
        KHBJSJ?: {
          id?: string;
          BJMC?: string;
          BJMS?: string;
          BJZT?: string;
          ZJS?: string;
          FJS?: string;
          BJRS?: number;
          KSS?: number;
          FY?: number;
          KKRQ?: string;
          JKRQ?: string;
        };
      }[];
    }[];
    message?: string;
  }>('/fjsj/plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

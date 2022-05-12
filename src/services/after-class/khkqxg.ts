// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取考勤修改申请记录 GET /khkqxg/${param0} */
export async function getKHKQXG(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getKHKQXGParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    status: 'ok' | 'error';
    data?: {
      id?: string;
      ZT?: number;
      CQRQ?: string;
      SQRId?: string;
      SQR?: { id?: string; GH?: string; XM?: string; WechatUserId?: string } | any;
      SQBZXX?: string;
      SPRId?: string;
      SPR?: { id?: string; GH?: string; XM?: string; WechatUserId?: string } | any;
      SPBZXX?: string;
      XXSJPZId?: string;
      XXSJPZ?: {
        id?: string;
        KSSJ?: string;
        JSSJ?: string;
        KJS?: string;
        TITLE?: string;
        BZXX?: string;
      };
      KHBJSJId?: string;
      KHBJSJ?: {
        id?: string;
        BJMC?: string;
        KCTP?: string;
        ISFW?: number;
        ISZB?: number;
        KHKCSJ?: { id?: string; KCMC?: string; KCTP?: string };
      };
      KHXSKQXGs?: {
        id?: string;
        SRCCQZT?: string;
        NOWCQZT?: string;
        XSJBSJ?: { id?: string; XH?: string; XM?: string; WechatUserId?: string };
      }[];
    };
    message?: string;
  }>(`/khkqxg/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除考勤修改申请记录 DELETE /khkqxg/${param0} */
export async function deleteKHKQXG(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteKHKQXGParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status: 'ok' | 'error'; message?: string }>(`/khkqxg/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有考勤修改申请记录 POST /khkqxg/all */
export async function getAllKHKQXG(
  body: {
    /** 申请状态 */
    ZT?: number[];
    startDate?: string;
    endDate?: string;
    /** 申请教师ID */
    SQRId?: string;
    /** 班级ID */
    KHBJSJId?: string;
    /** 学校ID */
    XXJBSJId: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ status: 'ok' | 'error'; data?: API.KHKQXG[]; message?: string }>('/khkqxg/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建考勤修改申请 PUT /khkqxg/create */
export async function createKHKQXG(body: API.CreateKHKQXG, options?: { [key: string]: any }) {
  return request<{
    status: 'ok' | 'error';
    data?: {
      id?: string;
      ZT?: number;
      CQRQ?: string;
      SQRId?: string;
      SQR?: { id?: string; GH?: string; XM?: string; WechatUserId?: string } | any;
      SQBZXX?: string;
      SPRId?: string;
      SPR?: { id?: string; GH?: string; XM?: string; WechatUserId?: string } | any;
      SPBZXX?: string;
      XXSJPZId?: string;
      XXSJPZ?: {
        id?: string;
        KSSJ?: string;
        JSSJ?: string;
        KJS?: string;
        TITLE?: string;
        BZXX?: string;
      };
      KHBJSJId?: string;
      KHBJSJ?: {
        id?: string;
        BJMC?: string;
        KCTP?: string;
        ISFW?: number;
        ISZB?: number;
        KHKCSJ?: { id?: string; KCMC?: string; KCTP?: string };
      };
      KHXSKQXGs?: {
        id?: string;
        SRCCQZT?: string;
        NOWCQZT?: string;
        XSJBSJ?: { id?: string; XH?: string; XM?: string; WechatUserId?: string };
      }[];
    };
    message?: string;
  }>('/khkqxg/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新考勤修改申请 PUT /khkqxg/update/${param0} */
export async function updateKHKQXG(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateKHKQXGParams,
  body: API.UpdateKHKQXG,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status: 'ok' | 'error'; message?: string }>(`/khkqxg/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

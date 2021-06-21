// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取课后服务订单记录 GET /khxsdd/${param0} */
export async function getKHXSDD(
  params: {
    // path
    /** 类型ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data?: {
      DDBH?: string;
      XDSJ?: string;
      ZFFS?: '线上支付' | '线下支付';
      ZFSJ?: string;
      DZFP?: string;
      DDZT?: '待付款' | '已付款' | '已取消' | '待退款' | '已退款';
      DDFY?: number;
      XSId?: string;
      KHBJSJ?: {
        id?: string;
        BJMC?: string;
        BJMS?: string;
        BJZT?: '待发布' | '已发布' | '已下架' | '已结课';
        ZJS?: string;
        FJS?: string;
        BJRS?: number;
        KSS?: number;
        FY?: number;
        KKRQ?: string;
        JKRQ?: string;
        BMKSSJ?: string;
        BMJSSJ?: string;
        KCTP?: string;
      };
      NJS?: string;
      XQ?: string;
      NJSName?: string;
      XQName?: string;
      ZJSName?: string;
      FJSName?: string;
    };
    message?: string;
  }>(`/khxsdd/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除课后服务订单记录 DELETE /khxsdd/${param0} */
export async function deleteKHXSDD(
  params: {
    // path
    /** 类型ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khxsdd/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有课后服务订单记录 POST /khxsdd/ */
export async function getAllKHXSDD(
  params: {
    // path
  },
  body: {
    /** 学生ID */
    XSId?: string;
    /** 课后服务订单状态 */
    DDZT?: string;
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; data?: API.KHXSDD[]; message?: string }>('/khxsdd/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 创建课后服务订单记录 PUT /khxsdd/create */
export async function createKHXSDD(
  params: {
    // path
  },
  body: API.CreateKHXSDD,
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data?: {
      DDBH?: string;
      XDSJ?: string;
      ZFFS?: '线上支付' | '线下支付';
      ZFSJ?: string;
      DZFP?: string;
      DDZT?: '待付款' | '已付款' | '已取消' | '待退款' | '已退款';
      DDFY?: number;
      XSId?: string;
      KHBJSJ?: {
        id?: string;
        BJMC?: string;
        BJMS?: string;
        BJZT?: '待发布' | '已发布' | '已下架' | '已结课';
        ZJS?: string;
        FJS?: string;
        BJRS?: number;
        KSS?: number;
        FY?: number;
        KKRQ?: string;
        JKRQ?: string;
        BMKSSJ?: string;
        BMJSSJ?: string;
        KCTP?: string;
      };
      NJS?: string;
      XQ?: string;
      NJSName?: string;
      XQName?: string;
      ZJSName?: string;
      FJSName?: string;
    };
    message?: string;
  }>('/khxsdd/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 更新课后服务订单记录 PUT /khxsdd/update/${param0} */
export async function updateKHXSDD(
  params: {
    // path
    /** 类型ID */
    id: string;
  },
  body: API.UpdateKHXSDD,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khxsdd/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

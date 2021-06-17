// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取课后服务请假记录 GET /khxsqj/${param0} */
export async function getKHXSQJ(
  params: {
    // path
    /** 类型ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{
    status?: 'ok' | 'error';
    data?: {
      KSSJ?: string;
      JSSJ?: string;
      QJSC?: number;
      QJYY?: string;
      QJZT?: '已确认' | '待确认' | '已取消';
      QJLX?: '按课时请假' | '按时间请假';
      XSId?: string;
      KHBJSJs?: {
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
        NJS?: string;
        XQ?: string;
        NJSName?: string;
        XQName?: string;
        ZJSName?: string;
        FJSName?: string;
      }[];
    };
    message?: string;
  }>(`/khxsqj/${param0}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/** 删除课后服务请假记录 DELETE /khxsqj/${param0} */
export async function deleteKHXSQJ(
  params: {
    // path
    /** 类型ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khxsqj/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 查询所有课后服务请假记录 POST /khxsqj/ */
export async function getAllKHXSQJ(
  body: {
    /** 学生ID */
    XSId?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ status?: 'ok' | 'error'; data?: API.KHXSQJ[]; message?: string }>('/khxsqj/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建课后服务请假记录 PUT /khxsqj/create */
export async function createKHXSQJ(body: API.CreateKHXSQJ, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data?: {
      KSSJ?: string;
      JSSJ?: string;
      QJSC?: number;
      QJYY?: string;
      QJZT?: '已确认' | '待确认' | '已取消';
      QJLX?: '按课时请假' | '按时间请假';
      XSId?: string;
      KHBJSJs?: {
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
        NJS?: string;
        XQ?: string;
        NJSName?: string;
        XQName?: string;
        ZJSName?: string;
        FJSName?: string;
      }[];
    };
    message?: string;
  }>('/khxsqj/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新课后服务请假记录 PUT /khxsqj/update/${param0} */
export async function updateKHXSQJ(
  params: {
    // path
    /** 类型ID */
    id: string;
  },
  body: API.UpdateKHXSQJ,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khxsqj/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

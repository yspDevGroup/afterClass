// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取课后服务出勤记录 GET /khxscq/${param0} */
export async function getKHXSCQ(
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
      CQZT?: '出勤' | '请假' | '缺勤';
      CQRQ?: string;
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
    };
    message?: string;
  }>(`/khxscq/${param0}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/** 删除课后服务出勤记录 DELETE /khxscq/${param0} */
export async function deleteKHXSCQ(
  params: {
    // path
    /** 类型ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khxscq/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 查询所有课后服务出勤记录 POST /khxscq/ */
export async function getAllKHXSCQ(
  body: {
    /** 学生ID */
    xsId?: string;
    /** 班级ID */
    bjId?: string;
    /** 出勤状态 */
    CQZT?: string;
    /** 出勤日期 */
    CQRQ?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ status?: 'ok' | 'error'; data?: API.KHXSCQ[]; message?: string }>('/khxscq/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建课后服务出勤记录 PUT /khxscq/create */
export async function createKHXSCQ(body: API.CreateKHXSCQ, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data?: {
      CQZT?: '出勤' | '请假' | '缺勤';
      CQRQ?: string;
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
    };
    message?: string;
  }>('/khxscq/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新课后服务出勤记录 PUT /khxscq/update/${param0} */
export async function updateKHXSCQ(
  params: {
    // path
    /** 类型ID */
    id: string;
  },
  body: API.UpdateKHXSCQ,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/khxscq/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}
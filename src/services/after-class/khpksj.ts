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
        BJZT?: '待开班' | '已开班' | '已结课';
        ZJS?: string;
        FJS?: string;
        BJRS?: number;
        KSS?: number;
        KKRQ?: string | any;
        JKRQ?: string | any;
        BMKSSJ?: string;
        BMJSSJ?: string;
        KCTP?: string;
        NJS?: string;
        XQ?: string;
        NJSName?: string;
        XQName?: string;
        ZJSName?: string;
        FJSName?: string;
        KHKCSJ?: {
          id?: string;
          KCMC?: string;
          KCTP?: string;
          KCZT?: number;
          KCMS?: string;
          KKRQ?: string | any;
          JKRQ?: string | any;
          BMKSSJ?: string;
          BMJSSJ?: string;
        };
      };
      XXSJPZ?: {
        id?: string;
        KSSJ?: string;
        JSSJ?: string;
        KJS?: string;
        TITLE?: string;
        BZXX?: string;
        TYPE?: 0 | 1 | 2;
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
        XQ?: string;
        XQName?: string;
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

/** 获取课后排课数据 GET /khpksj/weekSchedule/${param0} */
export async function getKHPKSJByBJID(
  params: {
    // path
    /** 班级ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<{ status?: 'ok' | 'error'; data?: API.KHPKSJ[]; message?: string }>(
    `/khpksj/weekSchedule/${param0}`,
    {
      method: 'GET',
      params: { ...params },
      ...(options || {}),
    },
  );
}

/** 查询所有课后排课数据 POST /khpksj/ */
export async function getAllKHPKSJ(
  body: {
    /** 年级ID */
    njId?: string;
    /** 学年学期ID */
    XNXQId?: string;
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
export async function createKHPKSJ(
  body: {
    bjIds?: string[];
    data?: API.CreateKHPKSJ[];
  },
  options?: { [key: string]: any },
) {
  return request<{
    status?: 'ok' | 'error';
    data?: {
      id?: string;
      WEEKDAY?: string;
      XXSJPZId?: string;
      KHBJSJId?: string;
      FJSJId?: string;
      XNXQId?: string;
    }[];
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

/** 查看机构课表 POST /khpksj/getAgencySchedule */
export async function getAgencySchedule(
  body: {
    /** 教师ID */
    JSId?: string;
    /** 学校ID */
    XXJBSJId?: string;
    /** 课程名称 */
    KCMC?: string;
  },
  options?: { [key: string]: any },
) {
  return request<any>('/khpksj/getAgencySchedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

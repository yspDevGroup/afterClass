// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 根据ID获取机构教师信息 GET /khjstdk/test */
export async function KHJSSJ(options?: { [key: string]: any }) {
  return request<any>('/khjstdk/test', {
    method: 'GET',
    ...(options || {}),
  });
}

// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 验证认证链接 POST /xaedu/validateUrl */
export async function validateUrl(
  body: {
    /** 认证票据 */
    ticket: string;
    /** 认证对应的服务地址 */
    service: string;
  },
  options?: { [key: string]: any },
) {
  return request<any>('/xaedu/validateUrl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

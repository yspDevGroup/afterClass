// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 上传图片 POST /upload/images */
export async function uploadPic(options?: { [key: string]: any }) {
  return request<{ status?: 'ok' | 'error'; data?: string; message?: string }>('/upload/images', {
    method: 'POST',
    ...(options || {}),
  });
}

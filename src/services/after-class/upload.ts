// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 上传文件 POST /upload/uploadFile */
export async function uploadFile(options?: { [key: string]: any }) {
  return request<{ status?: 'ok' | 'error'; data?: string; message?: string }>(
    '/upload/uploadFile',
    {
      method: 'POST',
      ...(options || {}),
    },
  );
}

// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** Returns status and version of the application GET /_app/status */
export async function getStatus(
  params: {
    // path
  },
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<{ status?: string; version?: string }>('/_app/status', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

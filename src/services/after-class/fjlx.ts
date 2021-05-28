// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取房间类型 GET /fjlx/${param0} */
export async function getFJLX(
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
<<<<<<< HEAD
    data: { id?: string; FJLX?: string; XXJBSJId?: string };
=======
    data: { id?: string; FJLX?: string };
>>>>>>> 8eb5765991756acc9b1e24725c77a6400120aecb
    message?: string;
  }>(`/fjlx/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除房间类型 DELETE /fjlx/${param0} */
export async function deleteFJLX(
  params: {
    // path
    /** 类型ID */
    id: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/fjlx/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有房间类型 POST /fjlx/ */
export async function getAllFJLX(
<<<<<<< HEAD
  body: {
    /** 学校ID */
    xxId?: string;
=======
  params: {
    // path
  },
  body: {
>>>>>>> 8eb5765991756acc9b1e24725c77a6400120aecb
    /** 房间类型 */
    name?: string;
  },
  options?: { [key: string]: any },
) {
<<<<<<< HEAD
=======
  const { ...queryParams } = params;
>>>>>>> 8eb5765991756acc9b1e24725c77a6400120aecb
  return request<{ status?: 'ok' | 'error'; data?: API.FJLX[]; message?: string }>('/fjlx/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
<<<<<<< HEAD
=======
    params: { ...queryParams },
>>>>>>> 8eb5765991756acc9b1e24725c77a6400120aecb
    data: body,
    ...(options || {}),
  });
}

/** 创建房间类型 PUT /fjlx/create */
<<<<<<< HEAD
export async function createFJLX(body: API.CreateFJLX, options?: { [key: string]: any }) {
  return request<{
    status?: 'ok' | 'error';
    data: { id?: string; FJLX?: string; XXJBSJId?: string };
=======
export async function createFJLX(
  params: {
    // path
  },
  body: API.CreateFJLX,
  options?: { [key: string]: any },
) {
  const { ...queryParams } = params;
  return request<{
    status?: 'ok' | 'error';
    data: { id?: string; FJLX?: string };
>>>>>>> 8eb5765991756acc9b1e24725c77a6400120aecb
    message?: string;
  }>('/fjlx/create', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
<<<<<<< HEAD
=======
    params: { ...queryParams },
>>>>>>> 8eb5765991756acc9b1e24725c77a6400120aecb
    data: body,
    ...(options || {}),
  });
}

/** 更新房间类型 PUT /fjlx/update/${param0} */
export async function updateFJLX(
  params: {
    // path
    /** 类型ID */
    id: string;
  },
  body: API.UpdateFJLX,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ status?: 'ok' | 'error'; message?: string }>(`/fjlx/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

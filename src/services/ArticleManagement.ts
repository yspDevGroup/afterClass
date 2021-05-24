/* eslint-disable no-console */
import request from 'umi-request';
import type {
  BraftUploadFile,
  TableListParams,
  UpsertParams,
} from '../pages/ArticleManagement/data';

/**
 * 按条件查询文章列表
 *
 * @export
 * @param {TableListParams} [params]
 * @return {*}
 */
export async function queryList(params?: TableListParams) {
  const result = await request('/api/getArticleList', {
    method: 'POST',
    data: { ...params },
  });

  if (result.status === 'ok') {
    const isRecycleBin = window.location.pathname.includes('recycleBin'); // 回收站
    let data = [];
    if (!isRecycleBin) {
      data = result.data.list.filter((item: { pubStatus: string }) => item.pubStatus !== '已删除');
    }
    return {
      data: isRecycleBin ? result.data.list : data,
      total: result.data.total,
      success: true,
      pageSize: params?.pageSize,
      current: params?.current,
    };
  }
  return {
    data: [],
    total: 0,
    success: false,
    pageSize: 0,
    current: 1,
  };
}

/**
 * 查询所有栏目
 *
 * @export
 * @returns
 */
export async function queryChannels() {
  const result = await request('/api/channels');

  if (result.status === 'ok') {
    return result.data;
  }
  return [];
}

export async function getById(id: string) {
  const result = await request(`/api/article/${id}`);
  return result;
}

/**
 * 新增或修改文章
 *
 * @export
 * @param {UpsertParams} params
 * @returns
 */
export async function upsert(params: UpsertParams) {
  return request('/api/article', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 删除文章
 *
 * @export
 * @param {string[]} ids
 * @returns
 */
export async function remove(ids: string[]) {
  return request('/api/articles', {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}

/**
 * 批量移动文章
 *
 * @export
 * @param {string[]} ids
 * @param {number[]} cIds
 * @returns
 */
export async function moveTo(ids: string[], cIds: number[]) {
  return request('/api/article/moveTo', {
    method: 'PUT',
    data: {
      ids,
      cIds,
    },
  });
}

/**
 * 设置发发布属性
 *
 * @export
 * @param {string[]} ids
 * @param {string} pubStatus
 * @returns
 */
export async function setPub(ids: string[], pubStatus: string) {
  return request('/api/article/attribut', {
    method: 'PUT',
    data: {
      ids,
      attr: { pubStatus },
    },
  });
}

/**
 * 设置是否头条
 *
 * @export
 * @param {string[]} ids
 * @param {boolean} isHead
 * @returns
 */
export async function setIsHead(ids: string[], isHead: boolean) {
  return request('/api/article/attribut', {
    method: 'PUT',
    data: {
      ids,
      attr: { isHead },
    },
  });
}

/**
 * 设置是否推荐
 *
 * @export
 * @param {string[]} ids
 * @param {boolean} isRecom
 * @returns
 */
export async function setIsRecom(ids: string[], isRecom: boolean) {
  return request('/api/article/attribut', {
    method: 'PUT',
    data: {
      ids,
      attr: { isRecom },
    },
  });
}

function getBody(xhr: XMLHttpRequest) {
  const text = xhr.responseText || xhr.response;

  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

/**
 * 配合BraftEditor组件做文件上传
 *
 * @export
 * @param {BraftUploadFile} param
 */
export function upload(param: BraftUploadFile) {
  const serverURL = '/api/upload';
  const xhr = new XMLHttpRequest();

  if (xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        param.progress((e.loaded / e.total) * 100);
      }
    };
  }

  const formData = new FormData();
  console.log(param.file);

  formData.append(param.file.type.split('/')[0], param.file);

  xhr.onerror = function error(e) {
    // 上传发生错误时调用param.error
    console.log(`------xhr.onerror------`);
    console.dir(e);
    console.log(`------xhr.onerror------`);
    param.error({
      msg: 'unable to upload.',
    });
  };

  xhr.onload = () => {
    // allow success when 2xx status
    // see https://github.com/react-component/upload/issues/34
    if (xhr.status < 200 || xhr.status >= 300) {
      param.error({
        msg: 'unable to upload.',
      });
    }

    const res = getBody(xhr);
    param.success({
      url: res,
      meta: {
        id: '',
        title: param.file.name,
        alt: param.file.name,
        loop: false,
        autoPlay: false,
        controls: true,
        poster: '',
      },
    });
  };

  xhr.open('POST', serverURL, true);
  // xhr.withCredentials = true;

  xhr.send(formData);
}

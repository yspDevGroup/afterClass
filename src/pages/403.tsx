/*
 * @description: 鉴权失败界面
 * @author: zpl
 * @Date: 2021-07-14 17:11:16
 * @LastEditTime: 2021-10-30 11:24:30
 * @LastEditors: zpl
 */
import React from 'react';
import { history, useModel } from 'umi';
import { Button, Result } from 'antd';
import { getPageQuery, removeOAuthToken, removeUserInfoCache } from '@/utils/utils';

const NotFind = () => {
  const { initialState } = useModel('@@initialState');
  const query = getPageQuery();
  const { title, message, btnTXT, goto } = query;
  return (
    <Result
      status="403"
      // title="抱歉，您无权访问此页面。"
      subTitle={
        <>
          <span>{title || '抱歉，您无权访问此页面。'}</span>
          {message && <div>{message}</div>}
        </>
      }
      extra={
        btnTXT && goto ? (
          <Button
            type="primary"
            onClick={() => {
              const url = decodeURIComponent(Array.isArray(goto) ? goto[0] : goto);
              if (url.startsWith('http')) {
                (window.top || window).location.href = url;
              } else {
                history.push(url);
              }
            }}
          >
            {btnTXT}
          </Button>
        ) : initialState?.buildOptions.authType !== 'wechat' ? (
          <Button
            type="primary"
            onClick={() => {
              removeOAuthToken();
              removeUserInfoCache();
              history.push('/');
            }}
          >
            返回首页
          </Button>
        ) : (
          ''
        )
      }
    />
  );
};

export default NotFind;

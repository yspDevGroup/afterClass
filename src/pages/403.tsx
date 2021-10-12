/*
 * @description: 鉴权失败界面
 * @author: zpl
 * @Date: 2021-07-14 17:11:16
 * @LastEditTime: 2021-10-12 22:09:05
 * @LastEditors: zpl
 */
import React from 'react';
import { history } from 'umi';
import { Button, Result } from 'antd';
import { getPageQuery } from '@/utils/utils';

const NotFind = () => {
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
        ) : (
          ''
        )
      }
    />
  );
};

export default NotFind;

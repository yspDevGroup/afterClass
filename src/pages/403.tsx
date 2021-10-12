/*
 * @description: 鉴权失败界面
 * @author: zpl
 * @Date: 2021-07-14 17:11:16
 * @LastEditTime: 2021-10-12 14:44:22
 * @LastEditors: zpl
 */
import React from 'react';
import { Result } from 'antd';
import { getPageQuery } from '@/utils/utils';

const NotFind = () => {
  const query = getPageQuery();
  return (
    <Result
      status="403"
      // title="抱歉，您无权访问此页面。"
      subTitle={
        <>
          <span>抱歉，您无权访问此页面。</span>
          {query.message ? (
            <>
              <br />
              {query.message}
            </>
          ) : (
            ''
          )}
        </>
      }
      // extra={
      //   <Button
      //     type="primary"
      //     onClick={() => {
      //       (window.top || window).location.href = '/';
      //     }}
      //   >
      //     返回首页
      //   </Button>
      // }
    />
  );
};

export default NotFind;

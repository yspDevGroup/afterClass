/*
 * @description: 第三方页面容器页
 * @author: zpl
 * @Date: 2021-12-03 14:51:18
 * @LastEditTime: 2021-12-07 09:59:15
 * @LastEditors: zpl
 */
import React, { useEffect, useState } from 'react';
import PageLoading from '@/components/PageLoading';
import { getOauthToken } from '@/utils/utils';

const ThirdPary = () => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const token = getOauthToken().ysp_access_token;
    setUrl(`//basical.test.xianyunshipei.com?ysp_token=${token}`);
  }, []);

  if (!url) {
    return <PageLoading />;
  }
  return <iframe src={url} style={{ width: '100%', height: '100%', border: 'none' }} />;
};

export default ThirdPary;

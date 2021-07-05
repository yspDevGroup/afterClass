/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @description: OAuth认证通过后的跳转页面
 * @author: zpl
 * @Date: 2021-05-13 09:08:04
 * @LastEditTime: 2021-07-05 11:29:11
 * @LastEditors: zpl
 */
import React, { useCallback, useEffect } from 'react';
import { history, useModel } from 'umi';
import { Result, Spin } from 'antd';
import { getPageQuery } from '@/utils/utils';

const query = getPageQuery();

const goto = () => {
  if (!history) return;
  setTimeout(() => {
    history.replace('/');
  }, 10);
};

const Comp = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = useCallback(async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      setInitialState(initialState ? { ...initialState, currentUser: userInfo } : undefined);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { token } = query;
      if (token) {
        localStorage.setItem('token', Array.isArray(token) ? token.toString() : token);
        await fetchUserInfo();
        goto();
      } else {
        localStorage.removeItem('token');
      }
    })();
  }, [query]);
  return (
    <Result
      status={query.token ? 'success' : 'error'}
      icon={query.token ? <Spin /> : undefined}
      title={query.token ? '' : '非法访问'}
      subTitle={query.token ? `` : query.error || ''}
      extra={query.token ? [] : []}
      style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

export default Comp;

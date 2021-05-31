/*
 * @description: OAuth认证通过后的跳转页面
 * @author: zpl
 * @Date: 2021-05-13 09:08:04
 * @LastEditTime: 2021-05-31 08:24:13
 * @LastEditors: zpl
 */
import React, { useCallback, useEffect } from 'react';
import { Link, history, useModel } from 'umi';
import { Button, Result, Spin } from 'antd';
import { getPageQuery } from '@/utils/utils';

const backToLogin = (
  <Link to="/user/login">
    <Button type="primary">返回登录</Button>
  </Link>
);
// const toHome = (
//   <Link to="/">
//     <Button type="primary">进入主页</Button>
//   </Link>
// )
const Comp = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = useCallback(async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      setInitialState(initialState ? { ...initialState, currentUser: userInfo } : undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const query = getPageQuery();
  useEffect(() => {
    (async () => {
      const { token } = query;
      if (token) {
        localStorage.setItem('token', Array.isArray(token) ? token.toString() : token);
        await fetchUserInfo();
        setTimeout(() => {
          history.replace('/');
        }, 10);
      }
    })();
  }, [fetchUserInfo, query]);
  return (
    <Result
      status={query.token ? 'success' : 'error'}
      icon={query.token ? <Spin /> : undefined}
      title={query.token ? '' : '非法访问'}
      subTitle={query.token ? '欢迎使用本系统，页面正在跳转中...' : query.error || ''}
      extra={query.token ? [] : [backToLogin]}
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

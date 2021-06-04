/* eslint-disable no-debugger */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @description: OAuth认证通过后的跳转页面
 * @author: zpl
 * @Date: 2021-05-13 09:08:04
 * @LastEditTime: 2021-06-04 14:38:12
 * @LastEditors: zpl
 */
import React, { useCallback, useEffect } from 'react';
import { Link, history, useModel } from 'umi';
import { Button, Result, Spin } from 'antd';
import { getPageQuery } from '@/utils/utils';

const query = getPageQuery();

const backToLogin = (
  <Link to="/user/login">
    <Button type="primary">返回登录</Button>
  </Link>
);
const toHome = (
  <Link to="/">
    <Button type="primary">进入主页</Button>
  </Link>
);
const Comp = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = useCallback(async (debug: boolean) => {
    const userInfo = await initialState?.fetchUserInfo?.(debug);
    if (typeof debug !== 'undefined') {
      debugger;
    }
    if (userInfo) {
      setInitialState(initialState ? { ...initialState, currentUser: userInfo } : undefined);
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log('userInfo', userInfo);
        if (typeof debug !== 'undefined') {
          debugger;
        }
        switch (userInfo.auth) {
          case '管理员':
            history.replace('/courseManagements');
            break;
          case '老师':
            history.replace('/teacher/home');
            break;
          case '家长':
            history.replace('/homepage');
            break;
          default:
            history.replace('/');
            break;
        }
      }, 10);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { token, debug } = query;
      if (typeof debug !== 'undefined') {
        debugger;
      }
      if (token) {
        localStorage.setItem('token', Array.isArray(token) ? token.toString() : token);
        await fetchUserInfo(!!debug);
      }
    })();
  }, [query]);
  return (
    <Result
      status={query.token ? 'success' : 'error'}
      icon={query.token ? <Spin /> : undefined}
      title={query.token ? '' : '非法访问'}
      subTitle={
        query.token ? `欢迎使用本系统，页面正在跳转中...${window.location.href}` : query.error || ''
      }
      extra={query.token ? [toHome, backToLogin] : [backToLogin]}
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

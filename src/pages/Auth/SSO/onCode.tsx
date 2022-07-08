import React, { useEffect } from 'react';
import { message } from 'antd';
import { history, useModel } from 'umi';
import { login } from '@/services/after-class/auth';
import {
  getLoginPath,
  getQueryObj,
  gotoLink,
  removeOAuthToken,
  saveOAuthToken,
} from '@/utils/utils';

const OnCode = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {
    (async () => {
      const { code } = getQueryObj();
      if (code) {
        localStorage.setItem('authType', 'password');
        const tokenRes = await login({
          appCode: ENV_clientId,
          access_token: code,
          authType: 'sso',
          plat: 'school',
        });
        if (tokenRes.status === 'ok') {
          saveOAuthToken({
            access_token: tokenRes.data,
          });
          // 刷新全局属性后向首页跳转
          if (initialState) {
            const userInfo = await initialState.fetchUserInfo?.();
            setInitialState({ ...initialState, currentUser: userInfo });
            history.replace('/' + location.search);
          }
        } else {
          message.warn('认证信息无效');
          removeOAuthToken();
          history.replace('/403');
        }
      } else {
        removeOAuthToken();
        if (initialState) {
          const url = getLoginPath({ buildOptions: initialState.buildOptions });
          gotoLink(url);
        } else {
          history.replace('/403');
        }
      }
    })();
  }, []);

  return <div>认证跳转中。。。</div>;
};

export default OnCode;

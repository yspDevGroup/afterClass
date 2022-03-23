/*
 * @description: OAuth认证回调页面，password模式，本页面会先写入本地token缓存并触发身份信息获取，然后跳转向权限对应的页面
 * @author: zpl
 * @Date: 2021-07-14 16:54:06
 * @LastEditTime: 2022-03-23 18:09:07
 * @LastEditors: zpl
 */
import { useEffect } from 'react';
import type { FC } from 'react';
import { history, useModel } from 'umi';
import { message } from 'antd';
import {
  getLoginPath,
  getPageQuery,
  gotoLink,
  removeOAuthToken,
  saveOAuthToken,
} from '@/utils/utils';
import { createSSOToken } from '@/services/after-class/sso';

const AuthCallback: FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const query = getPageQuery();

  const goto = async () => {
    // 通知后台产生token
    const tokenRes = await createSSOToken({
      access_token: query.ysp_access_token as string,
      expires_in: parseInt((query.ysp_expires_in as string | undefined) || '0', 10),
      refresh_token: query.ysp_refresh_token as string,
      token_type: (query.ysp_token_type as string | undefined) || undefined,
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
  };

  useEffect(() => {
    localStorage.setItem('authType', 'password');
    if (query.ysp_access_token) {
      goto();
    } else {
      removeOAuthToken();
      if (initialState) {
        const url = getLoginPath({ buildOptions: initialState.buildOptions });
        gotoLink(url);
      } else {
        history.replace('/403');
      }
    }
  }, []);

  return <></>;
};

export default AuthCallback;

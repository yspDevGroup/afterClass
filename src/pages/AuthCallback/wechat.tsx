/*
 * @description: 微信认证回调，本页面接收code后，通知后台获取登录信息
 * @author: zpl
 * @Date: 2021-09-04 09:00:38
 * @LastEditTime: 2021-10-30 12:39:05
 * @LastEditors: zpl
 */
import React, { useEffect } from 'react';
import { message } from 'antd';
import { useModel, history } from 'umi';
import { getPageQuery, removeOAuthToken, removeUserInfoCache } from '@/utils/utils';
import { creatTokenForWechat } from '@/utils/wx';

const WechatAuth = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const goto = async () => {
    // 通知后台产生token
    const query = getPageQuery();
    const params: Record<string, string> = {
      ...query,
      plat: 'school',
    };
    params.suiteID = params.SuiteID || params.suiteID || '';
    const tokenRes = await creatTokenForWechat(params);
    if (tokenRes) {
      // 刷新全局属性后向首页跳转
      if (initialState) {
        const userInfo = await initialState.fetchUserInfo?.();
        setInitialState({ ...initialState, currentUser: userInfo });
        history.replace('/' + location.search);
      }
    } else {
      message.warn('认证信息无效');
      history.replace('/403');
    }
  };

  useEffect(() => {
    removeUserInfoCache();
    removeOAuthToken();
    goto();
  }, []);

  return <></>;
};

export default WechatAuth;

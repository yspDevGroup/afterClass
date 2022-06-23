/*
 * @description: 企业微信登录入口
 * @author: zpl
 * @Date: 2022-06-17 15:27:55
 * @LastEditTime: 2022-06-21 11:22:27
 * @LastEditors: zpl
 */
import React, { useEffect } from 'react';
import { getBuildOptions, getQueryObj } from '@/utils/utils';
import { message } from 'antd';
import { getWechatAuthRedirect } from '@/services/wechat/service';

/**
 * 企业微信登录授权模式
 *
 * snsapi_userinfo，静默授权，可获取成员的详细信息，但不包含手机、邮箱等敏感信息
 *
 * snsapi_privateinfo，手动授权，可获取成员的详细信息，包含手机、邮箱等敏感信息（已不再支持获取手机号/邮箱）
 */
type ScopeType = 'snsapi_userinfo' | 'snsapi_privateinfo';

const ComWX = () => {
  // 手动授权，可获取成员的详细信息，包含手机、邮箱等敏感信息（已不再支持获取手机号/邮箱）。
  const scope: ScopeType = 'snsapi_privateinfo';

  useEffect(() => {
    (async () => {
      const { suiteID } = getQueryObj();
      if (!suiteID) {
        message.warn('访问链接不合法，无法登录');
        return;
      }
      const { ENV_host } = await getBuildOptions();
      const codeCallback = new URL(`${ENV_host}/Auth/ComWX/onCode`);
      // sass环境需要支持多应用认证，所以需要拼接suiteID参数
      codeCallback.searchParams.set('suiteID', suiteID);
      const redirect = codeCallback.href;
      const { errCode, data, msg } = await getWechatAuthRedirect({
        suiteID,
        scope,
        callback: redirect,
      });
      console.log('🚀 ~ file: index.tsx ~ line 43 ~ data', data);
      debugger;
      if (errCode) {
        console.error(msg);
        message.error('获取微信认证链接失败');
      } else {
        window.location.href = data;
      }
    })();
  }, []);

  return <div>微信认证跳转中。。。</div>;
};

export default ComWX;

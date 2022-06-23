/*
 * @description: 企业微信登录后携带code等信息，通过特定接口获取用户信息后进入本地认证流程
 * @author: zpl
 * @Date: 2022-06-20 19:36:09
 * @LastEditTime: 2022-06-22 17:27:22
 * @LastEditors: zpl
 */
import React, { useEffect, useState } from 'react';
import { getWechatLoginInfo } from '@/services/wechat/service';
import { getQueryObj } from '@/utils/utils';
import { message } from 'antd';

const OnCode = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    (async () => {
      const { code, state, suiteID } = getQueryObj();
      if (code && state && suiteID) {
        const { errCode, data, msg } = await getWechatLoginInfo({ code, state, suiteID });
        if (errCode) {
          console.error(msg);
          message.error('获取登录信息失败');
        } else {
          const { CorpId, UserId } = data;
          // TODO: 后台提供一个通过企业ID加用户ID进行登录的接口
          setUser({ CorpId, UserId });
        }
      }
    })();
  }, []);

  return <div>{user ? JSON.stringify(user) : '微信认证跳转中。。。'}</div>;
};

export default OnCode;

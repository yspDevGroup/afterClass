import React, { useEffect, useRef } from 'react';
import { Avatar, message, Spin } from 'antd';
import { useModel } from 'umi';
import styles from './index.less';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import defaultAvatar from '@/assets/avatar.png';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const userRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      if (await initWXAgentConfig(['checkJsApi'])) {
        showUserName(userRef?.current, currentUser?.userId);
        // 注意: 只有 agentConfig 成功回调后，WWOpenData 才会注入到 window 对象上面
        WWOpenData.bindAll(document.querySelectorAll('ww-open-data'));
      } else {
        console.warn('微信登录过期，请重新授权')
        message.warn('微信登录过期，请重新授权')
      }
    })();
  }, [currentUser]);

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  if (!currentUser || !currentUser.username) {
    return loading;
  }

  return (
    <>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={currentUser.avatar || defaultAvatar}
          alt="avatar"
        />
        <span className={`${styles.name} anticon`} ref={userRef}>
          {currentUser.username}
        </span>
      </span>
    </>
  );
};

export default AvatarDropdown;

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Avatar, Menu, Spin } from 'antd';
import { useModel, history } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
// import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import defaultAvatar from '@/assets/avatar.png';
import { getXXJBSJ } from '@/services/after-class/xxjbsj';
import { LogoutOutlined } from '@ant-design/icons';
import { removeOAuthToken } from '@/utils/utils';
import ShowName from '@/components/ShowName';

import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const [xxData, setXxData] = useState<any>();
  const userRef = useRef(null);
  useEffect(() => {
    async function fetchData() {
      const res = await getXXJBSJ({ id: currentUser?.xxId });
      if (res.status === 'ok') {
        setXxData(res.data);
      }
    }
    fetchData();
  }, []);

  const onMenuClick = useCallback(
    (info: {
      key: string;
      keyPath: string[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
    }) => {
      const { key } = info;
      if (key === 'logout' && initialState) {
        const authType = localStorage.getItem('authType') || 'local';
        localStorage.removeItem('authType');
        setInitialState({ ...initialState, currentUser: undefined });
        removeOAuthToken();
        history.replace(authType === 'wechat' ? '/auth_callback/overDue' : '/');
        return;
      }
    },
    [initialState, setInitialState],
  );

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

  if (!currentUser || (!currentUser.username && !currentUser.name)) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <span className={`${styles.action} ${styles.account}`}>
        {xxData ? (
          <span style={{ paddingRight: '40px' }}>
            {xxData?.QYTB && xxData?.QYTB.indexOf('http') > -1 ? (
              <img
                style={{ width: '40px', height: '40px', borderRadius: '40px' }}
                src={xxData?.QYTB}
              />
            ) : (
              ''
            )}{' '}
            {xxData?.XXMC}
          </span>
        ) : (
          ''
        )}
        <HeaderDropdown overlay={menuHeaderDropdown}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar
              size="small"
              className={styles.avatar}
              src={currentUser.avatar || defaultAvatar}
              alt="avatar"
            />
            <span className={`${styles.name} anticon`} ref={userRef}>
              <ShowName XM={currentUser.XM} type="userName" openid={currentUser?.UserId} />
            </span>
          </span>
        </HeaderDropdown>
      </span>
    </>
  );
};

export default AvatarDropdown;

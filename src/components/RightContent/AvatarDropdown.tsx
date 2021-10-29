import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Avatar, Menu, Spin } from 'antd';
import { useModel, history } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
// import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import defaultAvatar from '@/assets/avatar.png';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { getXXJBSJ } from '@/services/after-class/xxjbsj';
import { LogoutOutlined } from '@ant-design/icons';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // const [wechatReded, setWechatReded] = useState(false);
  // const [wechatInfo, setWechatInfo] = useState({
  //   openId: '',
  // });

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
  // useEffect(() => {
  //   (async () => {
  //     if (/MicroMessenger/i.test(navigator.userAgent)) {
  //       await initWXConfig(['checkJsApi']);
  //     }
  //     if (await initWXAgentConfig(['checkJsApi'])) {
  //       // showUserName(userRef?.current, currentUser?.userId);
  //       // // 注意: 只有 agentConfig 成功回调后，WWOpenData 才会注入到 window 对象上面
  //       // WWOpenData.bindAll(document.querySelectorAll('ww-open-data'));
  //       setWechatReded(true);
  //     } else {
  //       console.warn('微信登录过期，请重新授权');
  //       message.warn('微信登录过期，请重新授权');
  //     }
  //   })();
  // }, [currentUser]);
  // useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //   wechatReded &&
  //     setWechatInfo({
  //       openId: currentUser?.UserId || '',
  //     });
  // }, [wechatReded]);

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        setInitialState({ ...initialState, currentUser: undefined });
        history.replace('/auth_callback/overDue');
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
          </span>
        </HeaderDropdown>
        <span className={`${styles.name} anticon`} ref={userRef}>
          <WWOpenDataCom type="userName" openid={currentUser?.UserId || ''} />

          {/* {currentUser.username} */}
        </span>
      </span>
    </>
  );
};

export default AvatarDropdown;

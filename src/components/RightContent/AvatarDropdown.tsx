import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Avatar, Menu, Spin } from 'antd';
import { useModel, history, useAccess, Access } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import defaultAvatar from '@/assets/avatar.png';
import { getXXJBSJ } from '@/services/after-class/xxjbsj';
import { LogoutOutlined } from '@ant-design/icons';
import { removeOAuthToken, gotoAdmin, gotoTeacher, gotoParent } from '@/utils/utils';
import ShowName from '@/components/ShowName';

import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { isAdmin, isParent, isTeacher } = useAccess();

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

  const logout = useCallback(() => {
    if (initialState) {
      const authType: AuthType = (localStorage.getItem('authType') as AuthType) || 'local';
      localStorage.removeItem('authType');
      setInitialState({ ...initialState, currentUser: undefined });
      removeOAuthToken();
      switch (authType) {
        case 'wechat':
          history.replace('/auth_callback/overDue');
          break;
        case 'xaedu':
          window.close();
          break;
        default:
          history.replace('/');
          break;
      }
    }
  }, [initialState, setInitialState]);

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
    <Menu className={styles.menu} selectedKeys={[]}>
      <Access accessible={isAdmin && localStorage.getItem('afterclass_role') !== 'admin'}>
        <Menu.Item key="admin" onClick={gotoAdmin}>
          <LogoutOutlined />
          切换到管理员
        </Menu.Item>
      </Access>
      <Access accessible={isTeacher && localStorage.getItem('afterclass_role') !== 'teacher'}>
        <Menu.Item key="teacher" onClick={gotoTeacher}>
          <LogoutOutlined />
          切换到教师
        </Menu.Item>
      </Access>
      <Access accessible={isParent && localStorage.getItem('afterclass_role') !== 'parent'}>
        <Menu.Item
          key="parent"
          onClick={() => {
            if (initialState?.currentUser?.student?.length !== 0) {
              gotoParent();
              return;
            } else {
              history.replace('/403?message=您当前未绑定学生，请先联系管理员绑定学生');
              return;
            }
          }}
        >
          <LogoutOutlined />
          切换到家长
        </Menu.Item>
      </Access>
      <Menu.Item key="logout" onClick={logout}>
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
              <ShowName
                XM={currentUser.XM || currentUser.realName}
                type="userName"
                openid={currentUser?.UserId || currentUser.username}
              />
            </span>
          </span>
        </HeaderDropdown>
      </span>
    </>
  );
};

export default AvatarDropdown;

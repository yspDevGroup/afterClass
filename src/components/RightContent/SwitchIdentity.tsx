import React from 'react';
import { Dropdown, Menu } from 'antd';
import { useModel, history, useAccess, Access } from 'umi';

import { LogoutOutlined, RightOutlined, SwapOutlined } from '@ant-design/icons';
import { gotoAdmin, gotoTeacher, gotoParent, removeOAuthToken, getAuthType } from '@/utils/utils';

import styles from './index.less';
export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const SwitchIdentity = (props: { logout?: boolean }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { isLogin, isAdmin, isTeacher, isParent } = useAccess();
  const { logout = false } = props;
  const list = [isAdmin, isParent, isTeacher];
  if (logout) {
    list.push(isLogin);
  }
  const menuHeaderDropdown = (
    <Menu>
      <Access accessible={isAdmin && localStorage.getItem('afterclass_role') !== 'admin'}>
        <Menu.Item key="admin" onClick={gotoAdmin}>
          <SwapOutlined />
          切换到管理员
        </Menu.Item>
      </Access>
      <Access accessible={isTeacher && localStorage.getItem('afterclass_role') !== 'teacher'}>
        <Menu.Item key="teacher" onClick={gotoTeacher}>
          <SwapOutlined />
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
          <SwapOutlined />
          切换到家长
        </Menu.Item>
      </Access>
      <Access accessible={isLogin && logout}>
        <Menu.Item
          key="admin"
          onClick={() => {
            setInitialState({ ...initialState!, currentUser: undefined });
            removeOAuthToken();
            history.replace(getAuthType() === 'wechat' ? '/auth_callback/overDue' : '/');
          }}
        >
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Access>
    </Menu>
  );
  const gteColor = () => {
    if (localStorage.getItem('afterclass_role') === 'parent') {
      return {
        color: '#15B628',
      };
    }
    return {};
  };
  console.log('list', list);
  return (
    <>
      {list.filter((item) => item).length > 1 && (
        <Dropdown overlay={menuHeaderDropdown} trigger={['click']}>
          <a className={styles.menuName} style={gteColor()} onClick={(e) => e.preventDefault()}>
            {logout ? '我的' : '切换身份'} <RightOutlined style={{ fontSize: '12px' }} />
          </a>
        </Dropdown>
      )}
    </>
  );
};

export default SwitchIdentity;

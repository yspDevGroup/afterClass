import React from 'react';
import { Dropdown, Menu } from 'antd';
import { useModel, history, useAccess, Access } from 'umi';

import { LogoutOutlined, RightOutlined } from '@ant-design/icons';
import { gotoAdmin, gotoTeacher, gotoParent } from '@/utils/utils';

import styles from './index.less';
export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const SwitchIdentity: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState } = useModel('@@initialState');
  const { isAdmin, isTeacher, isParent } = useAccess();

  const menuHeaderDropdown = (
    <Menu>
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
    </Menu>
  );

  return (
    <>
      {[isAdmin, isParent, isTeacher].filter((item) => item).length > 2 && (
        <Dropdown overlay={menuHeaderDropdown} arrow>
          <a className={styles.menuName} onClick={(e) => e.preventDefault()}>
            切换身份
            <RightOutlined style={{ fontSize: '12px' }} />
          </a>
        </Dropdown>
      )}
    </>
  );
};

export default SwitchIdentity;

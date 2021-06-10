import React from 'react';
import { Tabs } from 'antd';
import { HomeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import styles from './index.less';
import Home from './Home';
import Education from './Education';
import Mine from './Mine';

const { TabPane } = Tabs;
const PersonalHomepage = () => {
  return <div className={styles.mobilePageHeader}>
    <Tabs tabPosition='bottom' className={styles.menuTab}>
      <TabPane tab={
        <span>
          <HomeOutlined />
          首页
        </span>
      } key="index">
        <Home />
      </TabPane>
      <TabPane tab={
        <span>
          <MessageOutlined />
          教学中心
        </span>
      } key="study">
        <Education />
      </TabPane>
      <TabPane tab={
        <span>
          <UserOutlined />
          我的
        </span>
      } key="mine">
        <Mine />
      </TabPane>
    </Tabs>
  </div>;
};

export default PersonalHomepage;

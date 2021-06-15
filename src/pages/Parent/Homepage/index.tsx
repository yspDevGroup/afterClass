import React, { useState } from 'react';
import { Tabs } from 'antd';
import styles from './index.less';
import Home from './Home';
import Study from './Study';
import Mine from './Mine';
import IconFont from '@/components/CustomIcon';

const { TabPane } = Tabs;
const PersonalHomepage = () => {
  const [activeKey, setActiveKey] = useState<string>('index');
  return <div className={styles.mobilePageHeader}>
    <Tabs tabPosition='bottom' className={styles.menuTab} onTabClick={(key: string) =>{
       setActiveKey(key);
    }}>
      <TabPane tab={
        <span>
          <IconFont
            style={{'fontSize':'16px'}}
            type={activeKey === 'index' ? 'icon-zhuyefill' : 'icon-zhuye'}
          />
          首页
        </span>
      } key="index">
        <div style={{height: '100%', overflowY: 'auto'}} >
          <Home />
        </div>
      </TabPane>
      <TabPane tab={
        <span>
          <IconFont
            style={{'fontSize':'16px'}}
            type={activeKey === 'study' ? 'icon-xuexiyuandifill' : 'icon-xuexiyuandi'}
          />
          学习园地
        </span>
      } key="study">
        <Study />
      </TabPane>
      <TabPane tab={
        <span>
          <IconFont
            style={{'fontSize':'16px'}}
            type={activeKey === 'mine' ? 'icon-wodefill' : 'icon-wode'}
          />
          我的
        </span>
      } key="mine">
        <Mine />
      </TabPane>
    </Tabs>
  </div>;
};

export default PersonalHomepage;

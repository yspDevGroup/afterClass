import React, { useState } from 'react';
import { Tabs } from 'antd';
import IconFont from '@/components/CustomIcon';
import Home from './Home';
import Education from './Education';
import Mine from './Mine';
import styles from './index.less';

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
        <Home />
      </TabPane>
      <TabPane tab={
        <span>
        <IconFont
          style={{'fontSize':'16px'}}
          type={activeKey === 'education' ? 'icon-jiaoxuezhongxinfill' : 'icon-jiaoxuezhongxin'}
        />
          教学中心
        </span>
      } key="education">
        <Education />
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

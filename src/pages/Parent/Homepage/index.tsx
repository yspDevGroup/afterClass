import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getCurrentStatus } from '@/utils/utils';
import styles from './index.less';
import Home from './Home';
import Study from './Study';
import Mine from './Mine';
import IconFont from '@/components/CustomIcon';
import myContext from './myContext';
import { data } from './mock';

const { TabPane } = Tabs;
const PersonalHomepage = () => {
  const [activeKey, setActiveKey] = useState<string>('index');
  const [courseStatus, setCourseStatus] = useState<string>('enroll');
  const { bmkssj, bmjssj, skkssj, skjssj, ...rest } = data;
  useEffect(() => {

    async function fetchData() {
      // 获取后台学年学期数据
      const result = await queryXNXQList();
      const { XN, XQ } = result.current;
      console.log(XN, XQ);
    }
    fetchData();
    const cStatus = getCurrentStatus(bmkssj, bmjssj, skkssj, skjssj);
    setCourseStatus(cStatus);
  }, [])
  return <div className={styles.mobilePageHeader}>
    <myContext.Provider value={{ ...rest, courseStatus}}>
      <Tabs tabPosition='bottom' className={styles.menuTab} onTabClick={(key: string) => {
        setActiveKey(key);
      }}>
        <TabPane tab={
          <span>
            <IconFont
              style={{ 'fontSize': '16px' }}
              type={activeKey === 'index' ? 'icon-zhuyefill' : 'icon-zhuye'}
            />
            首页
          </span>
        } key="index">
          <div style={{ height: '100%', overflowY: 'auto' }} >
            <Home />
          </div>
        </TabPane>
        <TabPane tab={
          <span>
            <IconFont
              style={{ 'fontSize': '16px' }}
              type={activeKey === 'study' ? 'icon-xuexiyuandifill' : 'icon-xuexiyuandi'}
            />
            学习园地
          </span>
        } key="study">
          <div style={{ height: '100%', overflowY: 'auto' }} >
            <Study />
          </div>
        </TabPane>
        <TabPane tab={
          <span>
            <IconFont
              style={{ 'fontSize': '16px' }}
              type={activeKey === 'mine' ? 'icon-wodefill' : 'icon-wode'}
            />
            我的
          </span>
        } key="mine">
          <div style={{ height: '100%', overflowY: 'auto' }} >
            <Mine />
          </div>
        </TabPane>
      </Tabs>

    </myContext.Provider>
  </div>;
};

export default PersonalHomepage;

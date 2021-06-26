import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import IconFont from '@/components/CustomIcon';
import Home from './Home';
import Education from './Education';
import Mine from './Mine';
import styles from './index.less';
import myContext from '@/pages/Parent/Homepage/myContext';
// import { dataSource } from '@/components/Search/mock';
import { useModel } from '@/.umi/plugin-model/useModel';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { homePageInfo } from '@/services/after-class/user';
import { getCurrentStatus } from '@/utils/utils';

const { TabPane } = Tabs;
const PersonalHomepage = () => {
  const { initialState } = useModel('@@initialState');
  const [activeKey, setActiveKey] = useState<string>('index');
  const { currentUser } = initialState || {};
  const [courseStatus, setCourseStatus] = useState<string>('empty');
  const [dataSource, setDataSource] = useState<any>();
  useEffect(() => {
    async function fetchData() {
      // 获取后台学年学期数据
      const result = await queryXNXQList();
      const { XN, XQ } = result.current;
      const res = await homePageInfo({
        xn: XN,
        xq: XQ,
        XSId: currentUser?.userId || currentUser?.id,
        njId: '1'
      });
      if (res.status === 'ok' && res.data) {
        setDataSource(res.data);
        const { bmkssj, bmjssj, skkssj, skjssj } = res.data;
        if (bmkssj && bmjssj && skkssj && skjssj) {
          const cStatus = getCurrentStatus(bmkssj, bmjssj, skkssj, skjssj);
          setCourseStatus(cStatus);
        }
      }
    }
    fetchData();

  }, [])
  return <div className={styles.mobilePageHeader}>
    <myContext.Provider value={{ ...dataSource, courseStatus, currentUser }}>
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
          <Home />
        </TabPane>
        <TabPane tab={
          <span>
            <IconFont
              style={{ 'fontSize': '16px' }}
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
              style={{ 'fontSize': '16px' }}
              type={activeKey === 'mine' ? 'icon-wodefill' : 'icon-wode'}
            />
            我的
          </span>
        } key="mine">
          <Mine />
        </TabPane>
      </Tabs>

    </myContext.Provider>
  </div>;
};

export default PersonalHomepage;

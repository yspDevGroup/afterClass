import { useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import IconFont from '@/components/CustomIcon';
import Home from './Home';
import Statistical from './Statistical';
import TopNav from './Home/components/TopNav';
import MobileCon from '@/components/MobileCon';

import styles from './index.less';

const { TabPane } = Tabs;
const Homepage = () => {
  const [activeKey, setActiveKey] = useState<string>('index');
  const [title, setTitle] = useState<string>('首页');
  const homeRef = useRef(null);
  const eduRef = useRef(null);
  const mineRef = useRef(null);
  useEffect(() => {
    localStorage.setItem('afterclass_role', 'admin');
  }, []);

  return (
    <MobileCon>
      <div className={styles.mobilePageHeader}>
        <TopNav title={title} state={false} />
        <Tabs
          // tabPosition="bottom"
          className={styles.menuTab}
          onTabClick={(key: string) => {
            setActiveKey(key);
            if (key === 'mine') {
              setTitle('统计');
            } else {
              setTitle('首页');
            }

            if (homeRef.current) (homeRef.current as unknown as HTMLElement).scrollTop = 0;
            if (eduRef.current) (eduRef.current as unknown as HTMLElement).scrollTop = 0;
            if (mineRef.current) (mineRef.current as unknown as HTMLElement).scrollTop = 0;
          }}
          activeKey={activeKey}
        >
          <TabPane
            tab={
              <span>
                <IconFont
                  style={{ fontSize: '26px' }}
                  type={activeKey === 'index' ? 'icon-zhuyefill' : 'icon-zhuye'}
                />
                首页
              </span>
            }
            key="index"
          >
            <div
              className={styles.noScrollBar}
              style={{ height: '100%', overflowY: 'auto' }}
              ref={homeRef}
            >
              <Home />
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <IconFont
                  style={{ fontSize: '26px' }}
                  type={activeKey === 'mine' ? 'icon-tongjifill' : 'icon-tongji'}
                />
                统计
              </span>
            }
            key="mine"
          >
            <div
              className={styles.noScrollBar}
              style={{ height: '100%', overflowY: 'auto' }}
              ref={mineRef}
            >
              <Statistical />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </MobileCon>
  );
};

export default Homepage;

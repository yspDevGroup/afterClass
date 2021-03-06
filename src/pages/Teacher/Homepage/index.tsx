/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { Result, Tabs } from 'antd';
import IconFont from '@/components/CustomIcon';
import { getQueryObj } from '@/utils/utils';
import Home from './Home';
import Education from './Education';
import Mine from './Mine';
import styles from './index.less';
import { ParentHomeData } from '@/services/local-services/mobileHome';
import MobileCon from '@/components/MobileCon';

const { TabPane } = Tabs;
const PersonalHomepage = () => {
  const { initialState } = useModel('@@initialState');
  const [activeKey, setActiveKey] = useState<string>('index');
  const { currentUser } = initialState || {};
  const [courseStatus, setCourseStatus] = useState<string>('');
  const homeRef = useRef(null);
  const eduRef = useRef(null);
  const mineRef = useRef(null);
  const { index } = getQueryObj();
  useEffect(() => {
    (async () => {
      const oriData = await ParentHomeData(
        'teacher',
        currentUser?.xxId,
        currentUser?.JSId || testTeacherId,
      );
      const { courseStatus: newCourseStatus } = oriData.data;
      setCourseStatus(newCourseStatus);
    })();
  }, []);
  useEffect(() => {
    if (index) {
      setActiveKey(index);
    }
  }, [index]);

  if (!currentUser?.JSId && !testTeacherId) {
    // 如果用户不在老师表里
    return (
      <Result
        status="500"
        title="身份验证不通过"
        subTitle="您不是老师，或您的身份信息未同步，请联系管理员。"
      />
    );
  }

  return (
    <MobileCon>
      <ConfigProvider locale={zhCN}>
        <div className={styles.mobilePageHeader}>
          {courseStatus === '' ? (
            ''
          ) : (
            <Tabs
              // tabPosition="bottom"
              className={styles.menuTab}
              onTabClick={(key: string) => {
                setActiveKey(key);
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
                      style={{ fontSize: '24px' }}
                      type={activeKey === 'index' ? 'icon-zhuyefill' : 'icon-zhuye'}
                    />
                    首页
                  </span>
                }
                key="index"
              >
                <div
                  className={styles.noScrollBar}
                  style={{ height: '100%', overflowY: 'auto', background: '#F5F5F5' }}
                  ref={homeRef}
                >
                  <Home />
                </div>
              </TabPane>
              {courseStatus === 'empty' ? (
                ''
              ) : (
                <TabPane
                  tab={
                    <span>
                      <IconFont
                        style={{ fontSize: '24px' }}
                        type={
                          activeKey === 'education'
                            ? 'icon-jiaoxuezhongxinfill'
                            : 'icon-jiaoxuezhongxin'
                        }
                      />
                      教学中心
                    </span>
                  }
                  key="education"
                >
                  <div
                    className={styles.noScrollBar}
                    style={{ height: '100%', overflowY: 'auto' }}
                    ref={eduRef}
                  >
                    <Education />
                  </div>
                </TabPane>
              )}
              <TabPane
                tab={
                  <span>
                    <IconFont
                      style={{ fontSize: '26px' }}
                      type={activeKey === 'mine' ? 'icon-wode-wode' : 'icon-wode3'}
                      // type={activeKey === 'mine' ? 'icon-wodefill' : 'icon-wode'}
                    />
                    我的
                  </span>
                }
                key="mine"
              >
                <div
                  className={styles.noScrollBar}
                  style={{ height: '100%', overflowY: 'auto' }}
                  ref={mineRef}
                >
                  <Mine />
                </div>
              </TabPane>
            </Tabs>
          )}
        </div>
      </ConfigProvider>
    </MobileCon>
  );
};

export default PersonalHomepage;

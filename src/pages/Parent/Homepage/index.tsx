import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { useModel } from 'umi';
import Home from './Home';
import Study from './Study';
import Mine from './Mine';
import IconFont from '@/components/CustomIcon';
import { ChangePageTitle, enHenceMsg, getCurrentStatus, getQueryString } from '@/utils/utils';
import myContext from '@/utils/MyContext';
import styles from './index.less';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { homePageInfo } from '@/services/after-class/user';

const { TabPane } = Tabs;
const PersonalHomepage = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [activeKey, setActiveKey] = useState<string>('index');
  const [courseStatus, setCourseStatus] = useState<string>('');
  const [dataSource, setDataSource] = useState<any>();
  const homeRef = useRef(null);
  const studyRef = useRef(null);
  const mineRef = useRef(null);
  const index = getQueryString('index');
  useEffect(() => {
    ChangePageTitle(ENV_subTitle);
    async function fetchData() {
      // 获取后台学年学期数据
      const result = await queryXNXQList();
      if (result.current) {
        const { XN, XQ } = result.current;
        const children = currentUser?.subscriber_info?.children || [
          {
            student_userid: currentUser?.UserId || currentUser?.id,
            njId: '1',
          },
        ];
        const res = await homePageInfo({
          xn: XN,
          xq: XQ,
          XSId: children && children[0].student_userid,
          njId: children && children[0].njId,
        });
        if (res.status === 'ok') {
          if (res.data) {
            setDataSource(res.data);
            const { bmkssj, bmjssj, skkssj, skjssj } = res.data;
            if (bmkssj && bmjssj && skkssj && skjssj) {
              const cStatus = getCurrentStatus(bmkssj, bmjssj, skkssj, skjssj);
              setCourseStatus(cStatus);
            } else {
              setCourseStatus('empty');
            }
          } else {
            setCourseStatus('empty');
          }
        } else {
          enHenceMsg(res.message);
        }
      } else {
        setCourseStatus('empty');
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (index) {
      setActiveKey(index);
    }
  }, [index])
  return (
    <div className={styles.mobilePageHeader}>
      {courseStatus === '' ? (
        ''
      ) : (
          <myContext.Provider value={{ ...dataSource, courseStatus, currentUserInfo: currentUser }}>
            <Tabs
              tabPosition="bottom"
              className={styles.menuTab}
              onTabClick={(key: string) => {
                setActiveKey(key);
                if (homeRef.current) (homeRef.current as unknown as HTMLElement).scrollTop = 0;
                if (studyRef.current) (studyRef.current as unknown as HTMLElement).scrollTop = 0;
                if (mineRef.current) (mineRef.current as unknown as HTMLElement).scrollTop = 0;
              }}
              activeKey={activeKey}
            >
              <TabPane
                tab={
                  <span>
                    <IconFont
                      style={{ fontSize: '16px' }}
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
              {courseStatus === 'empty' ? (
                ''
              ) : (
                  <TabPane
                    tab={
                      <span>
                        <IconFont
                          style={{ fontSize: '16px' }}
                          type={activeKey === 'study' ? 'icon-xuexiyuandifill' : 'icon-xuexiyuandi'}
                        />
                    学习园地
                  </span>
                    }
                    key="study"
                  >
                    <div
                      className={styles.noScrollBar}
                      style={{ height: '100%', overflowY: 'auto' }}
                      ref={studyRef}
                    >
                      <Study />
                    </div>
                  </TabPane>
                )}
              <TabPane
                tab={
                  <span>
                    <IconFont
                      style={{ fontSize: '16px' }}
                      type={activeKey === 'mine' ? 'icon-wodefill' : 'icon-wode'}
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
          </myContext.Provider>
        )}
    </div>
  );
};

export default PersonalHomepage;

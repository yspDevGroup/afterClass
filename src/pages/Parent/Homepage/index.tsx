import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { useModel } from 'umi';
import { getQueryString } from '@/utils/utils';
import { ParentHomeData } from '@/services/local-services/mobileHome';

import Home from './Home';
import Study from './Study';
import Mine from './Mine';
import IconFont from '@/components/CustomIcon';

import styles from './index.less';

const { TabPane } = Tabs;
const PersonalHomepage = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student } = currentUser || {};
  const [activeKey, setActiveKey] = useState<string>('index');
  const [courseStatus, setCourseStatus] = useState<string>('enrolling');
  const homeRef = useRef(null);
  const studyRef = useRef(null);
  const mineRef = useRef(null);
  const index = getQueryString('index');
  const StorageXSId =
    localStorage.getItem('studentId') || (student && student[0].XSJBSJId) || testStudentId;
  const StorageNjId =
    localStorage.getItem('studentNjId') || (student && student[0].NJSJId) || testStudentNJId;
  const StorageXQSJId =
    localStorage.getItem('studentXQSJId') || currentUser?.student?.[0].XQSJId || testStudentXQSJId;
  // 未获取到孩子时跳转到403
  // useEffect(() => {
  //   if (typeof student === 'undefined' || student?.length === 0 || !student?.[0]?.XSJBSJId) {
  //     history.replace('/403?message=系统未读取到您的孩子信息，请与学校相关负责人联系');
  //   }
  // }, []);

  useEffect(() => {
    (async () => {
      const bjId =
        localStorage.getItem('studentBJId') || currentUser?.student?.[0].BJSJId || testStudentBJId;
      const oriData = await ParentHomeData(
        'student',
        currentUser?.xxId,
        StorageXSId,
        StorageNjId,
        bjId,
        StorageXQSJId,
      );
      const { courseStatus: newStatus } = oriData.data;
      setCourseStatus(newStatus);
    })();
  }, [StorageXSId]);
  useEffect(() => {
    if (index) {
      setActiveKey(index);
    }
  }, [index]);

  return (
    <div className={styles.mobilePageHeader}>
      {courseStatus === '' ? (
        ''
      ) : (
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
              <Mine status={courseStatus} setActiveKey={setActiveKey} />
            </div>
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default PersonalHomepage;

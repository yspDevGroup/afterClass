import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { useModel,history } from 'umi';
import Home from './Home';
import Study from './Study';
import Mine from './Mine';
import IconFont from '@/components/CustomIcon';
import { enHenceMsg, getCurrentStatus, getQueryString } from '@/utils/utils';
import myContext from '@/utils/MyContext';
import styles from './index.less';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { homePageInfo } from '@/services/after-class/user';
import moment from 'moment';
import { getAllCourses } from '@/services/after-class/khkcsj';

const { TabPane } = Tabs;
const PersonalHomepage = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [activeKey, setActiveKey] = useState<string>('index');
  const [courseStatus, setCourseStatus] = useState<string>('enrolling');
  const [dataSource, setDataSource] = useState<any>();
  const homeRef = useRef(null);
  const studyRef = useRef(null);
  const mineRef = useRef(null);
  const index = getQueryString('index');
  const StorageXSId = localStorage.getItem('studentId');
  const StorageNjId = localStorage.getItem('studentNjId');
  // 未获取到孩子时跳转到403
  // useEffect(() => {
  //   if(currentUser?.student?.length === 0 || typeof currentUser?.student === 'undefined'){
  //     history.replace('/403?message=系统未读取到您的孩子信息，请与学校相关负责人联系');
  //   }
  // }, [])
  useEffect(() => {
    async function fetchData() {
      // 获取后台学年学期数据
      const result = await queryXNXQList(currentUser?.xxId, undefined);
      if (result.current) {
        const { student } = currentUser || {};
        const res = await homePageInfo({
          XSId: StorageXSId || (student && student[0].student_userid) || testStudentId ,
          XNXQId: result.current.id,
          XXJBSJId: currentUser!.xxId,
          njId:StorageNjId || (student && student[0].NJSJId)
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
                <Mine setActiveKey={setActiveKey} />
              </div>
            </TabPane>
          </Tabs>
        </myContext.Provider>
      )}
    </div>
  );
};

export default PersonalHomepage;

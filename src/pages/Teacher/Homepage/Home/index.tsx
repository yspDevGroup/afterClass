import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import imgPop from '@/assets/mobileBg.png';
import imgNotice from '@/assets/notice.png';
import { RightOutlined } from '@ant-design/icons';
import ListComp from '@/components/ListComponent';
import { annoceData, currentData } from '../listData';
import CourseTab from './components/CourseTab';
import styles from './index.less';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';

const Home = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [enroll] = useState<boolean>(true);
  const userRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);
      showUserName(userRef?.current, currentUser?.userId);
      // 注意: 只有 agentConfig 成功回调后，WWOpenData 才会注入到 window 对象上面
      WWOpenData.bindAll(document.querySelectorAll('ww-open-data'));
    })();
  }, [currentUser]);

  return (
    <div className={styles.indexPage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}></div>
        <div className={styles.headerText}>
          <h4>
          <span ref={userRef}></span>
           老师，你好！
          </h4>
          <div>欢迎使用课后帮，课后服务选我就对了！ </div>
        </div>
      </header>
      <div className={styles.pageContent}>
        <div className={styles.noticeArea}>
          <img className={styles.noticeImg} src={imgNotice} />
          <div className={styles.noticeText}>
            <span>学校公告</span>
            <span>2021秋季课后服务课程报名开始了！</span>
          </div>
          <RightOutlined />
        </div>
        <div className={styles.enrollArea}>
          {enroll ? (
            <>
              <div className={styles.enrollText}>2021秋季课后服务课程报名开始了！</div>
              <div className={styles.enrollDate}>选课时间：2021.09.02 12:00—2021.09.05 18:00</div>
            </>
          ) : (
            <>
              <div className={styles.todayCourses}>
                <ListComp listData={currentData} />
              </div>
              <div className={styles.enrollText}>2021秋季课后服务课程报名已结束！</div>
            </>
          )}
        </div>
        <div className={styles.courseArea}>
          <CourseTab />
        </div>
        <div className={styles.announceArea}>
          <ListComp listData={annoceData} cls={styles.announceList} />
        </div>
      </div>
    </div>
  );
};

export default Home;

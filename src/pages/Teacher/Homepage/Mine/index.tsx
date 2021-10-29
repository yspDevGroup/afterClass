import React, { useEffect, useRef, useState } from 'react';
import { Link, useModel } from 'umi';
import { Image } from 'antd';
import { defUserImg } from '@/constant';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import IconFont from '@/components/CustomIcon';
import WWOpenDataCom from '@/components/WWOpenDataCom';

import styles from './index.less';
import imgPop from '@/assets/teacherBg.png';
import { ParentHomeData } from '@/services/local-services/mobileHome';
import CheckOnStatic from './components/CheckOnStatic';

const Mine = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [courseData, setCourseData] = useState<any>([]);
  const [scheduleData, setScheduleData] = useState<any>([]);
  const userRef = useRef(null);
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      if (await initWXAgentConfig(['checkJsApi'])) {
        showUserName(userRef?.current, currentUser?.UserId);
        // 注意: 只有 agentConfig 成功回调后，WWOpenData 才会注入到 window 对象上面
        WWOpenData?.bindAll(document.querySelectorAll('ww-open-data'));
      }
    })();
  }, [currentUser]);
  useEffect(() => {
    (async () => {
      const oriData = await ParentHomeData(currentUser?.xxId, currentUser.JSId || testTeacherId, 'teacher');
      const { yxkc, weekSchedule } = oriData;
      setCourseData(yxkc);
      setScheduleData(weekSchedule);
    })()
  }, []);

  return (
    <div className={styles.minePage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }} />
        <div className={styles.header}>
          <Image width={46} height={46} src={currentUser?.avatar} fallback={defUserImg} />
          <div className={styles.headerName}>
            <h4>
              <span ref={userRef}>
                {currentUser?.UserId === '未知' && currentUser.wechatUserId ? (
                  <WWOpenDataCom type="userName" openid={currentUser.wechatUserId} />
                ) : (
                  currentUser?.UserId
                )}</span>
              老师
            </h4>
          </div>
        </div>
      </header>
      <CheckOnStatic courseData={courseData} scheduleData={scheduleData} />
      <div className={styles.linkWrapper}>
        <ul>
          <li>
            <IconFont type="icon-fuwugonggao" style={{ fontSize: '18px' }} />
            <Link to="/teacher/home/notice/announcement?articlepage=serveAnnounce">
              服务公告
              <IconFont type="icon-gengduo" />
            </Link>
          </li>
          <li>
            <IconFont type="icon-guanyu" style={{ fontSize: '18px' }} />
            <Link to="/teacher/home/notice/announcement?articlepage=about">
              关于
              <IconFont type="icon-gengduo" />
            </Link>
          </li>
        </ul>
        <div className={styles.signOut}>
          <Link to="/auth_callback/overDue">
            退出登录
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Mine;

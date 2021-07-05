import React, { useEffect, useContext, useState } from 'react';
import imgPop from '@/assets/teacherBg.png';
import styles from './index.less';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import IconFont from '@/components/CustomIcon';
import EnrollClassTime from '@/components/EnrollClassTime';
import myContext from '@/utils/MyContext';
import TeachCourses from './components/TeachCourses';
import Details from './Pages/Details';
import { getAllXXGG } from '@/services/after-class/xxgg';
import { Link } from 'umi';
import WWOpenDataCom from '@/pages/Manager/ClassManagement/components/WWOpenDataCom';

const Home = () => {
  const { currentUserInfo } = useContext(myContext);
  const [notification, setNotification] = useState<any[]>();
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);
    })();
  }, []);
  useEffect(() => {
    async function announcements() {
      const res = await getAllXXGG({ status: ['发布'] });
      if (res.status === 'ok' && !(res.data === [])) {
        setNotification(res.data);
      }
    };
    announcements();
  }, []);

  return (
    <div className={styles.indexPage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}></div>
        <div className={styles.headerText}>
          <h4>
            <WWOpenDataCom type="userName" openid={currentUserInfo?.userId} />
            老师，你好！
          </h4>
          <div>欢迎使用课后帮，课后服务选我就对了！ </div>
        </div>
      </header>
      <div className={styles.pageContent}>
        <div className={styles.noticeArea}>
          <IconFont type="icon-gonggao" className={styles.noticeImg} />
          <div className={styles.noticeText}>
            <span>学校公告</span>
            {!(notification?.length === 0) ? notification?.map((record: any, index: number) => {
              if (index < 1) {
                return <Link to={`/teacher/home/notice/announcement?listid=${record.id}`} style={{ color: '#333' }}>{record.BT}</Link>
              }
              return ''

            }) : '暂无公告'
            }
          </div>
          <IconFont type="icon-gengduo" className={styles.gengduo} />
        </div>
        <div className={styles.enrollArea}>
          <EnrollClassTime teacher={true} />
        </div>
        <div className={styles.teachCourses}>
          <TeachCourses />
        </div>
        <div className={styles.announceArea}>
          <Details />
        </div>
      </div>
    </div>
  );
};

export default Home;

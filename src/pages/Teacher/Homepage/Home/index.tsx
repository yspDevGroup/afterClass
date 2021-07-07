import React, { useEffect, useContext, useRef, useState } from 'react';
import imgPop from '@/assets/teacherBg.png';
import styles from './index.less';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import IconFont from '@/components/CustomIcon';
import EnrollClassTime from '@/components/EnrollClassTime';
import myContext from '@/utils/MyContext';
import TeachCourses from './components/TeachCourses';
import Details from './Pages/Details';
import { getAllXXGG } from '@/services/after-class/xxgg';
import { Link } from 'umi';
import EmptyArticle from './Pages/EmptyArticle';

const Home = () => {
  const { currentUserInfo,courseStatus } = useContext(myContext);
  const userRef = useRef(null);
  const [notification, setNotification] = useState<any[]>();
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      if (await initWXAgentConfig(['checkJsApi'])) {
        showUserName(userRef?.current, currentUserInfo?.UserId);
        // 注意: 只有 agentConfig 成功回调后，WWOpenData 才会注入到 window 对象上面
        WWOpenData.bindAll(document.querySelectorAll('ww-open-data'));
      }
    })();
  }, [currentUserInfo]);


   useEffect(() => {
    async function announcements() {
      const res = await getAllXXGG({ status: ['发布'] });
      if (res.status === 'ok' && !(res.data?.length === 0)) {
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
            <span ref={userRef}>
              {currentUserInfo?.username}
            </span>
            老师，你好！
          </h4>
          <div>欢迎使用课后帮，课后服务选我就对了！ </div>
        </div>
      </header>
      {courseStatus === 'empty' ? <EmptyArticle />: <div className={styles.pageContent}>
        <div className={styles.noticeArea}>
          <IconFont type="icon-gonggao" className={styles.noticeImg} />
          <div className={styles.noticeText}>
            <span>学校公告</span>
            {notification && notification.length ? <Link to={`/teacher/home/notice/announcement?listid=${notification[0].id}`} style={{ color: '#333' }}>{notification[0].BT}</Link> : '暂无公告'}
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
        <Details data={notification} />
        </div>
      </div>}
    </div>
  );
};

export default Home;

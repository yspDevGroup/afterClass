import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'umi';
import EmptyBGC from '@/assets/EmptyBGC.png';
import imgPop from '@/assets/mobileBg.png';
import IconFont from '@/components/CustomIcon';
import EnrollClassTime from '@/components/EnrollClassTime';
import myContext from '@/utils/MyContext';
import CourseTab from './components/CourseTab';
import styles from './index.less';
import Details from './Pages/Details';
import { getAllXXGG } from '@/services/after-class/xxgg';

const Home = () => {
  const { currentUserInfo, courseStatus } = useContext(myContext);
  const [notification, setNotification] = useState<any[]>();
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
            <span>{currentUserInfo?.subscriber_info?.remark || currentUserInfo?.username || '家长'}</span>
            ，你好！
          </h4>
          <div>欢迎使用课后帮，课后服务选我就对了！ </div>
        </div>
      </header>
      {courseStatus === '' ? <div className={styles.opacity} style={{ backgroundImage: `url(${EmptyBGC})` }}>
      </div> : <div className={styles.pageContent}>
        <div className={styles.noticeArea}>
          <IconFont type='icon-gonggao' className={styles.noticeImg} />
          <div className={styles.noticeText}>
            <span>学校公告</span>
            {notification && notification.length ? <Link to={`/parent/home/notice/announcement?listid=${notification[0].id}`} style={{ color: '#333' }}><li >{notification[0].BT} </li></Link> : '暂无公告'}
          </div>
        </div>
        <div className={styles.enrollArea}>
          <EnrollClassTime />
        </div>
        <div className={styles.courseArea}>
          <CourseTab />
        </div>
        <div className={styles.announceArea}>
          <Details data={notification} />
        </div>
      </div>}
    </div>
  );
};

export default Home;

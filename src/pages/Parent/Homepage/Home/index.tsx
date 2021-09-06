import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'umi';
import imgPop from '@/assets/mobileBg.png';
import IconFont from '@/components/CustomIcon';
import EnrollClassTime from '@/components/EnrollClassTime';
import myContext from '@/utils/MyContext';
import CourseTab from './components/CourseTab';
import styles from './index.less';
import Details from './Pages/Details';
import { getAllXXGG } from '@/services/after-class/xxgg';
import EmptyArticle from './Pages/EmptyArticle';
import { enHenceMsg } from '@/utils/utils';
import { getXXTZGG } from '@/services/after-class/xxtzgg';

const Home = () => {
  const { currentUserInfo, courseStatus } = useContext(myContext);
  const [notification, setNotification] = useState<any>([]);
  useEffect(() => {
    async function announcements() {
      const res = await getXXTZGG({
        XXJBSJId: currentUserInfo?.xxId,
        BT: '',
        ZT: ['已发布'],
        page: 0,
        pageSize: 0,
      });
      if (res.status === 'ok') {
        setNotification(res.data!.rows);
      } else {
        enHenceMsg(res.message);
      }
    }
    announcements();
  }, []);
  return (
    <div className={styles.indexPage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}></div>
        <div className={styles.headerText}>
          <h4>
            <span>
              {currentUserInfo?.subscriber_info?.remark || currentUserInfo?.username || '家长'}
            </span>
            ，你好！
          </h4>
          <div>欢迎使用课后服务平台，课后服务选我就对了！ </div>
        </div>
      </header>
      {courseStatus === 'empty' ? (
        <EmptyArticle />
      ) : (
        <div className={styles.pageContent}>
          <div className={styles.noticeArea}>
            <IconFont type="icon-gonggao" className={styles.noticeImg} />
            <div className={styles.noticeText}>
              <span>学校公告</span>
              {notification && notification.length ? (
                <Link
                  to={`/parent/home/notice/announcement?listid=${notification[0].id}`}
                  style={{
                    color: '#333',
                    margin: '0 9px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {notification[0].BT}
                </Link>
              ) : (
                '暂无公告'
              )}
            </div>
            <Link
              to={{
                pathname: '/parent/home/notice',
                state: {
                  notification,
                },
              }}
            >
              {' '}
              <IconFont type="icon-gengduo" className={styles.gengduo} />
            </Link>
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
        </div>
      )}
    </div>
  );
};

export default Home;

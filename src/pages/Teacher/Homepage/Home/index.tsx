import React, { useEffect, useContext, useRef, useState } from 'react';
import imgPop from '@/assets/teacherBg.png';
import styles from './index.less';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import IconFont from '@/components/CustomIcon';
import EnrollClassTime from '@/components/EnrollClassTime';
import myContext from '@/utils/MyContext';
import TeachCourses from './components/TeachCourses';
import Details from './Pages/Details';
import { useModel, Link } from 'umi';
import { enHenceMsg } from '@/utils/utils';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
// import WWOpenDataCom from '@/pages/Manager/ClassManagement/components/WWOpenDataCom';

const Home = () => {
  const { currentUserInfo } = useContext(myContext);
  const userRef = useRef(null);
  const [notification, setNotification] = useState<any[]>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
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
      const res = await getXXTZGG({
        ZT: ['已发布'],
        XXJBSJId: currentUser?.xxId,
        page: 0,
        pageSize: 0,
      });
      if (res.status === 'ok') {
        if (!(res.data?.rows?.length === 0)) {
          setNotification(res.data?.rows);
        }
      } else {
        enHenceMsg(res.message);
      }
    }
    announcements();
  }, []);

  return (
    <div className={styles.indexPage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }} />
        <div className={styles.headerText}>
          <h4>
            <span ref={userRef}>
              {
                // <WWOpenDataCom
                //   style={{ color: '#666' }}
                //   type="userName"
                //   openid={currentUserInfo?.UserId}
                // />
                currentUser?.UserId
              }
            </span>
            老师，你好！
          </h4>
          <div>欢迎使用课后服务平台，课后服务选我就对了！ </div>
        </div>
      </header>
      <div className={styles.pageContent}>
        <div className={styles.noticeArea}>
          <IconFont type="icon-gonggao" className={styles.noticeImg} />
          <div className={styles.noticeText}>
            <span>学校公告</span>
            {notification && notification.length ? (
              <Link
                to={`/teacher/home/notice/announcement?listid=${notification[0].id}&index=all`}
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
              pathname: '/teacher/home/notice',
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
          <EnrollClassTime teacher={true} />
        </div>
        <div className={styles.teachCourses}>
          <TeachCourses />
        </div>
        <div className={styles.announceArea}>
          <Details data={notification} />
        </div>
      </div>
    </div>
  );
};

export default Home;

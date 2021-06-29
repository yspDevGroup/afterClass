import React, { useContext } from 'react';
import { Link } from 'umi';
import EmptyBGC from '@/assets/EmptyBGC.png';
import imgPop from '@/assets/mobileBg.png';
import IconFont from '@/components/CustomIcon';
import EnrollClassTime from '@/components/EnrollClassTime';
import myContext from '@/utils/MyContext';
import CourseTab from './components/CourseTab';
import styles from './index.less';
import Details from './Pages/Details';

const Home = () => {
  const { currentUserInfo, courseStatus } = useContext(myContext);
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
            <Link to="/parent/home/notice/details?listpage=page1">
              <span>本校户籍生现场材料审核公告</span>
            </Link>
          </div>
          <Link to="/parent/home/notice/details?listpage=page1">
            <IconFont type='icon-gengduo' className={styles.gengduo} />
          </Link>
        </div>
        <div className={styles.enrollArea}>
          <EnrollClassTime />
        </div>
        <div className={styles.courseArea}>
          <CourseTab />
        </div>
        <div className={styles.announceArea}>
        <Details />
        </div>
      </div>}
    </div>
  );
};

export default Home;

import React, { useContext } from 'react';
import { Link } from 'umi';
import imgPop from '@/assets/mobileBg.png';
import ListComp from '@/components/ListComponent';
import { noticData, } from '../listData';
import CourseTab from './components/CourseTab';
import styles from './index.less';
import IconFont from '@/components/CustomIcon';
import EnrollClassTime from '@/components/EnrollClassTime';
import myContext from '../myContext';

const Home = () => {
  const { currentUser } = useContext(myContext);
  return (
    <div className={styles.indexPage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}></div>
        <div className={styles.headerText}>
          <h4>
            <span>{currentUser?.subscriber_info?.remark || currentUser?.username || '家长'}</span>
            ，你好！
          </h4>
          <div>欢迎使用课后帮，课后服务选我就对了！ </div>
        </div>
      </header>
      <div className={styles.pageContent}>
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
          <EnrollClassTime  />
        </div>
        <div className={styles.courseArea}>
          <CourseTab />
        </div>
        <div className={styles.announceArea}>
          <ListComp listData={noticData} cls={styles.announceList} />
        </div>
      </div>
    </div>
  );
};

export default Home;

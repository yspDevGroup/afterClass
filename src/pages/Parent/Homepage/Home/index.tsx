import React, { useState } from 'react';
import { Link, useModel } from 'umi';
import imgPop from '@/assets/mobileBg.png';
import ListComp from '@/components/ListComponent';
import { noticData, currentData } from '../listData';
import CourseTab from './components/CourseTab';
import styles from './index.less';
import IconFont from '@/components/CustomIcon';

const Home = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [enroll] = useState<boolean>(true);

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
            <IconFont type='icon-gengduo'className={styles.gengduo} />
          </Link>
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
          <ListComp listData={noticData} cls={styles.announceList} />
        </div>
      </div>
    </div>
  );
};

export default Home;

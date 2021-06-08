import React from 'react';
import styles from './index.less';
import imgPop from '@/assets/mobileBg.png';
import imgNotice from '@/assets/notice.png';
import { RightOutlined } from '@ant-design/icons';
import ListComponent from '@/components/ListComponent';
import { listData } from './listData';
import CourseTab from './components/CourseTab';

const Home = () => {
  return <div className={styles.indexPage}>
    <header className={styles.cusHeader}>
      <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}>
      </div>
      <div className={styles.headerText}>
        <h4>某某，你好！</h4>
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
        <div className={styles.todayCourses}></div>
        <div className={styles.enrollText}>2021秋季课后服务课程报名开始了！</div>
        <div className={styles.enrollDate}>选课时间：2021.09.02 12:00—2021.09.05 18:00</div>
      </div>
      <div className={styles.courseArea}>
        <CourseTab />
      </div>
      <div className={styles.announceArea}>
        <ListComponent listData={listData} />
      </div>
    </div>
  </div>
};

export default Home;

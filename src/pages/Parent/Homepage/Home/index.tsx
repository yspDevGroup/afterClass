import React, { useEffect, useState } from 'react';
import styles from './index.less';
import imgPop from '@/assets/mobileBg.png';
import imgNotice from '@/assets/notice.png';
import { RightOutlined } from '@ant-design/icons';
import ListComponent from '@/components/ListComponent';
import { annoceData, currentData } from './listData';
import CourseTab from './components/CourseTab';

const Home = () => {
  const [enroll, setEnroll] = useState<boolean>(false);
  // TODO方便样式处理，每隔1分钟修改报名状态，后期删除
  useEffect(()=>{
    setInterval(()=>{
      setEnroll(!enroll);
    },10000);
  },[enroll])
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
        {enroll ? <>
          <div className={styles.enrollText}>2021秋季课后服务课程报名开始了！</div>
          <div className={styles.enrollDate}>选课时间：2021.09.02 12:00—2021.09.05 18:00</div>
        </> : <><div className={styles.todayCourses}>
          <ListComponent listData={currentData} />
        </div>
          <div className={styles.enrollText}>2021秋季课后服务课程报名已结束！</div></>}
      </div>
      <div className={styles.courseArea}>
        <CourseTab />
      </div>
      <div className={styles.announceArea}>
        <ListComponent listData={annoceData} />
      </div>
    </div>
  </div>
};

export default Home;

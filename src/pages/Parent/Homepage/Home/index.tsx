import React, { useContext } from 'react';
import { Link, useModel } from 'umi';
import imgPop from '@/assets/mobileBg.png';
import ListComp from '@/components/ListComponent';
import { noticData, currentData } from '../listData';
import CourseTab from './components/CourseTab';
import styles from './index.less';
import IconFont from '@/components/CustomIcon';
import myContext from '../myContext';
import EnrollClassTime from '@/components/EnrollClassTime';

const Home = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 获取首页数据
  const { courseStatus, } = useContext(myContext);
  console.log(courseStatus);

  const dataSourses = [
    {
      type: 'empty',
      listData: {
        type: 'descList',
        cls: 'descList',
        header: {
          title: '今日课程',
        },
        list: [
          {
            title: '初中部绘画艺术素描基础课',
            titleRight: {
              text: "待上课",
              color: "#45C977",
            },
            link: 'https://www.pgyer.com/',
            desc: [
              {
                left: ['15:50—16:50', '本校'],
                right: '2时43分后开课'
              },
            ],
          },
          {
            title: '初中部绘画艺术素描基础课',
            titleRight: {
              text: "已请假",
              color: "#999999",
            },
            link: 'https://www.pgyer.com/',
            desc: [
              {
                left: ['17:00—18:10', '本校'],
              },
            ],
          },
        ]
      }
    },
  ]
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
        <EnrollClassTime dataSourse={dataSourses} />
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

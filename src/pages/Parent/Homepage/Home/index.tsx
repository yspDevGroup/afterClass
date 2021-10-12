/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
import React, { useContext, useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
import imgPop from '@/assets/mobileBg.png';
import IconFont from '@/components/CustomIcon';
import EnrollClassTime from '@/components/EnrollClassTime';
import myContext from '@/utils/MyContext';
import CourseTab from './components/CourseTab';
import styles from './index.less';
import Details from './Pages/Details';
import EmptyArticle from './Pages/EmptyArticle';
import { enHenceMsg } from '@/utils/utils';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import bannerIcon from '@/assets/szjyzyIcon.png';
import resourcesRgo from '@/assets/resourcesRgo.png';
import resourcesBg from '@/assets/resourcesBg.png';
import Catering from '@/assets/Catering.png';
import resources from '@/assets/resources.png';

const Home = () => {
  const { currentUserInfo, courseStatus } = useContext(myContext);
  const [notification, setNotification] = useState<any>([]);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const {external_contact} = currentUser;
  const [ParentalIdentity, setParentalIdentity] = useState<string>('家长');
  useEffect(() => {

    async function announcements() {
      const res = await getXXTZGG({
        XXJBSJId: currentUserInfo?.xxId,
        BT: '',
        LX:['0'],
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
  const Storage = localStorage.getItem('studentName');
  useEffect(() => {
    localStorage.setItem('studentName',currentUser?.student?.[0].name)
    localStorage.setItem('studentId',currentUser?.student?.[0].student_userid)
  }, [])
  useEffect(() => {
    const ParentalIdentitys = `${localStorage.getItem('studentName')}${external_contact && external_contact?.subscriber_info?.remark?.split('-')[1]}` || '';
      setParentalIdentity(ParentalIdentitys)
  }, [Storage])
  return (
    <div className={styles.indexPage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}></div>
        <div className={styles.headerText}>
          <h4>
            <span>
              {/* {currentUserInfo?.external_contact?.subscriber_info.remark ||
                currentUserInfo?.username ||
                '家长'} */}
               {ParentalIdentity || '家长'}
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
          {/* <a
            className={styles.banner}
            href="http://moodle.xianyunshipei.com/course/view.php?id=12"
            target="_blank"
            rel="noreferrer"
          >
            <span>素质教育资源{` >`}</span>
            <img src={bannerIcon} />
          </a> */}
          {/* <div className={styles.resourcesBox}>
         <a
            href="http://moodle.xianyunshipei.com/course/view.php?id=12"
            target="_blank"
            rel="noreferrer"
            className={styles.resources}
            style={{ backgroundImage:`url(${resourcesBg})` }}
          >
              <p>素质教育资源</p>
              <img src={resourcesRgo} alt="" />
            </a>
        </div> */}
          <div className={styles.container}>
            {/* <Link to='/parent/home/serviceReservation' className={styles.Catering} >
              <p>服务预定</p>
              <img src={Catering} alt="" className={styles.CateringImg}/>
            </Link> */}
            <Link to='/parent/home/service' className={styles.Catering} >
              <p>服务预定</p>
              <img src={Catering} alt="" className={styles.CateringImg}/>
            </Link>
            <a
            href="http://moodle.xianyunshipei.com/course/view.php?id=12"
            target="_blank"
            rel="noreferrer"
             className={styles.resources}>
              <p>素质教育资源</p>
              <img src={resources} alt=""/>
            </a>
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

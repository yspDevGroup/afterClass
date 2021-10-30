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
import Catering from '@/assets/Catering.png';
import resources from '@/assets/resources.png';
import { ParentHomeData } from '@/services/local-services/mobileHome';

const Home = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student,external_contact } = currentUser || {};
  const [notification, setNotification] = useState<any>([]);
  const [totalData, setTotalData] = useState<any>({});
  const [ParentalIdentity, setParentalIdentity] = useState<string>('家长');
  const StorageXSId = localStorage.getItem('studentId') || (student && student[0].XSJBSJId) || testStudentId;
  const StorageNjId = localStorage.getItem('studentNjId') || (student && student[0].NJSJId);
  const StorageXSName = localStorage.getItem('studentName');
  useEffect(() => {
    async function announcements() {
      const res = await getXXTZGG({
        XXJBSJId: currentUser?.xxId,
        BT: '',
        LX: ['0'],
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
    if (localStorage.getItem('studentName') === null && localStorage.getItem('studentId') === null) {
      localStorage.setItem('studentName', currentUser?.student?.[0].name || '');
      localStorage.setItem('studentId', currentUser?.student?.[0].XSJBSJId || '');
    }
  }, [currentUser]);
  useEffect(() => {
    const ParentalIdentitys = `${StorageXSName}${(external_contact && external_contact?.subscriber_info?.remark?.split('-')[1]) || ''
      }`;
    setParentalIdentity(ParentalIdentitys);
  }, [StorageXSName]);

  useEffect(() => {
    (async () => {
      if(StorageXSId){
        const oriData = await ParentHomeData('student', currentUser?.xxId, StorageXSId, StorageNjId);
        const { data } = oriData;
        setTotalData(data);
      }
    })()
  }, [StorageXSId]);
  return (
    <div className={styles.indexPage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}></div>
        <div className={styles.headerText}>
          <h4>
            <span>
              {ParentalIdentity || '家长'}
            </span>
            ，你好！
          </h4>
          <div>欢迎使用课后服务平台，课后服务选我就对了！ </div>
        </div>
      </header>
      {totalData?.courseStatus === 'empty' ? (
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
            <EnrollClassTime type='student' xxId={currentUser.xxId} userId={StorageXSId} njId={StorageNjId} />
          </div>
          <div className={styles.courseArea}>
            <CourseTab dataResource={totalData} />
          </div>
          <div className={styles.container}>
            <Link to="/parent/home/serviceReservation" className={styles.Catering}>
              <p>更多服务</p>
              <img src={Catering} alt="" className={styles.CateringImg} />
            </Link>
            <a
              href="http://moodle.xianyunshipei.com/course/view.php?id=12"
              target="_blank"
              rel="noreferrer"
              className={styles.resources}
            >
              <p>素质教育资源</p>
              <img src={resources} alt="" />
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

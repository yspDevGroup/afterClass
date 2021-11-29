/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
import React, { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
import imgPop from '@/assets/mobileBg.png';
import IconFont from '@/components/CustomIcon';
import EnrollClassTime from '@/components/EnrollClassTime';
import CourseTab from './components/CourseTab';
import styles from './index.less';
import Details from './Pages/Details';
import EmptyArticle from './Pages/EmptyArticle';
import { enHenceMsg } from '@/utils/utils';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import { ParentHomeData } from '@/services/local-services/mobileHome';
import Selected from './components/Selected';
import JiaoYu from '@/assets/jiaoyuziyuan.png'
import { RightOutlined } from '@ant-design/icons';
import { getBJSJ } from '@/services/after-class/bjsj';

const Home = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student, external_contact } = currentUser || {};
  const [notification, setNotification] = useState<any>([]);
  const [totalData, setTotalData] = useState<any>({});
  const [ParentalIdentity, setParentalIdentity] = useState<string>('家长');
  const StorageXSId = localStorage.getItem('studentId') || (student && student[0].XSJBSJId) || testStudentId;
  const StorageNjId = localStorage.getItem('studentNjId') || (student && student[0].NJSJId) || testStudentNJId;
  const StorageXSName = localStorage.getItem('studentName');
  const [BJMC, setBJMC] = useState<any>();
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
    const identity = external_contact?.subscriber_info?.remark?.split('/')?.[0].split('-')[1]
    const ParentalIdentitys = `${StorageXSName}${identity || ''}`;
    setParentalIdentity(ParentalIdentitys);
  }, [StorageXSName]);

  useEffect(() => {
    (async () => {
      if (StorageXSId) {
        const bjId = localStorage.getItem('studentBJId') || currentUser?.student?.[0].BJSJId || testStudentBJId;
        const oriData = await ParentHomeData('student', currentUser?.xxId, StorageXSId, StorageNjId, bjId);
        const { data } = oriData;
        setTotalData(data);
      }
      const res = await getBJSJ({
        id: localStorage.getItem('studentBJId') || currentUser?.student?.[0].BJSJId
      })
      if (res.status === 'ok') {
        setBJMC(`${res.data?.NJSJ?.XD}${res.data?.NJSJ?.NJMC}${res.data?.BJ}`)
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
          <div>欢迎使用课后服务平台，课后服务选我就对了！</div>
          <div className={styles.NjBj}>
            <div>{currentUser?.QYMC}</div>
            <div>{BJMC || ''}</div>
          </div>
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
          <div className={styles.courseArea}>
            <Selected dataResource={totalData} />
          </div>
          {/* <div className={styles.container}>
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
          </div> */}
          <a
            className={styles.containers}
            style={{ backgroundImage: `url(${JiaoYu})` }}
            href="http://moodle.xianyunshipei.com/course/view.php?id=12"
          >
            <span>素质教育资源<RightOutlined /></span>

          </a>
          <div className={styles.announceArea}>
            <Details data={notification} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

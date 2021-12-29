/* eslint-disable prefer-spread */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
import React, { useEffect, useRef, useState } from 'react';
import { Link, useModel, history } from 'umi';
import index_header from '@/assets/index_header.png';
import notice_icon from '@/assets/notice_icon.png';
import AfterClass_icon from '@/assets/AfterClass_icon.png';
import Classroom_icon from '@/assets/Classroom_icon.png';
import trusteeship_icon from '@/assets/trusteeship_icon.png';
import remind from '@/assets/remind.png';
import styles from './index.less';
import Details from './Pages/Details';
import EmptyArticle from './Pages/EmptyArticle';
import { enHenceMsg } from '@/utils/utils';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import { ParentHomeData } from '@/services/local-services/mobileHome';
import Selected from './components/Selected';
import { getBJSJ } from '@/services/after-class/bjsj';
import { studentTodo } from '@/services/after-class/xsjbsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import moment from 'moment';
import { getStudentListByBjid } from '@/services/after-class/khfwbj';
import { createKHXSDD } from '@/services/after-class/khxsdd';


const Home = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student, external_contact } = currentUser || {};
  const [notification, setNotification] = useState<any>([]);
  const [totalData, setTotalData] = useState<any>({});
  const [ParentalIdentity, setParentalIdentity] = useState<string>('家长');
  const StorageXSId = localStorage.getItem('studentId') || (student && student[0].XSJBSJId) || testStudentId;
  const StorageNjId = localStorage.getItem('studentNjId') || (student && student[0].NJSJId) || testStudentNJId;
  const StorageBjId = localStorage.getItem('studentBJId') || currentUser?.student?.[0].BJSJId || testStudentBJId;
  const StorageXQSJId = localStorage.getItem('studentXQSJId') || currentUser?.student?.[0].XQSJId || testStudentXQSJId;
  const StorageXSName = localStorage.getItem('studentName');
  // 待办事项
  const [Backlog, setBacklog] = useState<any>([]);
  const [BacklogNum, setBacklogNum] = useState<number>(2);
  const [BaoMinData, setBaoMinData] = useState<any>();
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [orderInfo, setOrderInfo] = useState<any>();
  const [FWBData, setFWBData] = useState<any>();

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
        const res = await getStudentListByBjid({
          BJSJId: StorageBjId,
          XSJBSJId: StorageXSId,
          page: 0,
          pageSize: 0
        })
        if (res.status === 'ok') {
          setBaoMinData(res.data.rows[0])
        }
      }
    })()
  }, [StorageXSId]);
  useEffect(() => {
    (async () => {
      if (StorageXSId) {
        const oriData = await ParentHomeData('student', currentUser?.xxId, StorageXSId, StorageNjId, StorageBjId, StorageXQSJId);
        const { data } = oriData;
        setTotalData(data);
      }
      const res = await getBJSJ({
        id: localStorage.getItem('studentBJId') || currentUser?.student?.[0].BJSJId
      })
      if (res.status === 'ok') {
        setBJMC(`${res.data?.NJSJ?.XD}${res.data?.NJSJ?.NJMC}${res.data?.BJ}`)
      }
      // 获取待办事项
      const resXNXQ = await queryXNXQList(currentUser?.xxId);
      const result = await studentTodo({
        XSJBSJId: StorageXSId,
        XNXQId: resXNXQ?.current?.id || '',
      })
      if (result.status === 'ok') {
        const newArr: any[] = [];
        newArr.push.apply(newArr, result.data.fwbToPay);
        newArr.push.apply(newArr, result.data.fwbToSign);
        newArr.push.apply(newArr, result.data.kcbToPay);
        setBacklog(newArr)
      }
    })()
  }, [StorageXSId]);
  useEffect(() => {
    if (orderInfo) linkRef.current?.click();
  }, [orderInfo]);

  console.log(BaoMinData, 'BaoMinData')
  // 付款
  const submit = async (value: any) => {
    setFWBData(value)
    const data: API.CreateKHXSDD = {
      XDSJ: new Date().toISOString(),
      ZFFS: '线上支付',
      DDZT: '待付款',
      DDFY: Number(value?.FWFY),
      XSJBSJId: localStorage.getItem('studentId') || currentUser?.student?.[0]?.XSJBSJId || testStudentId,
      DDLX: 2,
      XSFWBJId: BaoMinData?.XSFWBJs.find((item: any) => item.KHFWSJPZId === value.XSFWBJs?.[0]?.KHFWSJPZ.id).id,
    };
    const res = await createKHXSDD(data);
    if (res.status === 'ok') {
      setOrderInfo(res.data);
    } else {
      enHenceMsg(res.message);
    }
  };
  return (
    <div className={styles.indexPage}>
      <header className={styles.cusHeader} style={{ backgroundImage: `url(${index_header})` }}>
        {/* <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}></div> */}
        <div className={styles.headerText}>
          <h4>
            <span>
              {ParentalIdentity || '家长'}
            </span>
            ，你好！
          </h4>
          <div className={styles.NjBj}>
            <div>{currentUser?.QYMC || ''}</div>
            <div>{BJMC || ''}</div>
          </div>
        </div>
      </header>
      {totalData?.courseStatus === 'empty' ? (
        <EmptyArticle />
      ) : (
        <div className={styles.pageContent}>
          <div className={styles.noticeArea}>
            <img src={notice_icon} alt="" />
            <i>通知：</i>
            <div className={styles.noticeText}>
              {notification && notification.length ? (
                <Link
                  to={`/parent/home/notice/announcement?listid=${notification[0].id}`}
                  style={{
                    color: '#666',
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

            {/* <Link
              to={{
                pathname: '/parent/home/notice',
                state: {
                  notification,
                },
              }}
            >
              {' '}
              <IconFont type="icon-gengduo" className={styles.gengduo} />
            </Link> */}
          </div>
          {/* 图标栏 */}
          <div className={styles.iconBox}>
            <Link
              to={{
                pathname: BaoMinData && BaoMinData?.XSFWBJs?.length === 0 ? '/parent/home/afterClassCoach' : '/parent/home/afterClassCoach/interestClassroom',
                state: { BJMC, ParentalIdentity },
              }}
            >
              <div className={styles.icons}>
                <img src={AfterClass_icon} alt="" />
              </div>
              <span>课后服务</span>
            </Link>
            <Link
              to={{
                pathname: '/parent/home/trusteeship',
              }}
            >
              <div className={styles.icons}>
                <img src={trusteeship_icon} alt="" />
              </div>
              <span>订餐&托管</span>
            </Link>
            <Link
              to={{
                pathname: '/parent/home/course',
                state: { totalData },
              }}
            >
              <div className={styles.icons}>
                <img src={Classroom_icon} alt="" />
              </div>
              <span>缤纷课堂</span>
            </Link>
          </div>

          {/* 温馨提示 */}
          {
            Backlog && Backlog.length !== 0 ?
              <div className={styles.Tips}>
                <div className={styles.title}>
                  <div></div>
                  <span>温馨提示</span>
                </div>
                {
                  Backlog && Backlog?.map((value: any, index: number) => {
                    if (index < BacklogNum) {
                      if (value?.FWFY) {
                        return <div
                          className={styles.wrap}
                          style={{ backgroundImage: `url(${remind})` }}
                          onClick={() => { submit(value) }}
                        >
                          <i style={{ color: '#15B628' }}>缴费提醒</i> 您于{moment(value?.createdAt).format("YYYY年MM月DD日")}报的{value?.FWMC}还未缴费，请及时处理。
                        </div>
                      } else if (value?.XSFWKHBJs) {
                        return <div
                          className={styles.wrap}
                          style={{ backgroundImage: `url(${remind})` }}
                          onClick={() => {
                            history.push('/parent/home/afterClassCoach/interestClassroom')
                          }}>
                          <i style={{ color: '#FC7F2B' }}>选课提醒</i> 您于{moment(value?.createdAt).format("YYYY年MM月DD日")}报的{value?.KHFWBJ?.FWMC}还未选课，请及时处理。
                        </div>
                      }
                      return <div
                        className={styles.wrap}
                        style={{ backgroundImage: `url(${remind})` }}
                        onClick={() => {
                          history.push(`/parent/home/courseIntro?classid=${value.id}&index=all`)
                        }}>
                        <i style={{ color: '#15B628' }}>缴费提醒</i> 您于{moment(value?.createdAt).format("YYYY年MM月DD日")}报的{value?.BJMC}还未缴费，请及时处理。
                      </div>
                    }
                    return <></>
                  })
                }

                {
                  Backlog?.length > 2 && BacklogNum === 2 ? <p onClick={() => {
                    setBacklogNum(999)
                  }}>查看全部</p> : <></>
                }
                {
                  Backlog?.length > 2 && BacklogNum === 999 ? <p onClick={() => {
                    setBacklogNum(2)
                  }}>收起</p> : <></>
                }
              </div> : <></>
          }

{/* 
          <div className={styles.enrollArea}>
            <EnrollClassTime type='student' xxId={currentUser.xxId} userId={StorageXSId} njId={StorageNjId} bjId={StorageBjId} XQSJId={StorageXQSJId} />
          </div>
          <div className={styles.courseArea}>
            <CourseTab dataResource={totalData} />
          </div>
          <div className={styles.courseArea}>
            <Selected dataResource={totalData} />
          </div> */}



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



          {/* <a
            className={styles.containers}
            style={{ backgroundImage: `url(${JiaoYu})` }}
            href="http://moodle.xianyunshipei.com/course/view.php?id=12"
          >
            <span>素质教育资源<RightOutlined /></span>

          </a> */}
          <div className={styles.announceArea}>
            <Details data={notification} />
          </div>
          <Link
            style={{ visibility: 'hidden' }}
            ref={linkRef}
            to={{
              pathname: '/parent/mine/orderDetails',
              state: {
                title: FWBData?.FWMC,
                detail: '',
                payOrder: orderInfo,
                user: currentUser,
                KKRQ: '',
                JKRQ: '',
                fwdetail: {
                  ...FWBData,
                  JSRQ: FWBData?.XSFWBJs?.[0]?.KHFWSJPZ.JSRQ,
                  KSRQ: FWBData?.XSFWBJs?.[0]?.KHFWSJPZ.KSRQ,
                },
                type: '服务班',
              },
            }}></Link>
        </div>
      )}
    </div>
  );
};

export default Home;

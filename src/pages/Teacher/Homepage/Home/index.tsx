import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useModel, Link, useAccess } from 'umi';
import { Badge, Button, Divider, Form, Input, message, Modal } from 'antd';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import { enHenceMsg, getCrpUrl } from '@/utils/utils';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import { getScheduleByDate } from '@/services/after-class/khxksj';
import { updateJZGJBSJ } from '@/services/after-class/jzgjbsj';
import { getAllKHJSTDK } from '@/services/after-class/khjstdk';
import ShowName from '@/components/ShowName';
import TeachCourses from './components/TeachCourses';
import EnrollClassTime from '@/components/EnrollClassTime';
import Details from './Pages/Details';
import imgPop from '@/assets/teacherBg.png';
import TeacherToDo from '@/assets/TeacherToDo.png';
import banner from '@/assets/banner1.png';
import { ParentHomeData } from '@/services/local-services/mobileHome';
import { RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import crpLogo from '@/assets/crp_logo.png';
import styles from './index.less';
import { getJYJGTZGG } from '@/services/after-class/jyjgtzgg';
import { queryXNXQList } from '@/services/local-services/xnxq';
import SwitchIdentity from '@/components/RightContent/SwitchIdentity';

const Home = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const userRef = useRef(null);
  const formRef = React.createRef<any>();
  const [notification, setNotification] = useState<any[]>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalData, setTotalData] = useState<any>({});
  const [BacklogNum, setBacklogNum] = useState<number>(2);
  const [crpUrl, setCrpUrl] = useState(''); // 课程资源平台链接
  // 巡课中课程安排数据
  const [dateData, setDateData] = useState<any>([]);
  const [DkData, setDkData] = useState<any>([]);
  const [policyData, setPolicyData] = useState<any>();
  //
  const { isSso, isWechat } = useAccess();

  const today = dayjs().format('YYYY/MM/DD');
  const getTodayData = async (day: string) => {
    const result = await queryXNXQList(currentUser?.xxId);
    const res = await getScheduleByDate({
      JZGJBSJId: currentUser?.JSId || testTeacherId,
      RQ: day,
      XNXQId: result?.current?.id,
      XXJBSJId: currentUser?.xxId,
    });
    if (res.status === 'ok' && res.data) {
      const { flag, rows } = res.data;
      if (flag) {
        setDateData(rows?.filter((it: any) => it.SFXK !== 2));
      } else {
        setDateData([]);
      }
    }
  };

  // 调代课申请
  const getTDKData = async () => {
    const res = await getAllKHJSTDK({
      LX: [1, 2],
      ZT: [0],
      XXJBSJId: currentUser?.xxId,
      DKJSId: currentUser?.JSId || testTeacherId,
    });
    if (res.status === 'ok') {
      setDkData(res.data?.rows);
    } else {
      setDkData([]);
    }
  };

  // 校内通知
  const getAnnoceData = async () => {
    const res = await getXXTZGG({
      ZT: ['已发布'],
      XXJBSJId: currentUser?.xxId,
      LX: ['0'],
      page: 0,
      pageSize: 0,
    });
    if (res.status === 'ok') {
      if (!(res.data?.rows?.length === 0)) {
        setNotification(res.data?.rows);
      }
    } else {
      enHenceMsg(res.message);
    }
  };
  // 政策公告
  const getPolicyData = async () => {
    const resgetXXTZGG = await getJYJGTZGG({
      BT: '',
      LX: 1,
      ZT: ['已发布'],
      XZQHM: currentUser?.XZQHM,
      page: 1,
      pageSize: 3,
    });
    if (resgetXXTZGG.status === 'ok') {
      setPolicyData(resgetXXTZGG.data?.rows);
    }
  };
  useEffect(() => {
    const authType: AuthType = (localStorage.getItem('authType') as AuthType) || 'local';
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      if (await initWXAgentConfig(['checkJsApi'])) {
        showUserName(userRef?.current, currentUser?.UserId);
        // 注意: 只有 agentConfig 成功回调后，WWOpenData 才会注入到 window 对象上面
        WWOpenData?.bindAll(document.querySelectorAll('ww-open-data'));
      }
    })();

    if ((authType === 'wechat' && !currentUser?.XM) || currentUser?.XM === '未知') {
      setIsModalVisible(true);
    }
    getTodayData(today);
    getTDKData();
    getAnnoceData();
    getPolicyData();
  }, [currentUser]);
  const getParentHomeData = async () => {
    const oriData = await ParentHomeData(
      'teacher',
      currentUser?.xxId,
      currentUser?.JSId || testTeacherId,
    );
    const { data } = oriData;
    setTotalData(data);
  };

  useEffect(() => {
    getParentHomeData();
  }, []);

  // 设置课程资源平台链接
  useEffect(() => {
    if (!initialState) return;
    // window.open('http://moodle.xianyunshipei.com/course/view.php?id=12');
    if (isSso) {
      setCrpUrl(getCrpUrl(initialState.buildOptions, 'password', '0'));
    }
    if (isWechat) {
      setCrpUrl(getCrpUrl(initialState.buildOptions, 'wechat', '0'));
    }
  }, [initialState]);

  const onFinish = async (values: { name: string; phone: string }) => {
    const res = await updateJZGJBSJ(
      { id: currentUser?.JSId },
      { XM: values.name, LXDH: values.phone },
    );
    if (res.status === 'ok') {
      message.success('提交成功');
      if (initialState) {
        const userInfo = await initialState.fetchUserInfo?.();
        setInitialState({ ...initialState, currentUser: userInfo });
      }
    } else {
      message.error('提交失败，请联系管理员');
    }
    setIsModalVisible(false);
  };

  return (
    <div className={styles.indexPage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }} />
        <div className={styles.headerText}>
          <h4>
            <div>
              <span ref={userRef}>
                <ShowName type="userName" openid={currentUser?.wechatUserId} XM={currentUser?.XM} />
              </span>
              <span>老师，你好！</span>
            </div>
            <span>
              <SwitchIdentity />
            </span>
          </h4>
          <div>{currentUser?.QYMC}</div>
        </div>
      </header>

      <div className={styles.pageContent}>
        {/* 学校公告 */}
        <div className={styles.noticeArea}>
          <div className={styles.noticeText}>
            {notification && notification.length ? (
              <>
                <Badge color="#FC7F2B" />
                <Link
                  to={`/teacher/home/notice/announcement?listid=${notification[0].id}&index=all`}
                  style={{
                    color: '#FC7F2B',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {notification[0].BT}
                </Link>
              </>
            ) : (
              '暂无公告'
            )}
          </div>
          {/* <Link
            to={{
              pathname: '/teacher/home/notice',
              state: {
                notification,
              },
            }}
          >
            {' '}
            <IconFont type="icon-gengduo" className={styles.gengduo} />
          </Link> */}
        </div>
        <div className={styles.banner} style={{ backgroundImage: `url(${banner})` }} />
        {DkData?.length === 0 ? (
          <></>
        ) : (
          <div className={styles.needToDo}>
            <div className={styles.title}>
              <div />
              <span>待办提醒</span>
            </div>
            {DkData &&
              DkData.map((value: any, index: number) => {
                if (index < BacklogNum) {
                  return (
                    <Link
                      to={{
                        pathname: '/teacher/education/courseAdjustment/details',
                        state: { id: value.id, type: 'edit' },
                      }}
                    >
                      <div
                        className={styles.wrap}
                        style={{ backgroundImage: `url(${TeacherToDo})` }}
                        // onClick={() => { submit(value) }}
                      >
                        {value?.LX === 1 ? (
                          <i style={{ color: '#15B628' }}>代课提醒</i>
                        ) : (
                          <i style={{ color: '#FC7F2B' }}>换课提醒</i>
                        )}
                        您的同事 <span>{value?.SKJS?.XM}老师</span> 于
                        {moment(value?.createdAt).format('YYYY年MM月DD日')}发起的{' '}
                        <span>{value?.KHBJSJ?.KHKCSJ?.KCMC}</span> 的
                        {value?.LX === 1 ? '代课' : '换课'}
                        申请，请及时处理。
                      </div>
                    </Link>
                  );
                }
                return '';
              })}

            {DkData?.length > 2 && DkData === 2 ? (
              <p
                onClick={() => {
                  setBacklogNum(999);
                }}
              >
                查看全部
              </p>
            ) : (
              <></>
            )}
            {DkData?.length > 2 && DkData === 999 ? (
              <p
                onClick={() => {
                  setBacklogNum(2);
                }}
              >
                收起
              </p>
            ) : (
              <></>
            )}
          </div>
        )}

        {/* 待巡课程 */}
        <div className={styles.patrolsBox}>
          <Link to="/teacher/patrolArrange">
            <p className={styles.titles}>
              <span>今日待巡课程</span>
              <Badge count={dateData?.length || 0} showZero={true} />
            </p>
            <div className={styles.xunke}>
              <p>去巡课</p>
              <RightOutlined
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '100%',
                  color: '#0066FF',
                  padding: '5px',
                }}
              />
            </div>
          </Link>
        </div>

        {/* 待巡课程 */}
        {/* <div className={styles.patrols} style={{ backgroundImage: `url(${PatrolClass})` }}>
          <div style={{ backgroundImage: `url(${DaiKe})` }}>
           <Link to="/teacher/home/substituteList">
          <p className={styles.titles}>
            <span>调代课申请</span>
            <Badge count={DkData?.length || 0} showZero={true} offset={[5, 0]} />
          </p>
        </Link>
          </div>
          <Link to="/teacher/patrolArrange">
            <p className={styles.titles}>
              <span>今日待巡课程</span>
              <Badge count={dateData?.length || 0} showZero={true} offset={[5, 0]} />
            </p>
            <div className={styles.xunke}>
              去巡课
              <div>
                <RightOutlined />
              </div>
            </div>
          </Link>
        </div> */}
        {/* 今日课程 */}
        <div className={styles.enrollArea}>
          <EnrollClassTime
            type="teacher"
            xxId={currentUser?.xxId}
            userId={currentUser?.JSId || testTeacherId}
          />
        </div>

        {/* 任教课程 */}
        <div className={styles.teachCourses}>
          <TeachCourses dataResource={totalData} />
        </div>

        {/* 素质教育资源 */}
        <div className={styles.resourcesBox}>
          <a
            // href="http://moodle.xianyunshipei.com/course/view.php?id=12"
            href={crpUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.resources}
          >
            <img src={crpLogo} alt="" />
          </a>
        </div>

        {/* 公示栏 */}
        <div className={styles.announceArea}>
          <Details data={notification} zcdata={policyData} />
        </div>
      </div>
      {/* 完善个人信息页面 */}
      <Modal
        className={styles.modalStyle}
        title="请激活您的账号"
        forceRender={true}
        visible={isModalVisible}
        centered={true}
        closable={false}
        cancelText="取消"
        okText="确认"
        footer={null}
      >
        <Form
          ref={formRef}
          labelCol={{ flex: '4em' }}
          wrapperCol={{ flex: 'auto' }}
          onFinish={onFinish}
        >
          <Form.Item
            style={{ marginTop: '12px' }}
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入您的真实姓名！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              {
                required: false,
                pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                message: '请输入您的手机号！',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Divider style={{ marginTop: 0 }} />
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Home;

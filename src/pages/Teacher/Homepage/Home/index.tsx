import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useModel, Link } from 'umi';
import { Badge, Button, Divider, Form, Input, message, Modal } from 'antd';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import { enHenceMsg } from '@/utils/utils';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import { getScheduleByDate } from '@/services/after-class/khxksj';
import { updateJZGJBSJ } from '@/services/after-class/jzgjbsj';
import { getAllKHJSTDK } from '@/services/after-class/khjstdk';

import WWOpenDataCom from '@/components/WWOpenDataCom';
import IconFont from '@/components/CustomIcon';
import TeachCourses from './components/TeachCourses';
import EnrollClassTime from '@/components/EnrollClassTime';
import Details from './Pages/Details';

import styles from './index.less';
import imgPop from '@/assets/teacherBg.png';
import resourcesBg from '@/assets/resourcesBg.png';
import resourcesRgo from '@/assets/resourcesRgo.png';
import XunKe from '@/assets/XunKe.png';
import DaiKe from '@/assets/DaiKe.png';
import { ParentHomeData } from '@/services/local-services/mobileHome';

const Home = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const userRef = useRef(null);
  const formRef = React.createRef<any>();
  const [notification, setNotification] = useState<any[]>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalData, setTotalData] = useState<any>({});
  // 巡课中课程安排数据
  const [dateData, setDateData] = useState<any>([]);
  const [DkData, setDkData] = useState<any>([]);
  const today = dayjs().format('YYYY/MM/DD');
  const getTodayData = async (day: string) => {
    const res = await getScheduleByDate({
      JZGJBSJId: currentUser.JSId || testTeacherId,
      RQ: day,
      WEEKDAY: new Date(day).getDay().toString(),
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
  const getTDKData = async () => {
    const res = await getAllKHJSTDK({
      LX: [1],
      ZT: [0],
      XXJBSJId: currentUser?.xxId,
      DKJSId: currentUser.JSId || testTeacherId,
    });
    if (res.status === 'ok') {
      setDkData(res.data?.rows);
    } else {
      setDkData([]);
    }
  };
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
  useEffect(() => {
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

    if (
      (initialState?.buildOptions?.authType === 'wechat' && !currentUser.XM) ||
      currentUser.XM === '未知'
    ) {
      setIsModalVisible(true);
    }
    getTodayData(today);
    getTDKData();
    getAnnoceData();
    //
  }, [currentUser]);
  const getParentHomeData = async () => {
    const oriData = await ParentHomeData(
      'teacher',
      currentUser?.xxId,
      currentUser.JSId || testTeacherId,
    );
    const { data } = oriData;
    setTotalData(data);
  };
  useEffect(() => {
    getParentHomeData();
  }, []);

  const onFinish = async (values: { name: string; phone: string }) => {
    const res = await updateJZGJBSJ(
      { id: currentUser.JSId },
      { XM: values.name, LXDH: values.phone },
    );
    if (res.status === 'ok') {
      message.success('提交成功');
      const userInfo = await initialState.fetchUserInfo?.();
      setInitialState({ ...initialState, currentUser: userInfo });
    } else {
      message.error('提交失败，请联系管理');
      console.warn(res.message);
    }
    setIsModalVisible(false);
  };

  return (
    <div className={styles.indexPage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }} />
        <div className={styles.headerText}>
          <h4>
            <span ref={userRef}>
              {currentUser?.UserId === '未知' && currentUser.wechatUserId ? (
                <WWOpenDataCom type="userName" openid={currentUser.wechatUserId} />
              ) : (
                currentUser?.UserId
              )}
            </span>
            老师，你好！
          </h4>
          <div>欢迎使用课后服务平台，课后服务选我就对了！ </div>
        </div>
      </header>
      <div className={styles.pageContent}>
        {/* 学校公告 */}
        <div className={styles.noticeArea}>
          <IconFont type="icon-gonggao" className={styles.noticeImg} />
          <div className={styles.noticeText}>
            <span>学校公告</span>
            {notification && notification.length ? (
              <Link
                to={`/teacher/home/notice/announcement?listid=${notification[0].id}&index=all`}
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
              pathname: '/teacher/home/notice',
              state: {
                notification,
              },
            }}
          >
            {' '}
            <IconFont type="icon-gengduo" className={styles.gengduo} />
          </Link>
        </div>
        {/* 今日课程 */}
        <div className={styles.enrollArea}>
          <EnrollClassTime
            type="teacher"
            xxId={currentUser.xxId}
            userId={currentUser.JSId || testTeacherId}
          />
        </div>
        {/* 代课与待巡课程 */}
        <div className={styles.patrols}>
          <div style={{ backgroundImage: `url(${DaiKe})` }}>
            <Link to="/teacher/home/substituteList">
              <p className={styles.titles}>
                <span>代课申请</span>
                <Badge count={DkData?.length || 0} showZero={true} offset={[5, 0]} />
              </p>
            </Link>
          </div>
          <div style={{ backgroundImage: `url(${XunKe})` }}>
            <Link to="/teacher/patrolArrange">
              <p className={styles.titles}>
                <span>今日待巡课程</span>
                <Badge count={dateData?.length || 0} showZero={true} offset={[5, 0]} />
              </p>
            </Link>
          </div>
        </div>
        {/* 任教课程 */}
        <div className={styles.teachCourses}>
          <TeachCourses dataResource={totalData} />
        </div>
        {/* 素质教育资源 */}
        <div className={styles.resourcesBox}>
          <a
            href="http://moodle.xianyunshipei.com/course/view.php?id=12"
            target="_blank"
            rel="noreferrer"
            className={styles.resources}
            style={{ backgroundImage: `url(${resourcesBg})` }}
          >
            <p>素质教育资源</p>
            <img src={resourcesRgo} alt="" />
          </a>
        </div>
        {/* 公示栏 */}
        <div className={styles.announceArea}>
          <Details data={notification} />
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

import React, { useEffect, useContext, useRef, useState } from 'react';
import dayjs from 'dayjs';
import imgPop from '@/assets/teacherBg.png';
import styles from './index.less';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import IconFont from '@/components/CustomIcon';
import EnrollClassTime from '@/components/EnrollClassTime';
import myContext from '@/utils/MyContext';
import TeachCourses from './components/TeachCourses';
import Details from './Pages/Details';
import { useModel, Link } from 'umi';
import { enHenceMsg } from '@/utils/utils';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import resourcesBg from '@/assets/resourcesBg.png';
import resourcesRgo from '@/assets/resourcesRgo.png';
import { getScheduleByDate } from '@/services/after-class/khxksj';
import { updateJZGJBSJ } from '@/services/after-class/jzgjbsj';
import { Badge, Button, Divider, Form, Input, message, Modal } from 'antd';

// import WWOpenDataCom from '@/pages/Manager/ClassManagement/components/WWOpenDataCom';

const Home = () => {
  const { currentUserInfo } = useContext(myContext);
  const userRef = useRef(null);
  const [notification, setNotification] = useState<any[]>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const formRef =  React.createRef<any>();

  const today = dayjs().format('YYYY/MM/DD');
  // 巡课中课程安排数据
  const [dateData, setDateData] = useState<any>([]);
  const getData = async (day: string) => {
    const res = await getScheduleByDate({
      JZGJBSJId: currentUser.JSId || '22520995-d6ee-4722-8f8a-f5352efac5a9',
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
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      if (await initWXAgentConfig(['checkJsApi'])) {
        showUserName(userRef?.current, currentUserInfo?.UserId);
        // 注意: 只有 agentConfig 成功回调后，WWOpenData 才会注入到 window 对象上面
        WWOpenData?.bindAll(document.querySelectorAll('ww-open-data'));
      }
    })();
    getData(today);
  }, [currentUserInfo]);

  useEffect(() => {
    async function announcements() {
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
    }
    announcements();
    if(currentUser.XM === '未知'){
      setIsModalVisible(true);
    }
  }, []);

  const onFinish = (values: any) => {
    formRef.current.validateFields()
      .then(async (values: any) => {
        console.log('values: ', values);
        const res = await  updateJZGJBSJ( {id : currentUser.JSId },{ XM: values.name , LXDH: values.phone });
        if(res.status === 'ok'){
          message.success('更新成功！');
        }else{
          message.error(res.message);
        }
        setIsModalVisible(false);
      })
      .catch((info: { errorFields: any; }) => {
        let error = info.errorFields
        console.log(error);
      });
  };


  return (
    <div className={styles.indexPage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }} />
        <div className={styles.headerText}>
          <h4>
            <span ref={userRef}>{currentUser?.UserId}</span>
            老师，你好！
          </h4>
          <div>欢迎使用课后服务平台，课后服务选我就对了！ </div>
        </div>
      </header>
      <div className={styles.pageContent}>
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
        <div className={styles.enrollArea}>
          <EnrollClassTime teacher={true} />
        </div>
        <div className={styles.patrol}>
          <span>
            今日待巡课程
            <Badge count={dateData?.length} showZero={true} offset={[5, 0]} />
          </span>
          <Link to="/teacher/patrolArrange">
            <span>去巡课</span>
            <IconFont type="icon-gengduo" className={styles.gengduo} />
          </Link>
        </div>
        <div className={styles.teachCourses}>
          <TeachCourses />
        </div>
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
        <div className={styles.announceArea}>
          <Details data={notification} />
        </div>
      </div>
      <Modal className={styles.modalStyle} title="首次使用，请完善您的个人信息"
      forceRender={true}
      visible={isModalVisible}
      centered={true}
      closable={false}
      cancelText='取消'
      okText='确认'
      footer={false}
      >
        <Form ref={formRef} labelCol={{flex: '4em'}} wrapperCol={{ flex: 'auto' }} onFinish={onFinish} >
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入您的真实姓名！' }]}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item
              name="phone"
              label="手机"
              rules={[{ required: true,  pattern: /^1[3|4|5|7|8][0-9]\d{8}$/ ,message: '请输入您的手机！' }]}
            >
              <Input></Input>
            </Form.Item>
            <Divider />
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{width: '100%'}}>
                提交
              </Button>
            </Form.Item>
          </Form>
      </Modal>
    </div>
  );
};

export default Home;

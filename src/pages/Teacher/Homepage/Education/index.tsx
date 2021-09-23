import { Modal, Button, message } from 'antd';
import React, { useContext, useState } from 'react';
import styles from './index.less';
import 'antd/es/modal/style';
import ClassCalendar from './ClassCalendar';
import { Link } from 'umi';
import icon_stuEvaluate from '@/assets/icon_stuEvaluate.png';
import icon_courseBack from '@/assets/icon_courseBack.png';
import myContext from '@/utils/MyContext';
import { msgLeaveSchool } from '@/services/after-class/wechat';

const Study = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { yxkc } = useContext(myContext);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    const res = await msgLeaveSchool({
      KHBJSJId: "2cd341bd-c719-43f0-bc53-b3aaaceaa759"
    });
    if (res.status === 'ok' && res.data) {
      message.success('通知已成功发送');
    }else{
      console.log('res: ', res);
    };
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div className={styles.studyPage}>
      <div className={styles.funWrapper}>
        <div className={styles.headBox}>
          <Link
            key="xxpj"
            to={{
              pathname: '/teacher/education/studentEvaluation',
              state: yxkc
            }}
            className={styles.stuEvaluat}>
            <p className={styles.stuEvaluatP1}>
              <p className={styles.stuEvaluatP2}>
                <img src={icon_stuEvaluate} alt="" />
              </p>
            </p>
            <p className={styles.stuEvaluatP3}>学生评价</p>
          </Link>
          <Link
            key="kcfk"
            to={{
              pathname: '/teacher/education/feedback',
              state: yxkc
            }}
            className={styles.courseBack}>
            <p className={styles.courseBackP1}>
              <p className={styles.courseBackP2}>
                <img src={icon_courseBack} alt="" />
              </p>
            </p>
            <p className={styles.courseBackP3}>课程反馈</p>
          </Link>
          <Button className={styles.leaveSchoolBtn} type="primary" onClick={showModal}>
              离校通知
          </Button>

        </div>
        <div className={styles.titleBar}>我的课表</div>
        <ClassCalendar />
      <Modal className={styles.leaveSchool} title="离校通知" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} centered={true} closable={false}>
        <p>今日课后服务课程已结束，您的孩子已离校，请知悉。</p>
      </Modal>
      </div>
    </div>
  );
};

export default Study;

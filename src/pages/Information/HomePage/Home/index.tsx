import { useModel, history } from 'umi';
import { Col, Row, Image, Avatar } from 'antd';
import { defUserImg } from '@/constant';
import Overview from './components/Overview';
import Notice from './components/Notice';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import IconFont from '@/components/CustomIcon';
import { removeOAuthToken, removeUserInfoCache } from '@/utils/utils';

import styles from './index.less';

const Home = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  return (
    <div className={styles.indexPage}>
      <div className={styles.topInfo}>
        <Row style={{ height: '74px' }} className={styles.teacherInfo}>
          <Col span={22}>
            <p>
              {currentUser?.UserId === '未知' && currentUser.wechatUserId ? (
                <WWOpenDataCom type="userName" openid={currentUser.wechatUserId} />
              ) : (
                currentUser?.UserId
              )}
              老师，您好！
            </p>
            <div>
              <Avatar
                size={18}
                style={{ height: 0 }}
                src={<Image src={currentUser?.avatar} fallback={defUserImg} />}
              />
              <span className={styles.school}>{currentUser?.QYMC ? currentUser?.QYMC : ''}</span>
            </div>
          </Col>
          <Col span={2}>
            <a
              onClick={() => {
                setInitialState({ ...initialState, currentUser: undefined });
                removeOAuthToken();
                removeUserInfoCache();
                history.replace(authType === 'wechat' ? '/auth_callback/overDue' : '/');
              }}
            >
              <IconFont type="icon-tuichu" className={styles.signOut} />
            </a>
          </Col>
        </Row>
      </div>
      <div className={styles.pageContent}>
        <div className={`${styles.noticeArea} ${styles[ENV_type]}`} />
        <Overview />
        <Notice />
      </div>
    </div>
  );
};

export default Home;

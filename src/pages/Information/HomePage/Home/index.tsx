import { useModel, history } from 'umi';
import { Col, Row } from 'antd';
// import { defUserImg } from '@/constant';
import Overview from './components/Overview';
import Notice from './components/Notice';
import IconFont from '@/components/CustomIcon';
import ShowName from '@/components/ShowName';
import { removeOAuthToken } from '@/utils/utils';
import TopBgImg from '@/assets/topInfoBG.png';
import SignIn from './components/SignIn';

import styles from './index.less';

const authType = localStorage.getItem('authType') || 'none';

const Home = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  return (
    <div className={styles.indexPage}>
      <div className={styles.topInfo} style={{ backgroundImage: `url(${TopBgImg})` }}>
        <Row style={{ height: '74px' }} className={styles.teacherInfo}>
          <Col span={22}>
            <p>
              <ShowName XM={currentUser?.XM} type="userName" openid={currentUser?.UserId} />
              老师，您好！
            </p>
            <div>
              {/* <Avatar
                size={18}
                style={{ height: 0 }}
                src={<Image src={currentUser?.avatar} fallback={defUserImg} />}
              /> */}
              <span className={styles.school}>{currentUser?.QYMC ? currentUser?.QYMC : ''}</span>
            </div>
          </Col>
          <Col span={2}>
            <a
              onClick={() => {
                setInitialState({ ...initialState!, currentUser: undefined });
                removeOAuthToken();
                history.replace(authType === 'wechat' ? '/auth_callback/overDue' : '/');
              }}
            >
              <IconFont type="icon-tuichu" className={styles.signOut} />
            </a>
          </Col>
        </Row>
      </div>
      <div className={styles.pageContent}>
        {/* <div
          className={`${styles.noticeArea} ${styles[initialState?.buildOptions.ENV_type || 'dev']}`}
        /> */}
        <Overview />
        <SignIn />
        <Notice />
      </div>
    </div>
  );
};

export default Home;

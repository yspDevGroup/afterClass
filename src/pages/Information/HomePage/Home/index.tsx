import { useModel } from 'umi';
import { Col, Row } from 'antd';
// import { defUserImg } from '@/constant';
import Overview from './components/Overview';
import Notice from './components/Notice';
import ShowName from '@/components/ShowName';
import TopBgImg from '@/assets/topInfoBG.png';
import SignIn from './components/SignIn';
import styles from './index.less';
import SwitchIdentity from '@/components/RightContent/SwitchIdentity';
import MobileCon from '@/components/MobileCon';
import { useEffect } from 'react';

const Home = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  useEffect(() => {
    localStorage.setItem('afterclass_role', 'admin');
  }, []);

  return (
    <MobileCon>
      <div className={styles.indexPage}>
        <div className={styles.topInfo} style={{ backgroundImage: `url(${TopBgImg})` }}>
          <Row
            style={{ height: '74px' }}
            align={'middle'}
            justify="space-between"
            className={styles.teacherInfo}
          >
            <Col flex="auth">
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
            <Col flex="none">
              {/* <a
              onClick={() => {
                setInitialState({ ...initialState!, currentUser: undefined });
                removeOAuthToken();
                history.replace(authType === 'wechat' ? '/auth_callback/overDue' : '/');
              }}
            >
              <IconFont type="icon-tuichu" className={styles.signOut} />
            </a> */}
              <SwitchIdentity logout={true} />
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
    </MobileCon>
  );
};

export default Home;

import React, { useEffect, useRef } from 'react';
import { Link, useModel, history } from 'umi';
import { Image } from 'antd';
import { defUserImg } from '@/constant';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import { removeOAuthToken, removeUserInfoCache } from '@/utils/utils';
import IconFont from '@/components/CustomIcon';
import ShowName from '@/components/ShowName';

import imgPop from '@/assets/teacherBg.png';
import CheckOnStatic from './components/CheckOnStatic';

import styles from './index.less';

const authType = localStorage.getItem('authType') || 'none';

const Mine = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const userRef = useRef(null);
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
  }, [currentUser]);

  return (
    <div className={styles.minePage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }} />
        <div className={styles.header}>
          <Image width={46} height={46} src={currentUser?.avatar} fallback={defUserImg} />
          <div className={styles.headerName}>
            <h4>
              <span ref={userRef}>
                <ShowName
                  type="userName"
                  openid={currentUser.wechatUserId}
                  XM={currentUser.UserId}
                />
              </span>
              <span>老师</span>
            </h4>
          </div>
        </div>
      </header>
      <CheckOnStatic />
      <div className={styles.linkWrapper}>
        <ul>
          <li>
            <IconFont type="icon-fuwugonggao" style={{ fontSize: '18px' }} />
            <Link to="/teacher/home/notice/announcement?articlepage=serveAnnounce">
              服务公告
              <IconFont type="icon-gengduo" />
            </Link>
          </li>
          <li>
            <IconFont type="icon-guanyu" style={{ fontSize: '18px' }} />
            <Link to="/teacher/home/notice/announcement?articlepage=about">
              关于
              <IconFont type="icon-gengduo" />
            </Link>
          </li>
        </ul>
        <div className={styles.signOut}>
          <a
            onClick={() => {
              setInitialState({ ...initialState!, currentUser: undefined });
              removeOAuthToken();
              removeUserInfoCache();
              history.replace(authType === 'wechat' ? '/auth_callback/overDue' : '/');
            }}
          >
            退出登录
          </a>
        </div>
      </div>
    </div>
  );
};

export default Mine;

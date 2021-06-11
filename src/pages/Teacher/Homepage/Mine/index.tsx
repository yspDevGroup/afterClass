import React, { useEffect, useRef } from 'react';
import { Link, useModel } from 'umi';
import { createFromIconfontCN } from '@ant-design/icons';
import styles from './index.less';
import imgPop from '@/assets/mobileBg.png';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import CheckOnChart from './components/CheckOnChart';

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_2600907_vq6xh8ec86m.js',
  ],
});
const Mine = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const userRef = useRef(null);
  // useEffect(() => {
  //   (async () => {
  //     if (/MicroMessenger/i.test(navigator.userAgent)) {
  //       await initWXConfig(['checkJsApi']);
  //     }
  //     await initWXAgentConfig(['checkJsApi']);
  //     showUserName(userRef?.current, currentUser?.userId);
  //     // 注意: 只有 agentConfig 成功回调后，WWOpenData 才会注入到 window 对象上面
  //     WWOpenData.bindAll(document.querySelectorAll('ww-open-data'));
  //   })();
  // }, [currentUser]);

  return (
    <div className={styles.minePage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}>
        </div>
        <div className={styles.header}>
          <img src={currentUser?.avatar} />
          <div className={styles.headerName}>
            <h4><span ref={userRef}></span>老师</h4>
            <span>微信名：{currentUser?.username}</span>
          </div>
        </div>
      </header>
      <div className={styles.funWrapper}>
        <div className={styles.titleBar}>考勤统计</div>
        <CheckOnChart />
      </div>
      <div className={styles.linkWrapper}>
        <ul>
          <li>
            <IconFont type='icon-dingdan' />
            <Link to='/'>
              我要反馈
              <IconFont type='icon-arrow' />
            </Link>
          </li>
          <li>
            <IconFont type='icon-dingdan' />
            <Link to='/'>
              服务公告
              <IconFont type='icon-arrow' />
            </Link>
          </li>
          <li>
            <IconFont type='icon-dingdan' />
            <Link to='/'>
              关于
              <IconFont type='icon-arrow' />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Mine;
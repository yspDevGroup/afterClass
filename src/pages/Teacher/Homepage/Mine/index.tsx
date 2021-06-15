import React, { useEffect, useRef } from 'react';
import { Link, useModel } from 'umi';
import styles from './index.less';
import imgPop from '@/assets/mobileBg.png';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import CheckOnChart from './components/CheckOnChart';
import { childData, childEvu, martialData, martialEvu } from './mock';
import IconFont from '@/components/CustomIcon';

const Mine = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const userRef = useRef(null);
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      if (await initWXAgentConfig(['checkJsApi'])) {
        showUserName(userRef?.current, currentUser?.userId);
        // 注意: 只有 agentConfig 成功回调后，WWOpenData 才会注入到 window 对象上面
        WWOpenData.bindAll(document.querySelectorAll('ww-open-data'));
      }
    })();
  }, [currentUser]);

  return (
    <div className={styles.minePage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}>
        </div>
        <div className={styles.header}>
          <img src={currentUser?.avatar} />
          <div className={styles.headerName}>
            <h4><span ref={userRef}></span>老师</h4>
          </div>
        </div>
      </header>
      <div className={styles.funWrapper}>
        <div className={styles.titleBar}>
          出勤统计
          <div>
            <span></span>正常
            <span></span>异常
            <span></span>待上
          </div>
        </div>
        <CheckOnChart data={childData} title='儿童体能训练' />
        <CheckOnChart data={martialData} title='专业武术培训' cls={styles.martialWrapper} />
      </div>
      <div className={styles.funWrapper}>
        <div className={styles.titleBar}>
          教学评价
          <div>
            好评率<a style={{ color: '#FF6600' }}>99.88%</a>
          </div>
        </div>
        <CheckOnChart data={childEvu} title='儿童体能训练' cls={styles.childEvuWrapper} />
        <CheckOnChart data={martialEvu} title='专业武术培训' cls={styles.martialEvuWrapper} />
      </div>
      <div className={styles.linkWrapper}>
        <ul>
          <li>
            <IconFont type='icon-woyaofankui' style={{'fontSize':'18px'}} />
            <Link to='/teacher/home'>
              我要反馈
              <IconFont type='icon-xiayiye' />
            </Link>
          </li>
          <li>
            <IconFont type='icon-fuwugonggao' style={{'fontSize':'18px'}} />
            <Link to='/teacher/home'>
              服务公告
              <IconFont type='icon-xiayiye' />
            </Link>
          </li>
          <li>
            <IconFont type='icon-guanyu' style={{'fontSize':'18px'}} />
            <Link to='/teacher/home'>
              关于
              <IconFont type='icon-xiayiye' />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Mine;
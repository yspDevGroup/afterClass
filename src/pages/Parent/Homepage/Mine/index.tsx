import React, { useContext } from 'react';
import { Link } from 'umi';
import DisplayColumn from '@/components/DisplayColumn';
import Statistical from './components/Statistical';
import styles from './index.less';
import imgPop from '@/assets/mobileBg.png';
import { iconTextData } from './mock';
import IconFont from '@/components/CustomIcon';
import myContext from '@/utils/MyContext';

const Mine = () => {
  const { currentUserInfo, courseStatus } = useContext(myContext);

  return (
    <div className={styles.minePage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}>
        </div>
        <div className={styles.header}>
          <img src={currentUserInfo?.avatar} />
          <div className={styles.headerName}>
            <h4>{currentUserInfo?.subscriber_info?.remark || currentUserInfo?.username || '家长'}</h4>
            <span>微信名：{currentUserInfo?.username}</span>
          </div>
        </div>
      </header>
      <div className={styles.payList}>
        <DisplayColumn
          type="icon"
          title="我的订单"
          isheader={true}
          grid={{ column: 4 }}
          dataSource={iconTextData}
          totil={true}
        />
      </div>
      {courseStatus === 'empty' ? '' : <Statistical />}
      <div className={styles.linkWrapper}>
        <ul>
          <li>
            <IconFont type='icon-lishikecheng' style={{ 'fontSize': '18px' }} />
            <Link to='/'>
              历史课程
              <IconFont type='icon-xiayiye' />
            </Link>
          </li>
          <li>
            <IconFont type='icon-woyaofankui' style={{ 'fontSize': '18px' }} />
            <Link to='/'>
              我要反馈
              <IconFont type='icon-xiayiye' />
            </Link>
          </li>
          <li>
            <IconFont type='icon-fuwugonggao' style={{ 'fontSize': '18px' }} />
            <Link to='/'>
              服务公告
              <IconFont type='icon-xiayiye' />
            </Link>
          </li>
          <li>
            <IconFont type='icon-guanyu' style={{ 'fontSize': '18px' }} />
            <Link to='/'>
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
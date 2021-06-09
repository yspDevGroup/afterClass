import React from 'react';
import { Link } from 'umi';
import DisplayColumn from '@/components/DisplayColumn';
import { createFromIconfontCN } from '@ant-design/icons';
import Statistical from './components/Statistical';
import styles from './index.less';
import imgPop from '@/assets/mobileBg.png';
import { iconTextData } from './mock';

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_2600907_vq6xh8ec86m.js',
  ],
});
const Mine = () => {

  return (
    <div className={styles.minePage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}>
        </div>
        <div className={styles.header}>
          <img src='https://i.postimg.cc/8CMXTy3V/2.jpg' />
          <div className={styles.headerName}>
            <h4>某某</h4>
            <span>微信名：cicleclxe</span>
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
        />
      </div>
      <Statistical />
      <div className={styles.linkWrapper}>
        <ul>
          <li>
            <IconFont type='icon-dingdan' />
            <Link to='/'>
              历史课程
              <IconFont type='icon-arrow' />
            </Link>
          </li>
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
import React, { useState, useContext, useEffect } from 'react';
import { message } from 'antd';
import { Link } from 'umi';
import DisplayColumn from '@/components/DisplayColumn';
import Statistical from './components/Statistical';
import IconFont from '@/components/CustomIcon';
import myContext from '@/utils/MyContext';
import { getAllKHXSDD } from '@/services/after-class/khxsdd';
import imgPop from '@/assets/mobileBg.png';
import styles from './index.less';
import { iconTextData } from './mock';

const Mine = () => {
  const { currentUserInfo, courseStatus, } = useContext(myContext);
  const [totail, setTotail] = useState<boolean>(false);
  useEffect(() => {
    const data = currentUserInfo?.subscriber_info?.children || [{
      student_userid: currentUserInfo?.UserId,
      njId: '1'
    }];
    async function fetch(children: any[]) {
      const res = await getAllKHXSDD({
        XSId: children[0].student_userid,
        njId: children[0].njId,
        DDZT: '待付款'
      });
      if (res.status === 'ok') {
        if (res.data && res.data.length) {
          setTotail(true);
        }
      } else {
        message.warning(res.message)
      }

    };
    fetch(data);
  }, []);

  return (
    <div className={styles.minePage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}>
        </div>
        <div className={styles.header}>
          {currentUserInfo?.avatar ? <img src={currentUserInfo?.avatar} /> : ''}
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
          totil={totail}
        />
      </div>
      {courseStatus === 'empty' ? '' : <Statistical />}
      <div className={styles.linkWrapper}>
        <ul>
          <li>
            <IconFont type='icon-fuwugonggao' style={{ 'fontSize': '18px', lineHeight: '40px' }} />
            <Link to='/parent/home/notice/announcement?articlepage=serveAnnounce'>
              服务公告
              <IconFont type="icon-gengduo" />
            </Link>
          </li>
          <li>
            <IconFont type='icon-guanyu' style={{ 'fontSize': '18px', lineHeight: '40px' }} />
            <Link to='/parent/home/notice/announcement?articlepage=about'>
              关于
              <IconFont type="icon-gengduo" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Mine;
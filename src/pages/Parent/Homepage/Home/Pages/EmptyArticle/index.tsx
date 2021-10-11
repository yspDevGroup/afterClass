import React, { useEffect, useState } from 'react';
import EmptyBGC from '@/assets/EmptyBGC.png';
import styles from './index.less';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { homePageInfo } from '@/services/after-class/user';
import { useModel } from 'umi';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import { Divider } from 'antd';

const EmptyArticle = () => {
  const [Datas, setDatas] = useState<any>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [notification, setNotification] = useState<any>([]);
  useEffect(() => {
    (async () => {
      const result = await queryXNXQList(currentUser?.xxId, undefined);
      if (result.current) {
        const { student } = currentUser || {};
        const res = await homePageInfo({
          XSId:localStorage.getItem('studentId') || (student && student[0].student_userid) || '20210901',
          XNXQId: result.current.id,
          XXJBSJId: currentUser!.xxId,
        });
        if (res.status === 'ok') {
          setDatas(res.data);
        }
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const res = await getXXTZGG({
        XXJBSJId: currentUser?.xxId,
        BT: '',
        LX: ['1'],
        ZT: ['已发布'],
        page: 0,
        pageSize: 0,
      });
      if (res.status === 'ok') {
        setNotification(res.data!.rows);
      }
    })();
  }, []);
  return (
    <div className={styles.EmptyPage}>
      {
        notification && notification.length === 0 ? <>
          <div className={styles.opacity} style={{ backgroundImage: `url(${EmptyBGC})` }} />
          <p className={styles.title}>课后服务报名暂未开始</p>
          {Datas?.bmkssj && Datas?.bmjssj ? (
            <div>
              <p className={styles.title} style={{ marginBottom: '5px' }}>
                请在 <span>{Datas?.bmkssj}~{Datas?.bmjssj}</span>
              </p>
              <p className={styles.title}>前来报名</p>
            </div>
          ) : (
            <></>
          )}
        </> :
          <div className={styles.notice}>
            {notification?.[0].BT ? <div className={styles.title}>{notification?.[0].BT}</div> : ''}
            {notification?.[0].RQ ? <div className={styles.time}>{notification?.[0].RQ}</div> : ''}
            <Divider />
            <div className={styles.box} style={{ backgroundImage: `url(${EmptyBGC})` }} />
            <div dangerouslySetInnerHTML={{ __html: notification?.[0].NR }} className={styles.contents}  />
          </div>
      }

    </div>
  );
};
export default EmptyArticle;

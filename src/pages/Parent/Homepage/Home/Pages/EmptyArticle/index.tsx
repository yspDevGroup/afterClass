import React, { useEffect, useState } from 'react';
import EmptyBGC from '@/assets/EmptyBGC.png';
import styles from './index.less';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { homePageInfo } from '@/services/after-class/user';
import { useModel } from 'umi';

const EmptyArticle = () => {
  const [Datas, setDatas] = useState<any>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  useEffect(() => {
    (async () => {
      const result = await queryXNXQList(currentUser?.xxId, undefined);
      if (result.current) {
        const { student } = currentUser || {};
        const res = await homePageInfo({
          XSId: student && student.student_userid,
          // XSId: '20210901',
          // njId: children && children[0].njId,
          XNXQId: result.current.id,
          XXJBSJId: currentUser!.xxId,
        });
        if (res.status === 'ok') {
          setDatas(res.data);
        }
      }
    })();
  }, []);
  return (
    <div className={styles.EmptyPage}>
      <div className={styles.opacity} style={{ backgroundImage: `url(${EmptyBGC})` }} />
      <p className={styles.title}>课后服务报名暂未开始</p>
      {Datas?.bmkssj && Datas?.bmkssj ? (
        <>
          <p className={styles.title} style={{ marginBottom: '5px' }}>
            请在{Datas?.bmkssj}—{Datas?.bmjssj}
          </p>
          <p className={styles.title}>前来报名</p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
export default EmptyArticle;

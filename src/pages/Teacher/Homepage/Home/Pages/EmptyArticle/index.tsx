import React, { useEffect, useState } from 'react';
import EmptyBGC from '@/assets/EmptyBGC.png';
import styles from './index.less';
import { getAllXXGG } from '@/services/after-class/xxgg';
import { Article } from './mock';
import { useModel } from 'umi';

const EmptyArticle = () => {
  const [content, setContent] = useState<any>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  useEffect(() => {
    async function announcements() {
      const res = await getAllXXGG({ status: ['已发布'], XXJBSJId: currentUser?.xxId });
      if (res.status === 'ok') {
        if (res.data && res.data.length) {
          setContent(res.data[0]);
        } else {
          setContent(Article);
        }
      }
    }
    announcements();
  }, []);
  return (
    <div className={styles.EmptyPage}>
      <div className={styles.header}>
        <div className={styles.title}>{content?.BT}</div>
        <div className={styles.time}>发布时间：{content?.updatedAt}</div>
      </div>
      <div className={styles.line} />
      <div className={styles.opacity} style={{ backgroundImage: `url(${EmptyBGC})` }} />
      <textarea disabled value={content?.NR} className={styles.imges} />
    </div>
  );
};
export default EmptyArticle;

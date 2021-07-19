import React, { useEffect, useState } from 'react';
import EmptyBGC from '@/assets/EmptyBGC.png';
import styles from "./index.less";
import { getAllXXGG } from '@/services/after-class/xxgg';

const EmptyArticle = () => {
  const [content, setContent] = useState<any>();
  useEffect(() => {
    async function announcements() {
      const res= await getAllXXGG({status:['报名通知']})
      if (res.status === 'ok') {
        setContent(res.data[0]);
      }
    };
    announcements()
  }, [])
  return (
    <div className={styles.EmptyPage}>
      <div className={styles.header}>
        <div className={styles.title}>{content?.BT}</div>
        <div className={styles.time}>发布时间：{content?.updatedAt}</div>
      </div>
      <div className={styles.line}></div>
      <div className={styles.opacity} style={{ backgroundImage: `url(${EmptyBGC})` }}>
      </div>
      <textarea disabled value={content?.NR} className={styles.imges} />
    </div>
  )
}
export default EmptyArticle;

import React, { useEffect, useState } from 'react';
import EmptyBGC from '@/assets/EmptyBGC.png';
import styles from "./index.less";
import { Article } from './mock';

const EmptyArticle = () => {
  const [content, setContent] = useState<any>();
  useEffect(() => {
    setContent(Article.empty);
  }, [])
  return (
    <div className={styles.EmptyPage}>
      <div className={styles.header}>
        <div className={styles.title}>{content?.title}</div>
        <div className={styles.time}>{content?.time}</div>
      </div>
      <div className={styles.line}></div>
      <div className={styles.opacity} style={{ backgroundImage: `url(${EmptyBGC})` }}>
      </div>
      <textarea disabled value={content?.text} className={styles.imges} />
    </div>
  )
}
export default EmptyArticle;

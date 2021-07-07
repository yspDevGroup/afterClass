import React, { useContext, useEffect, useState } from 'react';
import imgPop from '@/assets/mobileBg.png';
import EmptyBGC from '@/assets/EmptyBGC.png';
import styles from "./index.less";
import myContext from '@/utils/MyContext';
import { Article } from './mock'
import { getQueryString } from '@/utils/utils'

const EmptyArticle = () => {
  const { currentUserInfo } = useContext(myContext);
  const [content, setContent] = useState<any>();
  useEffect(() => {
    const pageId = getQueryString("articlepage");
    if (pageId) {
      setContent(Article[pageId]);
    }
  }, [])
  if (content) {
    return (
      <div className={styles.EmptyPage}>
        <header className={styles.cusHeader}>
          <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}></div>
          <div className={styles.headerText}>
            <h4>
              <span>{currentUserInfo?.subscriber_info?.remark || currentUserInfo?.username || '�ҳ�'}</span>
              ����ã�
            </h4>
            <div>��ӭʹ�ÿκ��κ����ѡ�ҾͶ��ˣ� </div>
          </div>
        </header>
        <div className={styles.cusContent}>
          <div className={styles.header}>
          <div className={styles.title}>{content.title}</div>
          <div className={styles.time}>{content.time}</div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.opacity}  style={{ backgroundImage: `url(${EmptyBGC})`}}>
          </div>
          <textarea disabled value={content.text} className={styles.imges}/>
        </div>
      </div>
    )
  }
  return ''
}
export default EmptyArticle;

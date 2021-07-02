import React, { useEffect, useState } from 'react'
import styles from "./index.less"
import { getQueryString } from '@/utils/utils'
import { getXXGG } from '@/services/after-class/xxgg';



const Announcement = () => {
  const [content, setContent] = useState<any>();
  useEffect(() => {
    const pageId = getQueryString("listid");
    console.log(pageId);
    async function announcements() {
        const res = await getXXGG({id:pageId!});
        if (res.status === 'ok' && res.data) {
            setContent(res.data);
        } else {
          
        };
      };
      announcements();
  }, [])
  if (content) {
    return (
      <div className={styles.DetailsBox}>
        <div className={styles.title}>{content.BT}</div>
        <div className={styles.time}>发布时间：{content.updatedAt}</div>
        <div className={styles.line}></div>
        <textarea className={styles.text} value={content.NR} style={{lineHeight:"22px",paddingTop:'10px ' }}>
        </textarea>
      </div>
    )
  }
  return ''
}

export default Announcement
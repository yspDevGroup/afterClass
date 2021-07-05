import React, { useEffect, useState } from 'react'
import styles from "./index.less"
import { getQueryString } from '@/utils/utils'
import { getXXGG } from '@/services/after-class/xxgg';



const Announcement = () => {
  const [content, setContent] = useState<any>();
  useEffect(() => {
    const pageId = getQueryString("listid");
    async function announcements() {
      const res = await getXXGG({ id: pageId! });
      if (res.status === 'ok' && !(res.data === [])) {
        setContent(res.data);
      }
    };
    announcements();
  }, [])
  if (content) {

    return (
      <div className={styles.DetailsBox}>
        <div className={styles.title}>{content.BT}</div>
        <div className={styles.time}>发布时间：{content.updatedAt}</div>
        <div className={styles.line}></div>
        <textarea className={styles.text} value={content.NR}>

        </textarea>
      </div>
    )
  }
  return ''
}

export default Announcement
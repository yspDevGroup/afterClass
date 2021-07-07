import React, { useEffect, useState } from 'react'
import styles from "./index.less"
import { getQueryString } from '@/utils/utils'
import { getXXGG } from '@/services/after-class/xxgg';
import { serveAnnounce, about } from './mock'


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
  const articlepage = getQueryString('articlepage');
  if (articlepage && articlepage === 'serveAnnounce') {
    return (
      <div className={styles.DetailsBox}>
        <div className={styles.title}>{serveAnnounce.title}</div>
        <div className={styles.time}>发布时间：{serveAnnounce.time}</div>
        <div className={styles.line}></div>
        <textarea className={styles.text} value={serveAnnounce.text}>
        </textarea>
      </div>)
  } else if (articlepage && articlepage === 'about') {
    return (
      <div className={styles.DetailsBox}>
        <div className={styles.title}>{about.title}</div>
        <div className={styles.time}>发布时间：{about.time}</div>
        <div className={styles.line}></div>
        <textarea className={styles.text} value={about.text}>
        </textarea>
      </div>)
  } else if (content) {
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
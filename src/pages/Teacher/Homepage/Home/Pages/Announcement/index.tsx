import React, { useEffect, useState } from 'react'
import styles from "./index.less"
import { getQueryString } from '@/utils/utils'
import { getXXGG } from '@/services/after-class/xxgg';
import { data } from './mock';
import GoBack from '@/components/GoBack';


const Announcement = () => {
  const [content, setContent] = useState<any>();
  const pageId = getQueryString("listid");
  const articlepage = getQueryString('articlepage');
  const index=getQueryString('index');
  useEffect(() => {
    async function announcements() {
      const res = await getXXGG({ id: pageId! });
      if (res.status === 'ok' && !(res.data === [])) {
        setContent(res.data);
      }
    };
    if (pageId) {
      announcements();
    }
    if (articlepage) {
      setContent(data[articlepage]);
    }
  }, []);
  return (
    <div className={styles.DetailsBox}>
      {pageId&&!index ? <GoBack title='公告' />:'' }
      {pageId&&index ? <GoBack title='公告' onclick='/teacher/home?index=index'/>:'' }
      {articlepage ? <GoBack title={articlepage === 'serveAnnounce' ? '服务公告' : '关于'} onclick='/teacher/home?index=mine' />:''}
      <div className={styles.title}>{content?.BT}</div>
      <div className={styles.time}>发布时间：{content?.updatedAt}</div>
      <div className={styles.line}></div>
      <textarea className={styles.text} value={content?.NR} readOnly>
      </textarea>
    </div>
  )
}

export default Announcement;
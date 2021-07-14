import React, { useEffect, useState } from 'react'
import styles from "./index.less"
import { enHenceMsg, getQueryString } from '@/utils/utils'
import { getXXGG } from '@/services/after-class/xxgg';
import { data } from './mock';
import GoBack from '@/components/GoBack';


const Announcement = () => {
  const [content, setContent] = useState<any>();
  const articlepage = getQueryString('articlepage');
  const pageId = getQueryString("listid");
  const index = getQueryString("index");
  useEffect(() => {
    async function announcements() {
      const res = await getXXGG({ id: pageId! });
      if (res.status === 'ok') {
        if(!(res.data === [])){
          setContent(res.data);
        }
      }else{
        enHenceMsg(res.message)
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
      {pageId ? <GoBack title='公告' onclick={index ? undefined:'/parent/home?index=index'} /> : ''}
      {articlepage ? <GoBack title={articlepage === 'serveAnnounce' ? '服务公告' : '关于'} onclick='/parent/home?index=mine' /> : ''}
      {content?.BT ? <div className={styles.title}>{content?.BT}</div> : ''}
      {content?.updatedAt ? <div className={styles.time}>发布时间：{content?.updatedAt}</div> : ''}
      {(content?.BT || content?.updatedAt) ? <div className={styles.line}></div> : ''}
      {articlepage === 'about' ?
        <div className={styles.guanyu}>
          <div  className={styles.tp}>
          <img src={content?.NR} alt='' style={{width:'120px'}}/>
          </div>
          <div className={styles.wz}>课后课程服务平台</div>
          <div className={styles.xb}>© 2021 版权所有：陕西凯锐信息技术有限公司 </div>
          <div className={styles.bbh}> v1.0.0</div>
        </div> :
        <textarea className={styles.text} value={content?.NR} readOnly>
        </textarea>}

    </div>
  )
}

export default Announcement;
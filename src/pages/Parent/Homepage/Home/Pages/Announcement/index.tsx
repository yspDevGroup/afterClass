import React, { useEffect, useState } from 'react';
import styles from "./index.less";
import { enHenceMsg, getQueryString } from '@/utils/utils';
import { getXXGG } from '@/services/after-class/xxgg';
import { data } from './mock';
import GoBack from '@/components/GoBack';
import imgPop from '@/assets/mobileBg.png';


const Announcement = () => {
  const [content, setContent] = useState<any>();
  const pageId = getQueryString("listid");
  const articlepage = getQueryString('articlepage');
  const index=getQueryString('index');
  useEffect(() => {
    async function announcements() {
      const res = await getXXGG({ id: pageId! });
      if (res.status === 'ok') {
        if(!(res.data === [])){
          setContent(res.data);
        }
      }else{
        enHenceMsg(res.message);
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
      {pageId ? <GoBack title='公告' onclick={index ? undefined : '/parent/home?index=index'} /> : ''}
      {articlepage ? <GoBack title={articlepage === 'serveAnnounce' ? '服务公告' : '关于'} onclick='/parent/home?index=mine' /> : ''}
      {content?.BT ? <div className={styles.title}>{content?.BT}</div> : ''}
      {content?.updatedAt ? <div className={styles.time}>发布时间：{content?.updatedAt}</div> : ''}
      {(content?.BT || content?.updatedAt) ? <div className={styles.line}></div> : ''}
      {articlepage === 'about' ?
        <div className={styles.guanyu}>
          <header className={styles.cusHeader}>
            <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}></div>
          </header>
          <div className={styles.tp}>
            <img src={content?.NR} alt='' />
          </div>
          <div className={styles.wz}>
            <h4>课后服务平台</h4>
            <p>课后服务平台是专为国内中小学生群体量身打造的一款课后教育类应用，立足于三点半难题，提供课后服务管理与监督功能。</p>
          </div>
          <div className={styles.xb}>
            <p>版本号：V1.0.0</p>
            <p>© 2021 版权所有：陕西凯锐信息技术有限公司 </p>
            </div>
        </div> :
        <textarea className={styles.text} value={content?.NR} readOnly>
        </textarea>}

    </div>
  )
}

export default Announcement;
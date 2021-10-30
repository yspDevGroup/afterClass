import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { enHenceMsg, getQueryString } from '@/utils/utils';
import GoBack from '@/components/GoBack';
import imgPop from '@/assets/mobileBg.png';
import { XXTZGG } from '@/services/after-class/xxtzgg';
import Footer from '@/components/Footer';
import { data } from './mock';
import styles from './index.less';

const Announcement = () => {
  const { initialState } = useModel('@@initialState');
  const [content, setContent] = useState<any>();
  const pageId = getQueryString('listid');
  const articlepage = getQueryString('articlepage');
  const index = getQueryString('index');
  useEffect(() => {
    async function announcements() {
      const res = await XXTZGG({ id: pageId! });
      if (res.status === 'ok') {
        if (!(res.data === [])) {
          setContent(res.data);
        }
      } else {
        enHenceMsg(res.message);
      }
    }
    if (pageId) {
      announcements();
    }
    if (articlepage) {
      setContent(data[articlepage]);
    }
  }, []);

  return (
    <div className={styles.DetailsBox}>
      {pageId ? (
        <GoBack
          title="公告详情"
          onclick={index ? undefined : '/teacher/home?index=index'}
          teacher
        />
      ) : (
        ''
      )}
      {articlepage ? (
        <GoBack
          title={articlepage === 'serveAnnounce' ? '服务公告' : '关于'}
          teacher
          onclick="/teacher/home?index=mine"
        />
      ) : (
        ''
      )}
      {content?.BT ? <div className={styles.title}>{content?.BT}</div> : ''}
      {content?.RQ ? <div className={styles.time}>发布时间：{content?.RQ}</div> : ''}
      {content?.BT || content?.updatedAt ? <div className={styles.line} /> : ''}
      {articlepage === 'about' ? (
        <div className={styles.guanyu}>
          <header className={styles.cusHeader}>
            <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }} />
          </header>
          <div className={styles.tp}>
            <img src={content?.NR} alt="" />
          </div>
          <div className={styles.wz}>
            <h4>课后服务平台</h4>
            <p>
              课后服务平台是专为国内中小学生群体量身打造的一款课后教育类应用，立足于三点半难题，提供课后服务管理与监督功能。
            </p>
          </div>
          <div className={styles.xb}>
            <Footer copyRight={initialState?.buildOptions.ENV_copyRight} />
          </div>
        </div>
      ) : (
        // <textarea className={styles.text} value={content?.NR} readOnly></textarea>
        <>
          <div dangerouslySetInnerHTML={{ __html: content?.NR }} className={styles.contents} />
          <div className={styles.xb}>
            <Footer copyRight={initialState?.buildOptions.ENV_copyRight} />
          </div>
        </>
      )}
    </div>
  );
};

export default Announcement;

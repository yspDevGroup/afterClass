import React, { useEffect, useRef, useState } from 'react';
import imgPop from '@/assets/teacherBg.png';
import EmptyBGC from '@/assets/EmptyBGC.png';
import styles from "./index.less";
import { Article } from './mock';
import { getQueryString } from '@/utils/utils';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import { useModel } from 'umi';

const EmptyArticle = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [content, setContent] = useState<any>();
  const userRef = useRef(null);

  useEffect(() => {
    const pageId = getQueryString("articlepage");
    if (pageId) {
      setContent(Article[pageId]);
    }
  }, []);
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      if (await initWXAgentConfig(['checkJsApi'])) {
        showUserName(userRef?.current, currentUser?.UserId);
        // 注意: 只有 agentConfig 成功回调后，WWOpenData 才会注入到 window 对象上面
        WWOpenData.bindAll(document.querySelectorAll('ww-open-data'));
      }
    })();
  }, [currentUser]);
  if (content) {
    return (
      <div className={styles.EmptyPage}>
        <header className={styles.cusHeader}>
          <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}></div>
          <div className={styles.headerText}>
            <h4>
              <span ref={userRef}>
                {currentUser?.username}
              </span>
              老师,您好！
            </h4>
            <div>欢迎使用课后帮，课后服务选我就对了！ </div>
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

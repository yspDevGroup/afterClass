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
        // ע��: ֻ�� agentConfig �ɹ��ص���WWOpenData �Ż�ע�뵽 window ��������
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
              ��ʦ,���ã�
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

/*
 * @description: 公告详情
 * @author: zpl
 * @Date: 2021-06-29 17:14:51
 * @LastEditTime: 2022-03-30 11:21:14
 * @LastEditors: Sissle Lynn
 */
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import GoBack from '@/components/GoBack';
import Footer from '@/components/Footer';
import { XXTZGG } from '@/services/after-class/xxtzgg';
import { enHenceMsg, getQueryString } from '@/utils/utils';
import imgPop from '@/assets/mobileBg.png';
import styles from './index.less';

import { data } from './mock';
import Version from '@/components/Version';
import { Divider } from 'antd';
import { JYJGTZGG } from '@/services/after-class/jyjgtzgg';
const Announcement = () => {
  const { initialState } = useModel('@@initialState');
  const [content, setContent] = useState<any>();
  const pageId = getQueryString('listid');
  const type = getQueryString('type');
  const ly = getQueryString('ly');
  const articlepage = getQueryString('articlepage');
  const index = getQueryString('index');
  useEffect(() => {
    async function announcements() {
      let res: any;
      if (type === 'zcgg') {
        res = await JYJGTZGG({ id: pageId! });
      } else {
        res = await XXTZGG({ id: pageId! });
      }
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
          onclick={index === 'true' ? '/teacher/home/notice' : '/teacher/home?index=index'}
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
      {content?.RQ ? <div className={styles.time}>
        <span >{content?.RQ}</span>
        {ly ? <><span> <Divider type='vertical' style={{ borderLeft: '1px solid #0000001a', margin: '0 10px' }} /></span><span>{ly}</span> </> : ''} </div> : ''}
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
            <h4 style={{ fontWeight: 'bold' }}>课后服务平台</h4>
            <p style={{ textIndent: '2em' }}>
              课后服务平台是专为全国中小学生群体量身打造的一款课后教育类应用，立足于三点半难题，提供课后服务管理与监督功能。
            </p>
          </div>
          <div className={styles.xb}>
            <Version
              key="version"
              style={{ color: '#666', textAlign: 'center', fontWeight: 'normal', marginBottom: 24 }}
            />
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

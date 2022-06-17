/*
 * @description: 公告详情
 * @author: zpl
 * @Date: 2021-06-29 17:14:51
 * @LastEditTime: 2022-06-17 15:55:45
 * @LastEditors: zpl
 */
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import GoBack from '@/components/GoBack';
import Footer from '@/components/Footer';
import { XXTZGG } from '@/services/after-class/xxtzgg';
import { enHenceMsg, getQueryObj } from '@/utils/utils';
import imgPop from '@/assets/mobileBg.png';
import styles from './index.less';

import { data } from './mock';
import Version from '@/components/Version';
import { Divider } from 'antd';
import { JYJGTZGG } from '@/services/after-class/jyjgtzgg';
import MobileCon from '@/components/MobileCon';

const Announcement = () => {
  const { initialState } = useModel('@@initialState');
  const [content, setContent] = useState<any>();
  const pageId = getQueryObj().listid;
  const { type, ly, articlepage, index } = getQueryObj();
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
    <MobileCon>
      <div className={styles.DetailsBox}>
        {pageId ? (
          <GoBack
            title="公告详情"
            onclick={index === 'true' ? '/parent/home/notice' : '/parent/home?index=index'}
          />
        ) : (
          ''
        )}
        {articlepage ? (
          <GoBack
            title={articlepage === 'serveAnnounce' ? '服务公告' : '关于我们'}
            onclick="/parent/home?index=mine"
          />
        ) : (
          ''
        )}
        {content?.BT ? <div className={styles.title}>{content?.BT}</div> : ''}
        {content?.RQ ? (
          <div className={styles.time}>
            <span>{content?.RQ}</span>
            {ly ? (
              <>
                <span>
                  {' '}
                  <Divider
                    type="vertical"
                    style={{ borderLeft: '1px solid #0000001a', margin: '0 10px' }}
                  />
                </span>
                <span>{ly}</span>{' '}
              </>
            ) : (
              ''
            )}{' '}
          </div>
        ) : (
          ''
        )}
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
                style={{
                  color: '#666',
                  textAlign: 'center',
                  fontWeight: 'normal',
                  marginBottom: 24,
                }}
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
    </MobileCon>
  );
};

export default Announcement;

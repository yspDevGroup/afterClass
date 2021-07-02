
import { getAllXXGG } from '@/services/after-class/xxgg';
import React, { useEffect, useState } from 'react'
import { Link } from 'umi';
import styles from './index.less';
import noData from '@/assets/noData.png';

const Details = () => {
  const [exhibition, setExhibition] = useState<boolean>(false);
  const [notification, setNotification] = useState<any[]>();

  useEffect(() => {
    async function announcements() {
      const res = await getAllXXGG({ status: ['发布'] });
      if (res.status === 'ok' && !(res.data?.length === 0)) {
        await setExhibition(true);
        await setNotification(res.data);
      } else {
        setExhibition(false);
      };
    };
    announcements();
  }, []);

  return (
    <div className={styles.bigbox}>
      <div className={styles.header}>
        <h3 className={styles.title}>公示栏</h3>
        <Link to='/parent/home/notice'>  <span className={styles.all} >全部 ＞</span></Link>
      </div>
      {
        exhibition ? <ul style={{ listStyle: 'initial', paddingLeft: '20px' }}>
          {notification?.map((record: any, index: number) => {
            if (notification.length > 0) {
              if (index < 4) {
                return <Link to={`/parent/home/notice/announcement?listid=${record.id}`} style={{ color: '#333' }}><li >{record.BT} </li></Link>
              } else {
                return ''
              }
            } else {
              return <div style={{ textAlign: 'center', background: "#eee", borderRadius: '8px', paddingBottom: '10px', width: '100%' }}>
                <img src={noData} alt="暂无数据" />
                <h4 style={{ color: '#999' }}>暂无已选课程</h4>
              </div>

            }

          })}
        </ul> : <div style={{ textAlign: 'center', background: "#eee", borderRadius: '8px', paddingBottom: '10px', width: '100%' }}>
            <img src={noData} alt="暂无数据" />
            <h4 style={{ color: '#999' }}>暂无已选课程</h4>
          </div>
      }
    </div>
  )
}

export default Details
import React  from 'react';
import { Link } from 'umi';
import styles from './index.less';
import noData from '@/assets/noData.png';

const Details = (props: { data?: any[] }) => {
  const { data } = props;

  return (
    <div className={styles.bigbox}>
      <div className={styles.header}>
        <h3 className={styles.title}>公示栏</h3>
        <Link to={{
          pathname: '/parent/home/notice',
          state: {
            notification: data
          }
        }}>  <span className={styles.all} >全部 ＞</span></Link>
      </div>
      {
        data && data.length ? <ul style={{ listStyle: 'initial', paddingLeft: '20px' }}>
          {data?.map((record: any, index: number) => {
            if (index < 4) {
              return <Link to={`/parent/home/notice/announcement?listid=${record.id}`} style={{ color: '#333' }}><li style={{lineHeight:'35px'}}>{record.BT} </li></Link>
            }
            return ''
          })}
        </ul> : <div style={{ textAlign: 'center',width: '100%' }}>
          <img src={noData} alt="暂无数据" />
          <h4 style={{ 'fontSize': '12px',lineHeight: '17px',color: '#DDDDDD'}}>暂无通知公告</h4>
        </div>
      }
    </div>
  )
}

export default Details
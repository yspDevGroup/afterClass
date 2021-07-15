import React  from 'react';
import { Link } from 'umi';
import styles from './index.less';
import noData from '@/assets/noTzgg.png';
import IconFont from '@/components/CustomIcon';
import Nodata from '@/components/Nodata';

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
        }}>  <span className={styles.all} >全部 <IconFont type="icon-gengduo" className={styles.gengduo} /></span></Link>
      </div>
      {
        data && data.length ? <ul style={{ listStyle: 'initial', paddingLeft: '5px' }}>
          {data?.map((record: any, index: number) => {
            if (index < 4) {
              return <Link to={`/parent/home/notice/announcement?listid=${record.id}`} style={{ color: '#333' }} key={index+1}>
                <li style={{ lineHeight: '30px',listStyle:'none' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                    <div className={styles.yuan}></div>
                       {record.BT}
                  </div>
                </li>
              </Link>
            }
            return ''
          })}
        </ul> :  <Nodata imgSrc={noData} desc='暂无公告' />
      }
    </div>
  )
}

export default Details
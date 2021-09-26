/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-25 17:55:59
 * @LastEditTime: 2021-09-26 15:36:06
 * @LastEditors: Sissle Lynn
 */
import { Divider } from 'antd';
import dayjs from 'dayjs';
import { Link } from 'umi';
import GoBack from '@/components/GoBack';

import styles from '../index.less';

const PatrolArrange = (props: any) => {
  const data = props?.location?.state;
  const today = dayjs().format('YYYY-MM-DD');

  return (
    <>
      <GoBack title={'巡课'} onclick='/teacher/patrolArrange' teacher />
      <div className={styles.patrolWrapper}>
        <div className={styles.patrolContent}>
          {data ? <div className={styles.patrolClass}>
            <h4>{data.KCMC}</h4>
            <ul>
              {data.KHBJSJs?.length && data.KHBJSJs.map((item: any) => {
                const { XXSJPZ, FJSJ } = item.KHPKSJs?.[0];
                return <li key={item.id}>
                  <div className={styles.left}>
                    <p>{item.BJMC}</p>
                    <p>{XXSJPZ?.KSSJ?.substring(0, 5)}-{XXSJPZ?.JSSJ?.substring(0, 5)}</p>
                    <p>本校 <Divider type='vertical' /> {FJSJ?.FJMC}</p>
                  </div>
                  <div className={styles.right}>
                    <span style={{ color: '#FF6600', fontSize: 12 }}>未巡课</span>
                    <Link to={{
                      pathname: '/teacher/patrolArrange/newPatrol',
                      state: {
                        kcmc: data.KCMC,
                        xkrq: today,
                        bjxx: item
                      }
                    }}>去巡课</Link>
                  </div>
                </li>
              })}
            </ul>
          </div> : ''}
        </div>
      </div>
    </>
  );
};

export default PatrolArrange;

/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-25 17:55:59
 * @LastEditTime: 2021-12-10 16:19:35
 * @LastEditors: Sissle Lynn
 */
import { useEffect, useState } from 'react';
import { Divider } from 'antd';
import { Link } from 'umi';
import { getCourseSchedule } from '@/services/after-class/khxksj';
import GoBack from '@/components/GoBack';

import styles from '../index.less';

const PatrolArrange = (props: any) => {
  const { id, day, xxId, kcmc } = props?.location?.state;
  const [classData, setClassData] = useState<any>([]);
  // 是否可以巡课
  const [available, setAvailable] = useState<boolean>(true);
  const today = new Date();
  const nowDay = new Date(day);
  const getData = async () => {
    const res = await getCourseSchedule({
      KHKCSJId: id,
      RQ: day,
      WEEKDAY: new Date(day).getDay().toString(),
      XXJBSJId: xxId,
    });
    if (res.status === 'ok' && res.data) {
      setClassData(res.data);
    }
  };
  useEffect(() => {
    if (today.getFullYear() !== nowDay.getFullYear()
      || today.getMonth() !== nowDay.getMonth()
      || today.getDate() !== nowDay.getDate()) {
      setAvailable(false)
    }
    getData();
  }, []);
  return (
    <>
      <GoBack title={'巡课'} onclick='/teacher/patrolArrange' teacher />
      <div className={styles.patrolWrapper}>
        <div className={styles.patrolContent}>
          <div className={styles.patrolClass}>
            <h4>{kcmc}</h4>
            <ul>
              {classData?.length && classData.map((item: any) => {
                const { XXSJPZ, FJSJ, } = item.KHPKSJs?.[0];
                const isXk = item.KHXKJLs?.length;
                return <li key={item.id}>
                  <div className={styles.left}>
                    <p>{item.BJMC}</p>
                    <p>{XXSJPZ?.KSSJ?.substring(0, 5)}-{XXSJPZ?.JSSJ?.substring(0, 5)}</p>
                    <p>本校 <Divider type='vertical' /> {FJSJ?.FJMC}</p>
                  </div>
                  <div className={styles.right}>
                    <span style={{ color: isXk ? '#45C977' : '#FF6600', fontSize: 12 }}>{isXk ? '已' : '未'}巡课</span>
                    {available || isXk ? <Link style={{ borderColor: isXk ? '#DDDDDD' : '#0066FF', color: isXk ? '#666666' : '#0066FF' }} to={{
                      pathname: '/teacher/patrolArrange/newPatrol',
                      state: {
                        kcid: id,
                        kcmc,
                        xkrq: day,
                        bjxx: item,
                        check: isXk
                      }
                    }}>{isXk ? '查看' : '去巡课'}</Link> : ''}
                  </div>
                </li>
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatrolArrange;

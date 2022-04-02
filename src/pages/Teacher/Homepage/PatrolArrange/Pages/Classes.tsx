/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-25 17:55:59
 * @LastEditTime: 2022-04-02 17:48:09
 * @LastEditors: Sissle Lynn
 */
import { useEffect, useState } from 'react';
import { Divider } from 'antd';
import { Link } from 'umi';
import { getCourseSchedule } from '@/services/after-class/khxksj';
import GoBack from '@/components/GoBack';

import styles from '../index.less';
import { queryXNXQList } from '@/services/local-services/xnxq';

const PatrolArrange = (props: any) => {
  const { id, day, xxId, kcmc } = props?.location?.state;
  const [classData, setClassData] = useState<any>([]);
  // 是否可以巡课
  const [available, setAvailable] = useState<boolean>(true);
  const today = new Date();
  const nowDay = new Date(day);
  const getData = async () => {
    const result = await queryXNXQList(xxId);
    if (result) {
      const res = await getCourseSchedule({
        KHKCSJId: id,
        RQ: day,
        XNXQId: result?.current?.id,
        XXJBSJId: xxId,
      });
      if (res.status === 'ok' && res.data) {
        setClassData(res.data);
      }
    }
  };
  useEffect(() => {
    if (
      today.getFullYear() !== nowDay.getFullYear() ||
      today.getMonth() !== nowDay.getMonth() ||
      today.getDate() !== nowDay.getDate()
    ) {
      setAvailable(false);
    }
    getData();
  }, []);

  return (
    <>
      <GoBack title={'巡课'} onclick="/teacher/patrolArrange" teacher />
      <div className={styles.patrolWrapper}>
        <div className={styles.patrolContent}>
          <div className={styles.patrolClass}>
            <h4>{kcmc}</h4>
            <ul>
              {classData?.length
                ? classData.map((item: any) => {
                    const { BJMC, KCBSKSJs, KHXKJLs } = item;
                    return (
                      <div key={item.id}>
                        {KCBSKSJs?.map((val: any) => {
                          const { XXSJPZ, FJSJ } = val;
                          const isXk = KHXKJLs?.find(
                            (v: { XXSJPZ: any }) => v.XXSJPZ?.id === XXSJPZ.id,
                          );
                          return (
                            <li key={val.id}>
                              <div className={styles.left}>
                                <p>{BJMC}</p>
                                <p>
                                  {XXSJPZ?.KSSJ?.substring(0, 5)}-{XXSJPZ?.JSSJ?.substring(0, 5)}
                                </p>
                                <p>
                                  本校 <Divider type="vertical" /> {FJSJ?.FJMC}
                                </p>
                              </div>
                              <div className={styles.right}>
                                <span style={{ color: isXk ? '#15B628' : '#f60', fontSize: 12 }}>
                                  {isXk ? '已' : '未'}巡课
                                </span>
                                {available || isXk ? (
                                  <Link
                                    style={{
                                      borderColor: isXk ? '#DDD' : '#0066FF',
                                      color: isXk ? '#666' : '#0066FF',
                                    }}
                                    to={{
                                      pathname: '/teacher/patrolArrange/newPatrol',
                                      state: {
                                        kcid: id,
                                        kcmc,
                                        xkrq: day,
                                        bjxx: item,
                                        skxx: val,
                                        check: isXk,
                                        jcId: XXSJPZ.id,
                                      },
                                    }}
                                  >
                                    {isXk ? '查看' : '去巡课'}
                                  </Link>
                                ) : (
                                  ''
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </div>
                    );
                  })
                : ''}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatrolArrange;

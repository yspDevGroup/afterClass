/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-12-06 09:46:54
 * @LastEditTime: 2022-04-22 10:19:35
 * @LastEditors: Wu Zhan
 */
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import moment from 'moment';
import { useModel, history } from 'umi';
import { ParentHomeData } from '@/services/local-services/mobileHome';
import { computedMonth } from '@/services/after-class/khjscq';
import GoBack from '@/components/GoBack';

import noOrder from '@/assets/noOrder1.png';
import styles from './index.less';
import MobileCon from '@/components/MobileCon';

const DealList: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const userId = currentUser.JSId || testTeacherId;
  const [dataSource, setDataSource] = useState<any>();
  const current = new Date();
  const year = current.getFullYear();
  const month = current.getMonth() + 1;

  useEffect(() => {
    (async () => {
      const oriData = await ParentHomeData(
        'teacher',
        currentUser?.xxId,
        currentUser.JSId || testTeacherId,
      );
      const { skkssj } = oriData.data;
      if (skkssj) {
        const prev = moment(skkssj).month();
        const months = [];
        for (let i = prev; i <= month; i += 1) {
          months.push(i);
        }
        const res = await computedMonth({
          JZGJBSJId: userId,
          CQZT: ['缺席'],
          YEAR: [year],
          MONTH: months,
        });
        if (res.status === 'ok') {
          setDataSource(res.data);
        }
      }
    })();
  }, []);
  // const newDay = moment.HTML5_FMT(new Date()).format('YYYY')
  return (
    <MobileCon>
      <GoBack title={'我要补签'} teacher onclick="/teacher/education/resign" />
      <div className={styles.resignList}>
        <div className={styles.listWrapper}>
          {dataSource?.length ? (
            dataSource.map((item: any) => {
              let date;
              if (item.month < 10) {
                date = moment(`${item.year}/0${item.month}/01`).endOf('month').format('YYYY-MM-DD');
              } else {
                date = moment(`${item.year}/${item.month}/01`).endOf('month').format('YYYY-MM-DD');
              }
              return (
                <div className={styles.card} key={item.month}>
                  <div>
                    <h3>{item.month}月考勤异常</h3>
                    <p>
                      <span className={styles.light}>缺卡：</span>
                      <span>{item.count}次</span>
                    </p>
                  </div>
                  <div>
                    <span className={styles.light}>
                      统计于：
                      {Number(moment().format('MM')) === Number(item.month)
                        ? moment().subtract(1, 'day').format('YYYY-MM-DD')
                        : date}
                    </span>
                    {item.month < month - 1 ? (
                      <Button type="dashed" disabled>
                        已逾期
                      </Button>
                    ) : (
                      <Button
                        className={styles.dealBtn}
                        onClick={() => {
                          history.push('/teacher/education/dealAbnormal', { data: item });
                        }}
                      >
                        立即处理
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noData}>
              <img src={noOrder} alt="" />
              <p>暂无数据</p>
            </div>
          )}
        </div>
      </div>
    </MobileCon>
  );
};

export default DealList;

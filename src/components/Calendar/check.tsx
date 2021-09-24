/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-08-10 14:53:35
 * @LastEditTime: 2021-08-10 16:05:09
 * @LastEditors: Sissle Lynn
 */
/* eslint-disable max-params */
import React, { useEffect } from 'react';
import styles from './index.less';
import { SchoolEvent } from './data';
import { getTermData } from './util/CalendarUtil';
// 传参说明
type CalendarProps = {
  terms: API.XNXQ[] | null;
  events?: SchoolEvent[];
}
const CalendarCheck = ({ terms, events, }: CalendarProps) => {
  useEffect(() => {
    if (terms?.length) {
     const data =  getTermData(terms![0]);
     console.log(data);

    }
  }, [terms, events,]);

  return (
    <div className={`${styles.calendarContainer}`}>
      <div className={styles.calendarBody}>
        <div className={styles.dateWrapper} >
          <div className={styles.dateData}>
            <div className={styles.yspDays} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default CalendarCheck;

/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-10-26 16:18:21
 * @LastEditTime: 2021-10-26 17:40:17
 * @LastEditors: Sissle Lynn
 */
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import moment from 'moment';
import { DateRange, Week } from '@/utils/Timefunction';
import CheckOnChart from './CheckOnChart';
import Nodata from '@/components/Nodata';

import styles from '../index.less';
import noChart from '@/assets/noChart1.png';

const CheckOnStatic = (props: { courseData: any[]; scheduleData: any[] }) => {
  const { courseData, scheduleData } = props;
  const [checkIn, setCheckIn] = useState<any[]>();
  const [wekDay, setWekDay] = useState<any>();

  // 当前时间
  const nowdate = moment(new Date().toLocaleDateString()).format('YYYY-MM-DD');
  const getChechIn = (data?: any[]) => {
    const classData: any = [];
    const newskrq = {};
    // 教授的课程有几门，每门下有几个班
    data?.forEach((item: any) => {
      const newkec = {
        KCMC: (
          <div>
            <div>{item.KHKCSJ.KCMC}</div>
            <div style={{ color: '#aaa', fontSize: '.9em' }}>{item.BJMC}</div>
          </div>
        ),
        class: [item],
      };
      classData.push(newkec);
    });
    // 周几上课
    scheduleData?.forEach((item: any) => {
      if (Object.keys(newskrq).indexOf(`${item.KHBJSJ.id}`) === -1) {
        newskrq[item.KHBJSJ.id] = [];
      }
      newskrq[item.KHBJSJ.id].push(item.WEEKDAY);
    });
    return {
      classData,
      newskrq,
    };
  };
  const getKcData = (item: any) => {
    const kcData: { label: string; type?: string | undefined; value: number; color: string }[] = [];
    for (let i = 0; i < item.class.length; i += 1) {
      const record = item.class[i];
      // 获取上课区间
      const datelist = DateRange(record.KKRQ, record.JKRQ);
      // 上课日期数组
      const Classdate: any = [];
      datelist?.forEach((list: any) => {
        // 获取周几上课，在上课区间拿出上课日期
        wekDay[record.id]?.forEach((ite: any) => {
          if (Week(list) === ite) {
            Classdate.push(list);
          }
        });
      });
      const courseDates = Classdate?.slice(0, record.KSS);
      // 已上课程
      const oldclass = [];
      // 未上课程
      const newclass = [];
      courseDates.forEach((it: any) => {
        if (new Date(nowdate) > new Date(it)) {
          oldclass.push(it);
        } else {
          newclass.push(it);
        }
      });
      // 出勤数据
      kcData.push(
        {
          label: record.BJMC,
          type: '正常',
          value: oldclass.length,
          color: 'l(180) 0:rgba(49, 217, 159, 1) 1:rgba(49, 217, 159, 0.2)',
        },
        {
          label: record.BJMC,
          type: '异常',
          value: 0,
          color: 'l(180) 0:rgba(255, 113, 113, 0.2) 1:rgba(255, 113, 113, 1)',
        },
        {
          label: record.BJMC,
          type: '待上',
          value: newclass.length,
          color: 'l(180) 0:rgba(0, 102, 255, 1) 1:rgba(0, 102, 255, 0.2)',
        },
      );
    }
    return kcData;
  };
  useEffect(() => {
    if (courseData?.length && scheduleData?.length) {
      const { classData, newskrq } = getChechIn(courseData);
      setCheckIn(classData);
      setWekDay(newskrq);
    }
  }, [courseData,scheduleData]);
  return (
    <div className={styles.funWrapper}>
      <div className={styles.titleBar}>
        出勤统计
        <div>
          <span />
          正常
          <span />
          异常
          <span />
          待上
        </div>
      </div>
      {checkIn && checkIn.length ? (
        <Row gutter={8}>
          {checkIn.map((item: any) => {
            const kcData = getKcData(item);
            return (
              <Col span={12}>
                <CheckOnChart data={kcData} title={item.KCMC} key={item.KCMC} />
              </Col>
            );
          })}
        </Row>
      ) : (
        <Nodata imgSrc={noChart} desc="暂无数据" />
      )}
    </div>
  );
};

export default CheckOnStatic;

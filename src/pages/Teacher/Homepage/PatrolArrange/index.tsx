/* eslint-disable no-nested-ternary */
/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-25 09:20:56
 * @LastEditTime: 2022-05-19 10:35:40
 * @LastEditors: Sissle Lynn
 */
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
import { Input, List } from 'antd';
import dayjs from 'dayjs';
// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment';
import 'moment/locale/zh-cn';

import styles from './index.less';
import GoBack from '@/components/GoBack';
import Nodata from '@/components/Nodata';
import MobileCalendar from '@/components/MobileCalendar/calendar';
import noData from '@/assets/noCourses1.png';
import { getScheduleByDate, getXKrecordBydate } from '@/services/after-class/khxksj';
import { getWeekday } from '@/services/local-services/mobileHome';
import { queryXNXQList } from '@/services/local-services/xnxq';
import MobileCon from '@/components/MobileCon';

const { Search } = Input;
const PatrolArrange = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [day, setDay] = useState<string>(dayjs().format('YYYY/MM/DD'));
  // 课表中选择课程后的数据回显
  const [dateData, setDateData] = useState<any>([]);
  const [dates, setDates] = useState<string[]>([]);
  const getData = async (days: string, name?: string) => {
    const result = await queryXNXQList(currentUser?.xxId);
    if (result) {
      const res = await getScheduleByDate({
        JZGJBSJId: currentUser?.JSId || testTeacherId,
        RQ: days,
        KCMC: name,
        XNXQId: result?.current?.id,
        XXJBSJId: currentUser?.xxId,
      });
      if (res.status === 'ok' && res.data) {
        const { flag, rows } = res.data;
        if (flag) {
          setDateData(rows);
        } else {
          setDateData([]);
        }
      }
    }
  };
  const getDateData = async (start?: string, end?: string) => {
    const res = await getXKrecordBydate({
      JZGJBSJId: currentUser?.JSId || testTeacherId,
      StarDate: start || getWeekday(new Date(day)),
      EndDate: end || getWeekday(new Date(day), 'Saturday'),
      XXJBSJId: currentUser?.xxId,
    });
    if (res.status === 'ok') {
      const dateArr = res?.data?.map((v: string) => {
        return { markType: 'dot', date: v };
      });
      setDates(dateArr);
    }
  };
  useEffect(() => {
    getDateData();
  }, []);
  useEffect(() => {
    getData(day);
  }, [day]);

  return (
    <MobileCon>
      <GoBack title={'巡课安排'} onclick="/teacher/home?index=index" teacher />
      <div className={styles.patrolWrapper}>
        <MobileCalendar
          showType={'week'}
          exchangeType={false}
          disableMonthView={true}
          markDates={dates}
          markType="dot"
          onDateClick={(date: { format: (arg: string) => any }) =>
            setDay(date.format('YYYY/MM/DD'))
          }
          transitionDuration={0.1}
          currentDate={day}
          onTouchEnd={(a: number, b: number) => {
            const start = moment(new Date(a)).format('YYYY-MM-DD');
            const end = moment(new Date(b)).format('YYYY-MM-DD');
            getDateData(start, end);
          }}
        />
        <div className={styles.patrolContent}>
          <div style={{ marginBottom: 12 }}>
            <Search
              placeholder="请输入课程名称"
              onSearch={(value) => {
                getData(day, value);
              }}
              enterButton
            />
          </div>
          {dateData?.length ? (
            <List
              className={styles.patrolList}
              itemLayout="horizontal"
              dataSource={dateData}
              renderItem={(item: any) => (
                <Link
                  key={item.id}
                  to={{
                    pathname: '/teacher/patrolArrange/classes',
                    state: {
                      id: item.id,
                      day,
                      xxId: currentUser?.xxId,
                      kcmc: item.KCMC,
                    },
                  }}
                >
                  <List.Item
                    actions={[
                      <span
                        key={item.id}
                        style={{
                          color: item.SFXK === 1 ? '#0066FF' : item.SFXK === 2 ? '#15B628' : '#f60',
                          fontSize: 12,
                        }}
                      >
                        {item.SFXK === 1 ? '部分' : item.SFXK === 2 ? '已' : '未'}巡课
                      </span>,
                    ]}
                  >
                    <List.Item.Meta title={item.KCMC} description={item.SSJGLX} />
                  </List.Item>
                </Link>
              )}
            />
          ) : (
            <div className={styles.noData}>
              <Nodata imgSrc={noData} desc="暂无巡课安排" />
            </div>
          )}
        </div>
      </div>
    </MobileCon>
  );
};

export default PatrolArrange;

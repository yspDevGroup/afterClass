/* eslint-disable no-nested-ternary */
/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2022-05-10 15:02:56
 * @LastEditTime: 2022-05-17 12:19:03
 * @LastEditors: Sissle Lynn
 */
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
import { List } from 'antd';
import dayjs from 'dayjs';
// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment';
import 'moment/locale/zh-cn';

import styles from './index.less';
import GoBack from '@/components/GoBack';
import Nodata from '@/components/Nodata';
import MobileCalendar from '@/components/MobileCalendar/calendar';
import noData from '@/assets/noCourses1.png';
import MobileCon from '@/components/MobileCon';
import {
  CurdayCourse,
  getWeekCalendar,
  ParentHomeData,
} from '@/services/local-services/mobileHome';
import { RightOutlined } from '@ant-design/icons';
const StudentApply = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [day, setDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [course, setCourse] = useState<any>();
  const [dates, setDates] = useState<any[]>([]);
  const userId = currentUser?.JSId || testTeacherId;
  // 根据日期修改展示数据
  const changeDateList = async (date?: any) => {
    const curDay = date || dayjs();
    const dayFormat = curDay.format('YYYY-MM-DD');
    setDay(dayFormat);
    const { courseList } = await CurdayCourse('teacher', currentUser?.xxId, userId, dayFormat);
    setCourse(courseList);
  };
  // 课表中选择课程后的数据回显
  const getMarkDays = async (start?: string) => {
    const oriData = await ParentHomeData('teacher', currentUser?.xxId, userId);
    const { markDays } = oriData;
    const weekDys = await getWeekCalendar('teacher', userId, start || day);
    setDates(markDays.concat(weekDys));
  };
  useEffect(() => {
    (async () => {
      const { courseList } = await CurdayCourse('teacher', currentUser?.xxId, userId, day);
      getMarkDays(day);
      setCourse(courseList);
    })();
  }, []);

  return (
    <MobileCon>
      <GoBack title={'考勤更改'} onclick="/teacher/education/studentRecord" teacher />
      <div className={styles.patrolWrapper}>
        <p style={{ marginBottom: '8px', lineHeight: '35px', textIndent: '12px', color: '#888' }}>
          注：有且仅能更改今日之前的学生考勤
        </p>
        <MobileCalendar
          showType={'week'}
          exchangeType={false}
          disableMonthView={true}
          markDates={dates}
          markType="dot"
          onTodayClick={() => {
            changeDateList();
          }}
          onDateClick={(date: { format: (arg: string) => any }) => {
            changeDateList(date);
          }}
          transitionDuration={0.1}
          currentDate={day}
          onTouchEnd={(a: number, b: number) => {
            const start = moment(new Date(b)).format('YYYY-MM-DD');
            getMarkDays(start);
          }}
        />
        <div className={styles.patrolContent}>
          {course?.length ? (
            <List
              className={styles.patrolList}
              itemLayout="horizontal"
              dataSource={course}
              renderItem={(item: any) => (
                <List.Item
                  actions={
                    dayjs().isAfter(dayjs(day)) && day !== dayjs().format('YYYY-MM-DD')
                      ? [
                          <Link
                            key={item.kcId}
                            to={{
                              pathname: '/teacher/education/studentRecord/edit',
                              state: {
                                ...item,
                                date: day,
                              },
                            }}
                          >
                            <span
                              key={item.id}
                              style={{
                                color: '#0066FF',
                                fontSize: 12,
                              }}
                            >
                              考勤变更
                              <RightOutlined />
                            </span>
                          </Link>,
                        ]
                      : undefined
                  }
                >
                  <List.Item.Meta
                    title={item.title}
                    description={`${item.BJMC} | ${item.start} - ${item.end}`}
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className={styles.noData}>
              <Nodata imgSrc={noData} desc="暂无课程" />
            </div>
          )}
        </div>
      </div>
    </MobileCon>
  );
};

export default StudentApply;

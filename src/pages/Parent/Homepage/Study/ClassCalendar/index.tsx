import React, { useContext, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { List, Divider, Checkbox, message, FormInstance } from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';
import { Calendar } from 'react-h5-calendar';
import ListComponent from '@/components/ListComponent';
import { compareNow, DateRange, Week } from '@/utils/Timefunction';
import noData from '@/assets/noCourse.png';
import { ParentHomeData } from '@/services/local-services/xsHome';

import styles from './index.less';

type propstype = {
  setDatedata?: (data: any) => void;
  type?: string;
  form?: FormInstance<any>;
  setReloadList?: React.Dispatch<React.SetStateAction<boolean>>;
};
const defaultMsg = {
  type: 'picList',
  cls: 'picList',
  list: [],
  noDataText: '当天无课',
  noDataImg: noData,
};

const ClassCalendar = (props: propstype) => {
  const { setDatedata, type, form, setReloadList } = props;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { xxId, student } = currentUser || {};
  const [day, setDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [cDay, setCDay] = useState<string>(dayjs().format('M月D日'));
  const [course, setCourse] = useState<any>(defaultMsg);
  const [dates, setDates] = useState<any[]>([]);
  const [courseArr, setCourseArr] = useState<any>({});
  const [choosenCourses, setChoosenCourses] = useState<any>([]);

  // 后台返回的周数据的遍历
  const getCalendarData = (data: any) => {
    const courseData = {};
    const markDays = [];
    const learnData = {};
    for (let k = 0; k < data?.length; k += 1) {
      const item = data[k];
      const courseDays = [];
      const startDate = item.KHBJSJ.KKRQ ? item.KHBJSJ.KKRQ : item.KHBJSJ.KHKCSJ.KKRQ;
      const endDate = item.KHBJSJ.JKRQ ? item.KHBJSJ.JKRQ : item.KHBJSJ.KHKCSJ.JKRQ;
      const kcxxInfo = [
        {
          title: item.KHBJSJ.KHKCSJ.KCMC,
          img: item.KHBJSJ.KCTP ? item.KHBJSJ.KCTP : item.KHBJSJ.KHKCSJ.KCTP,
          link: `/parent/home/courseTable?classid=${item.KHBJSJ.id}`,
          start: item.XXSJPZ?.KSSJ?.substring(0, 5),
          end: item.XXSJPZ?.JSSJ?.substring(0, 5),
          xq: `本校`,
          bjId: item.KHBJSJ.id,
          desc: [
            {
              left: [
                `课程时段：${item.XXSJPZ.KSSJ.substring(0, 5)}-${item.XXSJPZ.JSSJ.substring(0, 5)}`,
              ],
            },
            {
              left: [`上课地点：${item.FJSJ.FJMC}`],
            },
          ],
        },
      ];
      const res = DateRange(
        moment(startDate).format('YYYY/MM/DD'),
        moment(endDate).format('YYYY/MM/DD'),
      );
      for (let i = 0; i < res.length; i += 1) {
        const weekDay = Week(moment(res[i]).format('YYYY/MM/DD'));
        if (weekDay === item.WEEKDAY) {
          if (courseData[res[i]]) {
            courseData[res[i]] = courseData[res[i]].concat(kcxxInfo);
          } else {
            courseData[res[i]] = kcxxInfo;
          }
          markDays.push({
            date: res[i],
          });
          courseDays.push(res[i]);
        }
      }
      if (learnData[item.KHBJSJ.id]) {
        const val = learnData[item.KHBJSJ.id];
        learnData[item.KHBJSJ.id] = {
          dates: val.dates.concat(courseDays),
          weekDay: `${val.weekDay},${item.WEEKDAY}`,
          courseInfo: item,
        };
      } else {
        learnData[item.KHBJSJ.id] = {
          dates: courseDays,
          weekDay: item.WEEKDAY,
          courseInfo: item,
        };
      }
    }

    return {
      markDays,
      courseData,
      learnData,
    };
  };
  useEffect(() => {
    (async () => {
      const res = await ParentHomeData(xxId, student?.student_userid || '20210901');
      const { weekSchedule } = res;
      const { markDays, courseData, learnData } = getCalendarData(weekSchedule);
      setDatedata?.(learnData);
      setDates(markDays);
      setCourse({
        type: 'picList',
        cls: 'picList',
        list: courseData[day] || [],
        noDataText: '当天无课',
        noDataImg: noData,
      });
      setCourseArr(courseData);
    })();
  }, []);
  useEffect(() => {
    setDatedata?.(choosenCourses);
  }, [choosenCourses])
  const onChange = (e: any, item: any) => {
    let newChoosen = [...choosenCourses];
    setReloadList?.(false);
    if (e?.target?.checked) {
      const { start, end, bjId, title } = item;
      newChoosen.push({
        day,
        start,
        end,
        bjId,
        title
      });
    } else {
      newChoosen = newChoosen.filter((val) => val.bjId !== item.bjId);
    }
    setChoosenCourses(newChoosen);
  }
  return (
    <div className={styles.schedule}>
      <span
        className={styles.today}
        onClick={() => {
          if (type && type === 'edit') {
            form?.resetFields();
            setChoosenCourses([]);
          }
          setDay(dayjs().format('YYYY-MM-DD'));
          setCDay(dayjs().format('M月D日'));
          setCourse({
            type: 'picList',
            cls: 'picList',
            list: courseArr[dayjs().format('YYYY-MM-DD')] || [],
            noDataText: '当天无课',
            noDataImg: noData,
          });
        }}
      >
        今
      </span>
      <Calendar
        showType={'week'}
        markDates={dates}
        onDateClick={(date: { format: (arg: string) => any }) => {
          if (type && type === 'edit') {
            if (!compareNow(date.format('YYYY-MM-DD'))) {
              message.warning('不可选择今天之前的课程');
              return;
            }
            if (date.format('YYYY-MM-DD') !== day) {
              form?.resetFields();
              setChoosenCourses([]);
            }
          }
          setDay(date.format('YYYY-MM-DD'));
          setCDay(date.format('M月D日'));
          const curCourse = {
            type: 'picList',
            cls: 'picList',
            list: courseArr[date.format('YYYY-MM-DD')] || [],
            noDataText: '当天无课',
            noDataImg: noData,
          };
          setCourse(curCourse);
        }}
        markType="dot"
        transitionDuration={0.1}
        currentDate={day}
      />
      {type && type === 'edit' ? <p style={{ lineHeight: '35px', margin: 0, color: '#888' }}>请选择课程</p> : <div className={styles.subTitle}>{cDay}</div>}
      {type && type === 'edit' ?
        <List
          style={{ background: '#fff' }}
          itemLayout="horizontal"
          dataSource={course?.list?.length ? course?.list : []}
          renderItem={(item: any) => {
            return (
              <List.Item
                key={`${day}+${item?.bjId}`}
                actions={[<Checkbox onChange={(e) => onChange(e, item)} />]}
              >
                <List.Item.Meta
                  title={item?.title}
                  description={<>{item.start}—{item.end}<Divider type='vertical' />{item.xq}</>}
                />
              </List.Item>
            )
          }}
        />
        : <ListComponent listData={course} />}
    </div>
  );
};
export default ClassCalendar;

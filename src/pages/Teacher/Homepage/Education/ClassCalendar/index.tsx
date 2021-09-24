/* eslint-disable @typescript-eslint/no-shadow */
import { Modal, message } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import { Calendar } from 'react-h5-calendar';
import styles from './index.less';
import ListComponent from '@/components/ListComponent';
import moment from 'moment';
import { DateRange, Week } from '@/utils/Timefunction';
import noData from '@/assets/noCourses1.png';
import classroomStyle from '@/assets/classroomStyle.png';
import myContext from '@/utils/MyContext';
import { msgLeaveSchool } from '@/services/after-class/wechat';
import { DisplayColumnItem } from '@/components/data';


type propstype = {
  setDatedata?: (data: any) => void;
};
const defaultMsg = {
  type: 'picList',
  cls: 'picList',
  list: [],
  noDataText: '当天无课',
  noDataImg: noData,
};

const ClassCalendar = (props: propstype) => {
  const { setDatedata } = props;
  const [day, setDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [cDay, setCDay] = useState<string>(dayjs().format('M月D日'));
  const [course, setCourse] = useState<any>(defaultMsg);
  const { weekSchedule } = useContext(myContext);
  const [dates, setDates] = useState<any[]>([]);
  const [courseArr, setCourseArr] = useState<any>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bjid,setBjid] =  useState<string>();
  const iconTextData: DisplayColumnItem[] = day === dayjs().format('YYYY-MM-DD')?[
    {
      text: '签到点名',
      icon: 'icon-dianming',
      background: '#FFC700',
    },
    {
      text: '离校通知',
      icon: 'icon-lixiao',
      background: '#7DCE81',
      handleClick:(bjid: string)=>{
        setBjid(bjid);
        setIsModalVisible(true);
      },
    },
    {
      text: '课堂风采',
      itemType: 'img',
      img: classroomStyle,
      background: '#FF8863',
    },
  ]:[
    {
      text: '签到点名',
      icon: 'icon-dianming',
      background: '#FFC700',
    },
    {
      text: '课堂风采',
      itemType: 'img',
      img: classroomStyle,
      background: '#FF8863',
    },
  ];
  // 后台返回的周数据的遍历
  const getCalendarData = (data: any) => {
    const courseData = {};
    const markDays = [];
    const learnData = {};
    const newData = {};
    data?.forEach((item: any) => {
      if (Object.keys(newData).indexOf(`${item.KHBJSJ.id}`) === -1) {
        newData[item.KHBJSJ.id] = [];
      }
      newData[item.KHBJSJ.id].push(item);
    });

    for (let k = 0; k < data?.length; k += 1) {
      const item = data[k];
      const weeked: any[] = [];
      const dates: any[] = [];
      newData[item.KHBJSJ.id].forEach((rea: any) => {
        if (dates.length === 0) {
          dates.push(DateRange(rea.KHBJSJ.KKRQ, rea.KHBJSJ.JKRQ));
        }
        if (weeked.indexOf(rea.WEEKDAY) === -1) {
          weeked.push(rea.WEEKDAY);
        }
      });
      const sj: any[] = [];
      dates[0].forEach((as: any) => {
        weeked.forEach((ds: any) => {
          if (Week(as) === ds) {
            sj.push(as);
          }
        });
      });
      const courseDays = [];
      const startDate = item.KHBJSJ.KKRQ ? item.KHBJSJ.KKRQ : item.KHBJSJ.KHKCSJ.KKRQ;
      const endDate = item.KHBJSJ.JKRQ ? item.KHBJSJ.JKRQ : item.KHBJSJ.KHKCSJ.JKRQ;
      const kcxxInfo = {
        title: item.KHBJSJ.KHKCSJ.KCMC,
        img: item.KHBJSJ.KCTP ? item.KHBJSJ.KCTP : item.KHBJSJ.KHKCSJ.KCTP,
        link: `/teacher/home/courseDetails?classid=${item.KHBJSJ.id}&courseid=${item.KHBJSJ.KHKCSJ.id}&index=all`,
        desc: [
          {
            left: [
              `${item.XXSJPZ.KSSJ.substring(0, 5)}-${item.XXSJPZ.JSSJ.substring(0, 5)}  |  ${item.KHBJSJ.BJMC} `,
            ],
          },
          {
            left: [`${item.FJSJ.FJMC}`],
          },
        ],
      };
      const res = DateRange(
        moment(startDate).format('YYYY/MM/DD'),
        moment(endDate).format('YYYY/MM/DD'),
      );
      for (let i = 0; i < res.length; i += 1) {
        const weekDay = Week(moment(res[i]).format('YYYY/MM/DD'));
        if (weekDay === item.WEEKDAY) {
          const enrollLink = {
            pathname: '/teacher/education/callTheRoll',
            state: {
              pkid: item.id,
              bjids: item.KHBJSJ.id,
              date: moment(res[i]).format('YYYY/MM/DD'),
              kjs: sj.length,
              sj,
            },
          };
          // const recordLink = {
          //   pathname: '/teacher/education/rollcallrecord',
          //   state: {
          //     pkid: item.id,
          //     bjids: item.KHBJSJ.id,
          //     date: moment(res[i]).format('YYYY/MM/DD'),
          //     kjs: sj.length,
          //     sj,
          //   },
          // };
          const curInfo = [
            {
              enrollLink,
              bjid:item.KHBJSJ.id,
              // recordLink,
              ...kcxxInfo,
            },
          ];
          if (courseData[res[i]]) {
            courseData[res[i]] = courseData[res[i]].concat(curInfo);
          } else {
            courseData[res[i]] = curInfo;
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

  const handleOk = async () => {
    setIsModalVisible(false);
    const res = await msgLeaveSchool({
      KHBJSJId: bjid
    });
    if (res.status === 'ok' && res.data) {
      message.success('通知已成功发送');
    }else{
      message.error(res.message);
    };
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const { markDays, courseData, learnData } = getCalendarData(weekSchedule);
    if (setDatedata) {
      setDatedata(learnData);
    }
    setDates(markDays);
    setCourse({
      type: 'picList',
      cls: 'picList',
      list: courseData[day] || [],
      noDataText: '当天无课',
      noDataImg: noData,
    });
    setCourseArr(courseData);
  }, []);

  return (
    <div className={styles.schedule}>
      <span
        className={styles.today}
        onClick={() => {
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
      <div className={styles.subTitle}>{cDay}</div>
      <ListComponent listData={course} operation={iconTextData} />
      <Modal className={styles.leaveSchool} title="离校通知" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} centered={true} closable={false}>
        <p>今日课后服务课程已结束，您的孩子已离校，请知悉。</p>
      </Modal>
    </div>
  );
};
export default ClassCalendar;

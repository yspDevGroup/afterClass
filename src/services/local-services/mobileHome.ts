/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 11:50:45
 * @LastEditTime: 2021-11-01 17:07:42
 * @LastEditors: Sissle Lynn
 */

import { enHenceMsg, getCurrentStatus } from '@/utils/utils';
import moment from 'moment';
import dayjs from 'dayjs';
import { getTeachersApplication } from '../after-class/jzgjbsj';
import { homePageInfo } from '../after-class/user';
import { queryXNXQList } from './xnxq';

/**
 * 组装课程班信息
 * @param data 每天课程安排
 * @returns {}
 */

const schoolCourse = (data: any) => {
  const courseData = {};
  const courseId = [];
  for (let k = 0; k < data?.length; k += 1) {
    const { id, FJSJ, KHBJSJ, WEEKDAY, XXSJPZ } = data[k];
    const wkd = Number(WEEKDAY);
    const kcxxInfo = [
      {
        title: KHBJSJ?.KHKCSJ?.KCMC,
        BJMC: KHBJSJ?.BJMC,
        KKRQ: KHBJSJ?.KKRQ,
        JKRQ: KHBJSJ?.JKRQ,
        KSS: KHBJSJ?.KSS,
        BJRS: KHBJSJ?.BJRS,
        wkd,
        img: KHBJSJ?.KHKCSJ?.KCTP,
        start: XXSJPZ?.KSSJ?.substring?.(0, 5),
        end: XXSJPZ?.JSSJ?.substring?.(0, 5),
        xq: `本校`,
        address: FJSJ?.FJMC,
        bjId: KHBJSJ?.id,
        kcId: KHBJSJ?.KHKCSJ?.id,
        pkId: id,
        jcId: XXSJPZ?.id,
        fjId: FJSJ?.id,
      },
    ];
    if (courseData[KHBJSJ?.id]) {
      const { weekDay, courseInfo } = courseData[KHBJSJ?.id];
      const curWkd = weekDay[0][0] === wkd ? [[wkd, (weekDay[0][1] + 1)]] : weekDay.concat([[wkd, 1]]);
      courseData[KHBJSJ?.id].weekDay = curWkd;
      courseData[KHBJSJ?.id].courseInfo = courseInfo.concat(kcxxInfo);
    } else {
      courseData[KHBJSJ?.id] = {
        startDate: KHBJSJ?.KKRQ,
        sum: KHBJSJ.KSS,
        weekDay: [[wkd, 1]],
        courseInfo: kcxxInfo,
      };
      courseId.push(KHBJSJ?.id);
    }
  }
  return {
    courseId,
    courseData
  };
}
/**
 * 组装课程班课时信息
 * @param sum 课程班总课时
 * @param weekDay 课程班周次安排
 * @param start 课程班总开始上课时间
 * @returns {}
 */
const schoolHours = (sum: number, weekDay: any[], start: string, courseInfo: any[]) => {
  const startDay = new Date(start);
  const days = [];
  const nowDay = moment(new Date()).format('YYYY-MM-DD');
  let today = false;
  while (days.length < sum) {
    const day = new Date(startDay.getTime());
    const curDay = moment(day).format('YYYY-MM-DD');
    const w = weekDay.find(wd => wd[0] === day.getDay());
    if (w) {
      const findDay = homeInfo.markDays?.length && homeInfo.markDays?.find((it) => it.date === curDay);
      if (findDay) {
        if (curDay === '2021-10-29') {
        }
        findDay.courses = findDay.courses.concat(courseInfo.filter(item => item.wkd === w[0]));
      } else {
        homeInfo.markDays.push({
          date: curDay,
          courses: courseInfo.filter(item => item.wkd === w[0])
        })
      }
      for (let i = 0; i < w[1] && days.length < sum; i++) {
        nowDay == (curDay) ? today = true : '';
        days.push({
          index: days.length,
          day: curDay,
          courses: courseInfo.filter(item => item.wkd === w[0])?.[i]
        });
      }
    }
    startDay.setTime(startDay.getTime() + 1000 * 3600 * 24);
  }
  return {
    days,
    today
  };
}
const getHomeData = async (type: string, xxId: string, userId: string, njId?: string) => {
  let courseStatus = 'empty';
  const result = await queryXNXQList(xxId);
  if (result.current) {
    const params: any = {
      XNXQId: result.current.id,
      XXJBSJId: xxId,
    };
    if (type === 'teacher') {
      params.JSId = userId;
      const response = await getTeachersApplication({
        JZGJBSJId: userId,
        startDate: result.current.KSRQ,
        endDate: result.current.JSRQ,
      });
      if (response?.status === 'ok') {
        homeInfo.special = response.data;
      }
    } else {
      params.XSId = userId;
      params.njId = njId;
    }
    const res = await homePageInfo(params);
    if (res?.status === 'ok') {
      courseStatus = 'empty';
      if (res.data) {
        const { bmkssj, bmjssj, skkssj, skjssj, weekSchedule } = res.data;
        if (bmkssj && bmjssj && skkssj && skjssj) {
          const cStatus = getCurrentStatus(bmkssj, bmjssj, skkssj, skjssj);
          courseStatus = cStatus;
        }
        const { courseId, courseData } = schoolCourse(weekSchedule);
        const courseSche: { courseInfo: any[]; days: any[]; today: boolean; }[] = [];
        homeInfo.markDays = [];
        courseId?.forEach(item => {
          const { sum, weekDay, startDate, courseInfo } = courseData[item];
          const { days, today } = schoolHours(sum, weekDay, startDate, courseInfo);
          courseSche.push({
            courseInfo,
            days,
            today
          });
        });
        homeInfo.markDays?.sort((a, b) => new Date(a.date.replace(/-/g, '/')).getTime() - new Date(b.date.replace(/-/g, '/')).getTime())
        homeInfo.markDays?.forEach(day => {
          const { courses } = day;
          courses?.sort((a: { start: string; }, b: { start: string; }) => {
            const aT = Number(a.start.replace(/:/g, ''));
            const bT = Number(b.start.replace(/:/g, ''));
            return aT - bT;
          });
        })
        homeInfo.courseSchedule = courseSche;
        homeInfo.data = {
          courseStatus,
          weekSchedule,
          ...res?.data,
        };
      }
    } else {
      enHenceMsg(res.message);
      homeInfo.data = {
        courseStatus,
      };
    }
  } else {
    homeInfo.data = {
      courseStatus,
    };
  }
}
/**
 * 移动端首页获取数据处理
 * @param type 类属教师还是学生 'teacher'|'student'
 * @param xxId 学校ID
 * @param userId 用户ID
 * @param njId 学生用户年级ID
 * @param refresh 是否需要更新接口重新获取数据
 * @returns
 */
export const ParentHomeData = async (type: string, xxId: string, userId: string, njId?: string, refresh?: boolean) => {
  if (typeof homeInfo === 'undefined') {
    ((w) => {
      // eslint-disable-next-line no-param-reassign
      w.homeInfo = {};
    })(window as Window & typeof globalThis & { homeInfo: any });
  }

  if (!homeInfo.data || refresh) {
    await getHomeData(type, xxId, userId, njId);
    return homeInfo;
  }
  return homeInfo;
};
/**
 * 针对首页中今日课程做部分处理
 * @param type 类属教师还是学生 'teacher'|'student'
 * @param xxId 学校ID
 * @param userId 用户ID
 * @returns
 */
export const TodayCourse = async (type?: string, xxId?: string, userId?: string, njId?: string) => {
  let data = [];
  let total = '';
  // 获取已经处理过的课程安排数据
  if (typeof homeInfo === 'undefined' && type && xxId && userId) {
    const res = await ParentHomeData(type, xxId, userId);
    data = res.courseSchedule;
    total = res.data;
  } else if (homeInfo && homeInfo?.courseSchedule) {
    data = homeInfo.courseSchedule;
    total = homeInfo.data;
  }
  // 通过today属性找出今日课程
  const courseList = data?.filter((item: { today: boolean; }) => item.today === true);
  return {
    total,
    courseList
  };
}
export const AttendanceTable = async (date: string, userId?: string) => {
  let data: any = {};
  if (homeInfo.courseSchedule) {
    data = homeInfo.courseSchedule;
  } else {
    const response = await getTeachersApplication({
      JZGJBSJId: userId,
      startDate: date,
    });
    if (response?.status === 'ok') {
      data = response.data;
    }
  }
  const { nowDks, nowTks, qjs } = data;
  const supplyData = nowDks?.filter((item: any) => item.SKRQ === date);
  const switchData = nowTks?.filter((item: any) => item.SKRQ === date);
  const leaveData = qjs?.filter((item: any) => item.SKRQ === date);
  return {
    date,
    supplyData,
    switchData,
    leaveData
  }
};
/**
 * 计算课程已学课时，
 * @param data 课程安排信息
 * @returns
 */
export const CountCourses = (data: any) => {
  const myDate = dayjs().format('YYYY/MM/DD');
  const courseData = data.length && data.map((item: { courseInfo: any; days: any; }) => {
    const { courseInfo, days } = item;
    const learned = days.filter((ele: { day: string; }) => {
      const time = new Date(ele.day.replace(/-/g, '/')).getTime() - new Date(myDate).getTime();
      return time < 0
    });
    return {
      id: courseInfo?.[0]?.bjId,
      title: courseInfo?.[0]?.title,
      BJMC: courseInfo?.[0]?.BJMC,
      YXKS: learned?.length || 0,
      ZKS: courseInfo?.[0]?.KSS,
      link: `/parent/home/courseTable?classid=${courseInfo?.[0]?.bjId}`,
      desc: [
        {
          left: [
            `${courseInfo.map((item: any, index: number) => {
              return `每周${'日一二三四五六'.charAt(item.wkd)} ${item.start}-${item.end}`;
            })}`
          ]
        },
        {
          left: [`共${courseInfo?.[0]?.KSS}课时`, `已学${learned?.length || 0}课时`],
        },
      ],
    }
  });
  return courseData;
};

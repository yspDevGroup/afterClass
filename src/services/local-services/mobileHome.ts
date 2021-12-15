/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 11:50:45
 * @LastEditTime: 2021-12-14 17:16:22
 * @LastEditors: zpl
 */
/* eslint-disable no-param-reassign */

import moment from 'moment';
import dayjs from 'dayjs';
import { getCurrentStatus } from '@/utils/utils';
import { getTeachersApplication } from '../after-class/jzgjbsj';
import { homePageInfo } from '../after-class/user';
import { queryXNXQList } from './xnxq';
import { getAllKHJSTDK } from '../after-class/khjstdk';
import { getAllKHBJKSSJ } from '../after-class/khbjsj';
import { getAllKHXSQJ } from '../after-class/khxsqj';

const converClassInfo = (data: any) => {
  const classData = [];
  for (let k = 0; k < data?.length; k += 1) {
    const { id, FJSJ, KHBJSJ, WEEKDAY, XXSJPZ } = data[k];
    const wkd = Number(WEEKDAY);
    classData.push({
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
    });
  }
  return classData;
};
const uniqueArr = (arr: any) => {
  const days: any[] = [];
  arr.forEach((ele: { day: any }) => {
    const findDay = days?.find((it) => it.date === ele.day);
    if (!findDay) {
      days.push({
        date: ele.day,
      });
    }
  });
  return days;
};

/**
 * 获取移动端首页信息
 * @param type 身份类型（教师还是学生）
 * @param xxId 学校ID
 * @param userId 用户ID
 * @param njId 学生的年级ID
 */
const getHomeData = async (
  type: string,
  xxId: string,
  userId: string,
  njId?: string,
  bjId?: string,
  XQSJId?: string,
) => {
  let courseStatus = 'empty';
  const result = await queryXNXQList(xxId);
  homeInfo.markDays = [];
  homeInfo.courseSchedule = [];
  if (result.current) {
    const params: any = {
      XNXQId: result.current.id,
      XXJBSJId: xxId,
    };
    if (type === 'teacher') {
      params.JSId = userId;
    } else {
      params.XSId = userId;
      params.njId = njId;
      params.bjId = bjId;
      params.XQSJId = XQSJId;
    }
    const res = await homePageInfo(params);
    if (res?.status === 'ok') {
      courseStatus = 'empty';
      if (res.data) {
        const { bmkssj, bmjssj, skkssj, skjssj, yxkc, weekSchedule, ...rest } = res.data;
        if (bmkssj && bmjssj && skkssj && skjssj) {
          const cStatus = getCurrentStatus(bmkssj, bmjssj, skkssj, skjssj);
          courseStatus = cStatus;
        }
        const bjIds = [].map.call(yxkc, (v: { id: string }) => {
          return v.id;
        });
        if (yxkc?.length) {
          const clsRes = await getAllKHBJKSSJ({
            KHBJSJIds: bjIds as string[],
            page: 0,
            pageSize: 0,
          });
          if (clsRes.status === 'ok' && clsRes.data) {
            const { rows } = clsRes.data;
            let allDates: any[] = [];
            if (rows?.length) {
              homeInfo.courseSchedule = [].map.call(
                rows,
                (val: { KHBJSJId: string; DATA: string }) => {
                  const { KHBJSJId, DATA } = val;
                  const days = JSON.parse(DATA);
                  const clsArr = weekSchedule?.filter((value: any) => value.KHBJSJ.id === KHBJSJId);
                  allDates = allDates.concat(days);
                  const classType = yxkc.find((v) => v.id === KHBJSJId)?.BJLX;
                  return {
                    KHBJSJId,
                    classType,
                    days,
                    detail: converClassInfo(clsArr),
                  };
                },
              );
            }
            homeInfo.markDays = uniqueArr(allDates);
            homeInfo.markDays?.sort(
              (a, b) =>
                new Date(a.date.replace(/-/g, '/')).getTime() -
                new Date(b.date.replace(/-/g, '/')).getTime(),
            );
          }
        }
        homeInfo.data = {
          xnxqId: result.current.id,
          courseStatus,
          yxkc,
          weekSchedule,
          bmkssj,
          bmjssj,
          skkssj,
          skjssj,
          ...rest,
        };
      }
    } else {
      // enHenceMsg(res.message);
      homeInfo.data = {
        courseStatus,
      };
    }
  } else {
    homeInfo.data = {
      courseStatus,
    };
  }
};
/**
 * 移动端首页获取数据处理
 * @param type 类属教师还是学生 'teacher'|'student'
 * @param xxId 学校ID
 * @param userId 用户ID
 * @param njId 学生用户年级ID
 * @param bjId 学生用户班级ID
 * @param refresh 是否需要更新接口重新获取数据
 * @returns
 */
export const ParentHomeData = async (
  type: string,
  xxId: string,
  userId: string,
  njId?: string,
  bjId?: string,
  XQSJId?: string,
  refresh?: boolean,
) => {
  if (typeof homeInfo === 'undefined') {
    ((w) => {
      // eslint-disable-next-line no-param-reassign
      w.homeInfo = {};
    })(window as Window & typeof globalThis & { homeInfo: any });
  }

  if (!homeInfo.data || refresh) {
    await getHomeData(type, xxId, userId, njId, bjId, XQSJId);
    return homeInfo;
  }

  return homeInfo;
};
/**
 * 根据每天的调代课，请假等特殊情况处理今日课程数据
 * @param newData
 * @param oriData
 * @param type
 */
const CountCurdayCourse = (newData: any[], oriData: any[], status: string) => {
  newData.forEach((ele: any) => {
    // 通过bjId,jcId确认原有数据中是否与已代课数据重合
    const oriInd = oriData.findIndex((v: { bjId: any; jcId: any }) => {
      const con1 = ele.SKJC?.id === v.jcId || ele.TKJC?.id === v.jcId;
      return ele.KHBJSJId === v.bjId && con1;
    });

    // 如果数据重合则增加原有数据的相关代课状态,否则在数组中追加相关已代课数据
    if (oriInd !== -1) {
      if (oriData?.[oriInd]?.status && oriData[oriInd].status === '已请假') {
        oriData[oriInd].status = `班主任已请假`;
      } else {
        oriData[oriInd].status = status;
        oriData[oriInd].otherInfo = ele;
      }
    } else if (status !== '已请假' && status !== '申请代课' && status !== '申请调课') {
      if (status === '自选课') {
        oriData.push({
          title: ele.KHBJSJ?.KHKCSJ?.KCMC,
          bjId: ele.KHBJSJId,
          jcId: ele.XXSJPZId,
          fjId: ele.TKFJId,
          BJMC: ele.KHBJSJ?.BJMC,
          img: ele.KHBJSJ?.KHKCSJ?.KCTP,
          address: ele?.SKFJ?.FJMC,
          date: ele.RQ,
          start: ele.KSSJ || ele.XXSJPZ?.KSSJ?.substring?.(0, 5),
          end: ele.JSSJ || ele.XXSJPZ?.JSSJ?.substring?.(0, 5),
          status,
        });
      } else {
        const kssj =
          ele.LX === 0 ? ele.TKJC?.KSSJ?.substring(0, 5) : ele.SKJC?.KSSJ?.substring(0, 5);
        const jssj =
          ele.LX === 0 ? ele.TKJC?.JSSJ?.substring(0, 5) : ele.SKJC?.JSSJ?.substring(0, 5);
        oriData.push({
          title: ele.KHBJSJ.KHKCSJ.KCMC,
          bjId: ele.KHBJSJId,
          jcId: ele.XXSJPZId,
          fjId: ele.TKFJId,
          BJMC: ele.KHBJSJ.BJMC,
          img: ele.KHBJSJ.KHKCSJ.KCTP,
          address: ele.LX === 0 ? ele.TKFJ.FJMC : ele.SKFJ.FJMC,
          date: ele.SKRQ,
          start: ele.KSSJ || kssj,
          end: ele.JSSJ || jssj,
          status,
        });
      }
    }
  });
};
/**
 * 针对首页中今日课程做部分处理
 * @param type 类属教师还是学生 'teacher'|'student'
 * @param xxId 学校ID
 * @param userId 用户ID
 * @returns
 */
export const CurdayCourse = async (
  type?: string,
  xxId?: string,
  userId?: string,
  curDay?: string,
  njId?: string,
  bjId?: string,
  XQSJId?: string,
) => {
  let data = [];
  let total: any = {};
  const day = curDay ? new Date(curDay.replace(/-/g, '/')) : new Date(); // 获取当前的时间
  const myDate = curDay || dayjs().format('YYYY-MM-DD');
  // 获取已经处理过的课程安排数据
  if (typeof homeInfo === 'undefined' && type && xxId && userId) {
    const res = await ParentHomeData(type, xxId, userId, njId, bjId, XQSJId);
    data = res.courseSchedule;
    total = res.data;
  } else if (homeInfo && homeInfo?.courseSchedule) {
    data = homeInfo.courseSchedule;
    total = homeInfo.data;
  }
  // 找出今日课程
  const totalList = data?.filter((item: { days: any[] }) => {
    return item.days.find((v: { day: string }) => v.day === myDate);
  });
  let courseList: any[] = [];
  totalList?.forEach((item: { detail: any[]; classType: number; days?: any[] }) => {
    const { detail, classType, days } = item;
    // 获取今日上课课程
    const list = detail.filter((val) => val.wkd === day.getDay());
    const dayList = days?.filter((v: { day: string }) => v.day === myDate);
    if (list?.length) {
      const newArr = [].map.call(list, (val: { jcId: string }) => {
        const currentDay = dayList?.find((v: { jcId: string }) => v.jcId === val.jcId);
        if (currentDay) {
          const { jcId, status, tag, reason, realDate } = currentDay;
          return {
            ...val,
            status: status === '已请假' ? '班主任已请假' : status,
            tag,
            classType,
            otherInfo: {
              BZ: reason,
              TKRQ: realDate,
              XXSJPZId: jcId,
              JSSJ: currentDay?.end?.substring(0, 5),
              KSSJ: currentDay?.start?.substring(0, 5),
              TKFJ: {
                id: currentDay.room?.id,
                FJMC: currentDay.room?.name,
              },
            },
          };
        }
        return {
          ...val,
        };
      });
      courseList = [...courseList, ...newArr];
    }
  });

  // 查询今日是否存在调代课，请假的课程
  if (type === 'teacher') {
    // 教师端接口
    const response = await getTeachersApplication({
      JZGJBSJId: userId,
      startDate: myDate,
    });

    if (response?.status === 'ok' && response.data) {
      const { nowDks, nowTks, qjs, srcDks, srcTks, rls } = response.data;

      if (nowDks?.length) {
        CountCurdayCourse(nowDks, courseList, '代上课');
      }
      if (nowTks?.length) {
        CountCurdayCourse(nowTks, courseList, '调课');
      }
      if (qjs?.length) {
        CountCurdayCourse(qjs, courseList, '已请假');
      }
      if (srcDks?.length) {
        CountCurdayCourse(srcDks, courseList, '代课');
      }
      if (srcTks?.length) {
        CountCurdayCourse(srcTks, courseList, '已调课');
      }
      if (rls?.length) {
        CountCurdayCourse(rls, courseList, '自选课');
      }
    }
  }
  if (type === 'student') {
    // 家长端接口获取学生请假信息
    const res = await getAllKHXSQJ({
      QJRQ: myDate,
      QJZT: [0],
      XSJBSJId: userId,
      XNXQId: total.xnxqId,
      page: 0,
      pageSize: 0,
    });
    if (res?.status === 'ok' && res.data) {
      const todayQjs: { KHBJSJId?: string; XXSJPZId?: string }[] = [];
      res.data.rows?.forEach((val: API.KHXSQJ) => {
        val.KHQJKCs?.forEach((v) => {
          todayQjs.push({
            KHBJSJId: v.KHBJSJ?.id,
            XXSJPZId: v.XXSJPZId,
          });
        });
      });
      if (todayQjs?.length) {
        CountCurdayCourse(todayQjs, courseList, '已请假');
      }
    }
  }

  courseList?.sort((a: { start: string }, b: { start: string }) => {
    const aT = Number(a.start?.replace(/:/g, ''));
    const bT = Number(b.start?.replace(/:/g, ''));
    return aT - bT;
  });
  return {
    total,
    courseList,
  };
};
/**
 * 计算课程已学课时，
 * @param data 课程安排信息
 * @returns
 */
export const CountCourses = (data: any) => {
  const myDate = dayjs().format('YYYY/MM/DD');
  const courseData =
    data.length &&
    data.map((item: { detail: any; days: any }) => {
      const { detail, days } = item;
      const learned = days.filter((ele: { day: string }) => {
        const time = new Date(ele.day.replace(/-/g, '/')).getTime() - new Date(myDate).getTime();
        return time < 0;
      });
      return {
        id: detail?.[0]?.bjId,
        title: `${detail?.[0]?.title} 【${detail?.[0]?.BJMC}】`,
        BJMC: detail?.[0]?.BJMC,
        YXKS: learned?.length || 0,
        ZKS: detail?.[0]?.KSS,
        link: `/parent/home/courseTable?classid=${detail?.[0]?.bjId}&path=study`,
        desc: [
          {
            left: [
              `${detail.map((v: any) => {
                return `每周${'日一二三四五六'.charAt(v.wkd)} ${v.start}-${v.end}`;
              })}`,
            ],
          },
          {
            left: [`共${detail?.[0]?.KSS}课时`, `已学${learned?.length || 0}课时`],
          },
        ],
      };
    });
  return courseData;
};
/**
 * 教师课表中组装今日课程的数据
 * @param day
 * @param course
 * @returns
 */
export const convertCourse = (day: string, course: any[] = [], type?: string) => {
  const data: any[] = [];
  course?.forEach((item: any) => {
    if (type && type === 'filter') {
      if (!item.status) {
        data.push({
          status: item.status,
          title: item.title,
          BJMC: item.BJMC,
          classType: item.classType,
          img: item.img,
          link: `/teacher/home/courseDetails?classid=${item.bjId}&path=education&date=${day}`,
          start: item.start,
          end: item.end,
          bjId: item.bjId,
          desc: [
            {
              left: [`${item.start}-${item.end}  |  ${item.BJMC} `],
            },
            {
              left: [`${item.address}`],
            },
          ],
          bjid: item.bjId,
          jcId: item.jcId,
          FJId: item.fjId,
        });
      }
    } else {
      const enrollLink = {
        pathname: `/teacher/education/callTheRoll`,
        state: {
          pkId: item.pkId,
          bjId: item.bjId,
          jcId: item.jcId,
          date: item.date || day,
        },
      };
      data.push({
        status: item.status,
        title: item.title,
        BJMC: item.BJMC,
        img: item.img,
        link:
          item.status === '代上课'
            ? null
            : `/teacher/home/courseDetails?classid=${item.bjId}&path=education&date=${day}&status=${item.status}`,
        enrollLink,
        start: item.start,
        end: item.end,
        bjId: item.bjId,
        desc: [
          {
            left: [`${item.start}-${item.end}  |  ${item.BJMC} `],
          },
          {
            left: [`${item.address ? item.address : ''}`],
          },
        ],
        bjid: item.bjId,
        jcId: item.jcId,
        FJId: item.fjId,
      });
    }
  });
  return data;
};
/**
 * 学生课表中组装今日课程的数据
 * @param userId
 * @param day
 * @param course
 * @returns
 */
export const convertStuCourse = (course: any[] = [], type?: string) => {
  const data: any[] = [];
  course?.forEach((item: any) => {
    if (type && type === 'filter') {
      if (!item.status) {
        data.push({
          status: item.status,
          title: item.title,
          BJMC: item.BJMC,
          img: item.img,
          link: `/parent/home/courseTable?classid=${item.bjId}&path=study`,
          start: item.start,
          end: item.end,
          bjId: item.bjId,
          desc: [
            {
              left: [`${item.start}-${item.end}  |  ${item.BJMC} `],
            },
            {
              left: [`${item.address}`],
            },
          ],
          bjid: item.bjId,
          jcId: item.jcId,
          FJId: item.fjId,
        });
      }
    } else {
      data.push({
        status: item.status,
        title: item.title,
        BJMC: item.BJMC,
        img: item.img,
        link: `/parent/home/courseTable?classid=${item.bjId}&path=study`,
        start: item.start,
        end: item.end,
        bjId: item.bjId,
        desc: [
          {
            left: [`${item.start}-${item.end}  |  ${item.BJMC} `],
          },
          {
            left: [`${item.address}`],
          },
        ],
        bjid: item.bjId,
        jcId: item.jcId,
        FJId: item.fjId,
      });
    }
  });
  return data;
};
/**
 * 转换课程表，处理特殊情况
 * @param userId
 * @param bjId
 * @param attendance
 * @param days
 * @returns
 */
export const convertTimeTable = async (
  userId: string,
  bjId: string,
  attendance: any[],
  days: any[],
  xxId: string,
) => {
  const myDate: Date = new Date();
  const currentDate = moment(myDate).format('YYYY-MM-DD');
  const res = await getAllKHJSTDK({
    XXJBSJId: xxId,
    SKJSId: userId,
    KHBJSJId: bjId,
    ZT: [1],
  });
  const specialData = res?.data?.rows;
  const dataTable: any[] = [];
  if (days) {
    for (let i = 0; i < days.length; i += 1) {
      const ele = days[i];
      const { day, jcId } = ele;
      let status: string = '';
      let otherInfo: any;
      if (attendance?.length) {
        const curCQ = attendance.find((item) => item.CQRQ === day && item.XXSJPZId === jcId);
        if (curCQ) {
          status = curCQ?.CQZT;
        }
      }
      if (specialData?.length) {
        const curCQ = specialData.find((item: any) => item.SKRQ === day && item.SKJC?.id === jcId);
        if (curCQ) {
          status = curCQ?.LX === 1 ? '代课' : '调课';
          otherInfo = curCQ;
        }
      }
      if (!status) {
        if (new Date(day).getTime() > new Date(currentDate).getTime()) {
          status = '待上';
        }
        if (new Date(day).getTime() < new Date(currentDate).getTime()) {
          status = '缺席';
        }
        // 更新今日状态
        if (new Date(day).getTime() === new Date(currentDate).getTime()) {
          status = '今日';
        }
      }
      dataTable.push({
        ...ele,
        status,
        otherInfo,
      });
    }
  }
  return dataTable;
};
/**
 * 获取当前日期的指定本周日期
 * @param dd 日期
 * @param type 'Saturday'获取周六的日期，默认获取上周日日期
 * @returns
 */
export const getWeekday = (dd: Date, type?: string) => {
  const week = dd.getDay(); // 获取时间的星期数
  if (type === 'Saturday') {
    dd.setDate(dd.getDate() + (6 - week));
  } else {
    dd.setDate(dd.getDate() - week);
  }
  const y = dd.getFullYear();
  const m = dd.getMonth() + 1; // 获取月份
  const d = dd.getDate();
  return `${y}-${m}-${d}`;
};

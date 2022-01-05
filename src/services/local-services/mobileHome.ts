/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 11:50:45
 * @LastEditTime: 2022-01-03 14:48:15
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
import { getKCBSKSJ } from '../after-class/kcbsksj';

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
  arr?.forEach((ele: { day?: any }) => {
    const findDay = days?.find((it) => it.date === ele?.day);
    if (!findDay) {
      days.push({
        date: ele?.day,
      });
    }
  });
  return days;
};

const getFreeTime = async (KHBJSJId: string, FWBJ: any) => {
  let days: any[] = [];
  const result = await getKCBSKSJ({
    KHBJSJId: [KHBJSJId],
  });
  if (result.status === 'ok' && result.data) {
    const { rows } = result.data;
    if (rows?.length) {
      if (FWBJ && FWBJ?.length) {
        for (let i = 0; i < FWBJ?.length; i += 1) {
          const setting = FWBJ[i]?.XSFWBJ?.KHFWSJPZ;
          if (setting) {
            const { KSRQ, JSRQ } = setting;
            const startTime = moment(KSRQ, 'YYYY-MM-DD').valueOf();
            const endTime = moment(JSRQ, 'YYYY-MM-DD').valueOf();
            const curDays = rows.filter((v: any) => {
              const nowTime = moment(v.SKRQ, 'YYYY-MM-DD').valueOf();
              return startTime <= nowTime && nowTime <= endTime;
            });
            if (curDays?.length) {
              const { length } = days;
              const curArr = [].map.call(curDays, (v: API.KCBSKSJ, index: number) => {
                return {
                  index: length + index,
                  jcId: v.XXSJPZId,
                  day: v.SKRQ,
                };
              });
              days = days.concat(curArr);
            }
          }
        }
      } else {
        days = [].map.call(rows, (v: any, index) => {
          return {
            index: days.length + index,
            jcId: v.XXSJPZId,
            day: v.SKRQ,
          };
        });
      }
      return days?.sort(
        (a, b) =>
          new Date(a?.day?.replace(/-/g, '/')).getTime() -
          new Date(b?.day?.replace(/-/g, '/')).getTime(),
      );;
    }
    return days;
  }
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
        let bjIds = [].map.call(yxkc, (v: { id: string }) => {
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
            const newSech: any = [];
            if (rows?.length) {
              for (let i = 0; i < rows?.length; i += 1) {
                const { KHBJSJId, DATA } = rows[i];
                let days = JSON.parse(DATA);
                const clsArr = weekSchedule?.filter((value: any) => value.KHBJSJ.id === KHBJSJId);
                const yxTar = yxkc.find((value: any) => value.id === KHBJSJId);
                if (days?.length === 0 && clsArr?.[0]?.KHBJSJ?.ISFW === 1) {
                  days = await getFreeTime(KHBJSJId, yxTar?.XSFWKHBJs);
                  if (type === 'student') {
                    bjIds = bjIds.filter((v) => v !== KHBJSJId);
                  }
                }
                allDates = allDates.concat(days);
                const classType = yxkc.find((v: { id: any }) => v.id === KHBJSJId)?.BJLX;
                newSech.push({
                  KHBJSJId,
                  classType,
                  ISFW: clsArr?.[0]?.KHBJSJ?.ISFW === 1 || false,
                  days,
                  detail: converClassInfo(clsArr),
                });
              }
              homeInfo.courseSchedule = newSech;
            }
            homeInfo.markDays = uniqueArr(allDates);
            homeInfo.markDays?.sort(
              (a, b) =>
                new Date(a?.date?.replace(/-/g, '/')).getTime() -
                new Date(b?.date?.replace(/-/g, '/')).getTime(),
            );
          }
        }
        homeInfo.data = {
          xnxqId: result.current.id,
          courseStatus,
          yxkc,
          bjIds,
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
    let otherInd = -1;
    // 通过bjId,jcId确认原有数据中是否与已代课数据重合
    const oriInd = oriData.findIndex((v: { bjId: any; jcId: any }) => {
      const con1 = ele.SKJC?.id === v.jcId || ele.TKJC?.id === v.jcId;
      return ele.KHBJSJId === v.bjId && con1;
    });
    if (status.includes('被')) {
      // 通过bjId,jcId确认原有数据中是否与换课数据重合
      otherInd = oriData.findIndex((v: { bjId: any; jcId: any }) => {
        const con1 = ele.SKJC?.id === v.jcId || ele.TKJC?.id === v.jcId;
        return ele.DESKHBJSJId === v.bjId && con1;
      });
    }
    // 如果数据重合则增加原有数据的相关代课状态,否则在数组中追加相关已代课数据
    if (oriInd !== -1) {
      if (oriData?.[oriInd]?.status && oriData[oriInd].status === '已请假') {
        oriData[oriInd].status = `班主任已请假`;
      } else {
        oriData[oriInd].status = status;
        oriData[oriInd].otherInfo = ele;
      }
    } else if (otherInd !== -1) {
      oriData[otherInd].status = status === '被换课' ? '已换课' : '调换课';
    } else if (!ele.KHBJSJ) {
      console.log('已删除数据，无需记录');
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
      } else if (status.includes('被')) {
        oriData.push({
          title: ele.desKHBJSJ?.KHKCSJ?.KCMC,
          bjId: ele.DESKHBJSJId,
          jcId: ele.TKJC?.id,
          fjId: ele.TKFJId,
          BJMC: ele.desKHBJSJ?.BJMC,
          img: ele.desKHBJSJ?.KHKCSJ?.KCTP,
          address: ele.TKFJ?.FJMC,
          date: ele.TKRQ,
          start: ele.TKJC?.KSSJ?.substring(0, 5),
          end: ele.TKJC?.JSSJ?.substring(0, 5),
          status: status === '被换课' ? '已换课' : '调换课',
        });
      } else {
        const kssj =
          ele.LX === 0 ? ele.TKJC?.KSSJ?.substring(0, 5) : ele.SKJC?.KSSJ?.substring(0, 5);
        const jssj =
          ele.LX === 0 ? ele.TKJC?.JSSJ?.substring(0, 5) : ele.SKJC?.JSSJ?.substring(0, 5);
        oriData.push({
          title: ele.KHBJSJ?.KHKCSJ?.KCMC,
          bjId: ele.KHBJSJId,
          jcId: ele.XXSJPZId,
          fjId: ele.TKFJId,
          BJMC: ele.KHBJSJ?.BJMC,
          img: ele.KHBJSJ?.KHKCSJ?.KCTP,
          address: ele.LX === 0 ? ele.TKFJ?.FJMC : ele.SKFJ?.FJMC || ele.FJSJ?.FJMC || '',
          date: ele.SKRQ,
          start: ele.KSSJ || kssj || ele.XXSJPZ?.KSSJ?.substring(0, 5),
          end: ele.JSSJ || jssj || ele.XXSJPZ?.JSSJ?.substring(0, 5),
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
    return item?.days?.find((v: { day: string }) => v.day === myDate) || item.days?.length === 0;
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
  if (type === 'teacher' && userId) {
    // 教师端接口
    const response = await getTeachersApplication({
      JZGJBSJId: userId,
      startDate: myDate,
    });

    if (response?.status === 'ok' && response.data) {
      const { nowDks, nowTks, nowHks, nowOtherHks, qjs, srcDks, srcTks, srcHks, srcOtherHks, rls } =
        response.data;

      if (nowDks?.length) {
        CountCurdayCourse(nowDks, courseList, '代上课');
      }
      if (nowTks?.length) {
        CountCurdayCourse(nowTks, courseList, '调课');
      }
      if (nowHks?.length) {
        CountCurdayCourse(nowHks, courseList, '调换课');
      }
      if (nowOtherHks?.length) {
        CountCurdayCourse(nowOtherHks, courseList, '被调换课');
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
      if (srcHks?.length) {
        CountCurdayCourse(srcHks, courseList, '已换课');
      }
      if (srcOtherHks?.length) {
        CountCurdayCourse(srcOtherHks, courseList, '被换课');
      }
      if (rls?.length) {
        CountCurdayCourse(rls, courseList, '自选课');
      }
    }
  }
  if (type === 'student') {
    // 获取今日应上课程接口
    const response = await getKCBSKSJ({
      KHBJSJId: total?.bjIds,
      startDate: curDay,
    });
    if (response.status === 'ok' && response.data) {
      const { rows } = response.data;
      const newsList = [];
      for (let i = 0; i < (rows ? rows.length : 0); i += 1) {
        if (courseList.length > 0) {
          const same = courseList.find((v: { bjId: any; jcId: any }) => {
            return rows?.[i]?.KHBJSJId === v.bjId;
          });
          if (!same) {
            newsList.push(rows?.[i]);
          } else if (same.jcId !== rows?.[i]?.XXSJPZId) {
            newsList.push(rows?.[i]);
          }
        } else {
          newsList.push(rows?.[i]);
        }
      }
      // const newsList = rows?.filter((ele) => {
      //   if (courseList?.length) {
      //     console.log(ele.KHBJSJId);
      //     const result = courseList.find((v: { bjId: any; jcId: any }) => {
      //       return ele.KHBJSJId !== v.bjId;
      //     });

      //     return courseList.find((v: { bjId: any; jcId: any }) => {
      //       console.log('111', ele.KHBJSJId, v.bjId);

      //       if (ele.KHBJSJId === v.bjId) {
      //         console.log(ele.XXSJPZId, v.jcId, ele.XXSJPZId !== v.jcId);

      //         return ele.XXSJPZId !== v.jcId
      //       }
      //       return ele.KHBJSJId !== v.bjId;
      //     });
      //   } else {
      //     return ele;
      //   }
      // });
      if (newsList?.length) {
        CountCurdayCourse(newsList, courseList, '调课');
      }

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
      if (ele.status) {
        status = ele.status;
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
  dataTable?.sort((a: { start: string }, b: { start: string }) => {
    const aT = Number(a.start?.replace(/:/g, ''));
    const bT = Number(b.start?.replace(/:/g, ''));
    return aT - bT;
  });
  return dataTable;
};
/**
 * 获取当前日期的指定本周日期
 * @param dd 日期
 * @param type 'Saturday'获取周六的日期，默认获取上周日日期
 * @returns
 */
export const getWeekday = (now: Date, type?: string) => {
  const nowTime = now.getTime();
  const day = now.getDay();
  const oneDayTime = 24 * 60 * 60 * 1000;
  const SundayTime = day == 0 ? nowTime : nowTime - (day - 1) * oneDayTime - oneDayTime; //显示上周周日,如当天为周日显示当天
  const SaturDayTime = nowTime + (7 - day) * oneDayTime - oneDayTime; //显示本周周六
  if (type === 'Saturday') {
    return moment(SaturDayTime).format('YYYY-MM-DD');
  } else {
    return moment(SundayTime).format('YYYY-MM-DD');
  }
};
/**
 * 针对课表中中周日历的mark做部分处理
 * @param type 类属教师还是学生 'teacher'|'student'
 * @param userId 用户ID
 * @param curDay 当前日期
 * @param xsbjIds 学生在学课程IDs
 */
export const getWeekCalendar = async (
  type: string,
  userId: string,
  curDay: string,
  xsbjIds?: string[],
) => {
  // 查询本周是否存在调代课，请假,自选课的课程
  // 教师端接口
  if (type === 'teacher') {
    const response = await getTeachersApplication({
      JZGJBSJId: userId,
      startDate: getWeekday(new Date(curDay)),
      endDate: getWeekday(new Date(curDay), 'Saturday'),
    });

    if (response?.status === 'ok' && response.data) {
      const { nowDks, nowTks, qjs, srcDks, srcTks, rls, nowHks, nowOtherHks } = response.data;
      const newData = nowDks
        .concat(nowTks)
        .concat(qjs)
        .concat(srcDks)
        .concat(srcTks)
        .concat(rls)
        .concat(nowOtherHks);
      const days = [].map.call(newData, (v: { SKRQ: string; RQ: string }) => {
        return {
          day: v.SKRQ || v.RQ,
        };
      });
      if (nowHks?.length) {
        nowHks.forEach((val: { TKRQ: string }) => {
          days.push({
            day: val.TKRQ,
          });
        });
      }
      return uniqueArr(days);
    }
  }
  // 学生端接口
  if (type === 'student') {
    // 获取今日应上课程接口
    const response = await getKCBSKSJ({
      KHBJSJId: xsbjIds,
      startDate: getWeekday(new Date(curDay)),
      endDate: getWeekday(new Date(curDay), 'Saturday'),
    });
    if (response.status === 'ok' && response.data) {
      const { rows } = response.data;
      const days = [].map.call(rows, (v: { SKRQ: string }) => {
        return {
          day: v.SKRQ,
        };
      });
      return uniqueArr(days);
    }
  }
  return [];
};

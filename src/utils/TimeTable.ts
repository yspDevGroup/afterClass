/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-11-08 14:56:18
 * @LastEditTime: 2021-12-10 17:32:27
 * @LastEditors: Sissle Lynn
 */

import { upsertKHBJKSSJ } from '@/services/after-class/khbjsj';
import { getAllKHJSQJ } from '@/services/after-class/khjsqj';
import { getAllKHJSTDK } from '@/services/after-class/khjstdk';
import { getKHPKSJByBJID } from '@/services/after-class/khpksj';
import moment from 'moment';

// 定义调课，请假的特殊状态数据结构
type SpecialType = {
  status: string;
  tag: string;
  day: string;
  realDate?: string;
  start?: string;
  end?: string;
  room?: {
    id: string;
    name: string;
  };
  reason: string;
  jcId: string;
};
/**
 * 组装课程班信息
 * @param data 每天课程安排
 * @returns {}
 */

const arrangeClass = (data: API.KHPKSJ[]) => {
  const courseData = {};
  for (let k = 0; k < data?.length; k += 1) {
    const { KHBJSJ, WEEKDAY, XXSJPZ } = data[k];
    const wkd = Number(WEEKDAY);
    if (KHBJSJ && KHBJSJ.id && courseData[KHBJSJ.id]) {
      const { weekDay } = courseData[KHBJSJ.id];
      const nowWkd = weekDay[0];
      const curWkd =
        nowWkd.wkd === wkd
          ? [{ wkd, count: nowWkd.count + 1, XXSJPZId: nowWkd.XXSJPZId.concat([XXSJPZ?.id]) }]
          : weekDay.concat([
            {
              wkd,
              count: 1,
              XXSJPZId: [XXSJPZ?.id],
            },
          ]);
      courseData[KHBJSJ?.id].weekDay = curWkd;
    } else if (KHBJSJ && KHBJSJ.id) {
      courseData[KHBJSJ?.id] = {
        startDate: KHBJSJ?.KKRQ,
        sum: KHBJSJ.KSS,
        weekDay: [
          {
            wkd,
            count: 1,
            XXSJPZId: [XXSJPZ?.id],
          },
        ],
      };
    } else {
      console.log('KHBJSJ', KHBJSJ);
    }
  }
  return courseData;
};
/**
 * 组装课程班课时信息
 * @param sum 课程班总课时
 * @param weekDay 课程班周次安排
 * @param start 课程班总开始上课时间
 * @returns {}
 */
export const classTime = (
  sum: number,
  weekDay: any[],
  start: string,
  leaveData?: SpecialType[],
  switchData?: SpecialType[],
) => {
  const startDay = new Date(start);
  const days = [];
  let newSum = sum;
  let leaveNum = 0;
  while (days.length < newSum) {
    const day = new Date(startDay.getTime());
    const curDay = moment(day).format('YYYY-MM-DD');
    const w = weekDay.find((val) => val.wkd === day.getDay());
    if (w) {
      for (let i = 0; i < w.count && days.length < newSum; i += 1) {
        const jcId = w.XXSJPZId[i];
        const leaveInfo = leaveData?.find((v) => v.day === curDay && v.jcId === jcId);
        const switchInfo = switchData?.find((v) => v.day === curDay && v.jcId === jcId);
        if (leaveInfo) {
          leaveNum += 1;
          newSum += 1;
          days.push({
            ...leaveInfo,
          });
        } else if (switchInfo) {
          days.push({
            index: days.length - leaveNum,
            ...switchInfo,
          });
        } else {
          days.push({
            index: days.length - leaveNum,
            jcId: w.XXSJPZId[i],
            day: curDay,
          });
        }
      }
    }
    startDay.setTime(startDay.getTime() + 1000 * 3600 * 24);
  }
  return days;
};
/**
 * 根据课程班ID与课程班排课信息计算课程班节次表
 * @param classId
 * @param teacherId
 * @returns
 */
export const getClassDays = async (classId: string, teacherId?: string, xxId?: string) => {
  const result = await getKHPKSJByBJID({ id: classId });
  const leaveData: SpecialType[] = [];
  const switchData: SpecialType[] = [];
  if (result.status === 'ok' && result.data) {
    if (teacherId && xxId) {
      const res = await getAllKHJSQJ({
        XXJBSJId: xxId,
        KHBJSJId: classId,
        JZGJBSJId: teacherId,
        QJZT: [1],
      });
      if (res.status === 'ok') {
        const response = await getAllKHJSTDK({
          LX: [0],
          ZT: [1],
          XXJBSJId: xxId,
          KHBJSJId: classId,
          SKJSId: teacherId,
        });
        if (response.status === 'ok' && response.data) {
          const switchList = response.data.rows;
          if (switchList?.length) {
            switchList.forEach((v: any) => {
              switchData.push({
                status: '已调课',
                tag: '调',
                day: v.SKRQ,
                realDate: v.TKRQ,
                start: v.TKJC?.KSSJ,
                end: v.TKJC?.JSSJ,
                room: {
                  id: v.TKFJ?.id,
                  name: v.TKFJ?.FJMC,
                },
                reason: v.BZ,
                jcId: v.SKJC?.id,
              });
            });
          }
          if (res.data) {
            const { rows } = res.data;
            if (rows?.length) {
              rows.forEach((v: any) => {
                const leaveInfo = v.KHJSQJKCs?.[0];
                leaveData.push({
                  status: '已请假',
                  tag: '假',
                  day: leaveInfo?.QJRQ,
                  reason: v.QJYY,
                  jcId: leaveInfo?.XXSJPZ?.id,
                });
              });
            }
          }
        }
      }
    }
    const courseData = arrangeClass(result.data);
    if (courseData?.[classId]) {
      const { sum, weekDay, startDate } = courseData[classId];
      const days = classTime(sum, weekDay, startDate, leaveData, switchData);
      await upsertKHBJKSSJ({ KHBJSJId: classId, DATA: JSON.stringify(days) });
    } else {
      console.log('errorId', classId);
    }
  }
};

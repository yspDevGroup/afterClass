/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-11-08 14:56:18
 * @LastEditTime: 2022-03-30 09:39:44
 * @LastEditors: Sissle Lynn
 */

import { upsertKHBJKSSJ } from '@/services/after-class/khbjsj';
import { getAllKHJSQJ } from '@/services/after-class/khjsqj';
import { getAllKHJSTDK } from '@/services/after-class/khjstdk';
import { getKHPKSJByBJID } from '@/services/after-class/khpksj';

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
 * 根据课程班ID与课程班排课信息计算课程班节次表
 * @param classId
 * @param teacherId
 * @returns
 */
export const getClassDays = async (
  classId: string,
  teacherId?: string,
  xxId?: string,
  type?: string,
) => {
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
        const params: any = {
          LX: [0, 2],
          ZT: [1],
          XXJBSJId: xxId,
        };
        if (type === 'exchange') {
          params.DESKHBJSJId = classId;
          params.DKJSId = teacherId;
        } else {
          params.KHBJSJId = classId;
          params.SKJSId = teacherId;
        }
        const response = await getAllKHJSTDK(params);
        if (response.status === 'ok' && response.data) {
          const switchList = response.data.rows;
          if (switchList?.length) {
            switchList.forEach((v: any) => {
              switchData.push({
                status: '已调课',
                tag: '调',
                day: type === 'exchange' ? v.TKRQ : v.SKRQ,
                realDate: type === 'exchange' ? v.SKRQ : v.TKRQ,
                start: type === 'exchange' ? v.SKJC?.KSSJ : v.TKJC?.KSSJ,
                end: type === 'exchange' ? v.SKJC?.JSSJ : v.TKJC?.JSSJ,
                room: {
                  id: type === 'exchange' ? v.SKFJ?.id : v.TKFJ?.id,
                  name: type === 'exchange' ? v.SKFJ?.FJMC : v.TKFJ?.FJMC,
                },
                reason: v.BZ,
                jcId: type === 'exchange' ? v.TKJC?.id : v.SKJC?.id,
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
    const days: any[] = [];
    result.data?.forEach((value: any, idx: number) => {
      const leaveInfo = leaveData?.find((v) => v.day === value?.RQ && v.jcId === value?.XXSJPZ?.id);
      const switchInfo = switchData?.find(
        (v) => v.day === value?.RQ && v.jcId === value?.XXSJPZ?.id,
      );
      days?.push({
        index: idx,
        ...leaveInfo,
        ...switchInfo,
        day: value?.RQ,
        jcId: value?.XXSJPZ?.id,
      });
    });
    // console.log(days);
    await upsertKHBJKSSJ({ KHBJSJId: classId, DATA: JSON.stringify(days) });
  }
};

/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-23 17:49:54
 * @LastEditTime: 2021-10-14 21:14:26
 * @LastEditors: zpl
 */
import type { SchoolEvent } from '@/components/Calendar/data';

export const ConvertEvent = (data: API.KHXKSJ[]) => {
  const list: SchoolEvent[] = [];
  for (const item of data) {
    list.push({
      id: item.JZGJBSJId,
      title: item.JZGJBSJ?.XM || '',
      wechatUserId: item.JZGJBSJ?.WechatUserId,
      range: [item.RQ!],
    });
  }
  return list;
};
export const RevertEvent = (data: SchoolEvent[]) => {
  const values = [].map.call(data, (item: SchoolEvent) => {
    return item.id;
  });
  return values;
};

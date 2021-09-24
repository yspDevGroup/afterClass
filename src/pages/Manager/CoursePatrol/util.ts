/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-23 17:49:54
 * @LastEditTime: 2021-09-24 12:26:18
 * @LastEditors: Sissle Lynn
 */
import { SchoolEvent } from "@/components/Calendar/data";

export const ConvertEvent = (data: API.KHXKSJ[]) => {
  const list: SchoolEvent[] = [];
  for (let item of data) {
    list.push({
      id: item.KHJSSJId,
      title: item.KHJSSJ?.XM!,
      range: [item.RQ!]
    })
  }
  return list;
};
export const RevertEvent = (data: SchoolEvent[]) => {

  const values = [].map.call(data, (item: SchoolEvent) => {
    return item.id;
  });
  return values;
};

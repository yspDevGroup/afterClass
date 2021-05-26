/*
 * @,@Author: ,: your name
 * @,@Date: ,: 2021-05-24 15:20:59
 * @,@LastEditTime: ,: 2021-05-25 14:52:31
 * @,@LastEditors: ,: your name
 * @,@Description: ,: In User Settings Edit
 * @,@FilePath: ,: \afterClass\src\pages\Manager\BasicalSettings\RoomManagement\mock.ts
 */
import type { DataSourceType, RoomItem } from './data';

export const listData: RoomItem[] = [
  {
    id: '7835u-uedejn2-792hs7481',
    FJMC: '音乐教室',
    FJBH: '301',
    FJLX: '多媒体教室',
    XQSJ: {
      XQMC: '雁塔校区雁塔校区雁塔校区雁塔校区'
    },
    FJRS: 40,
    BZ: '雁塔校区一号教学楼3楼',
  },
];

export const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    decs: '这是电脑教室',
    state: '多媒体教室',
  },
  {
    id: 624691229,
    decs: '这是阶梯教室',
    state: '阶梯教室',
  },
];
/*
 * @description:
 * @author: txx
 * @Date: 2021-06-07 12:10:01
 * @LastEditTime: 2021-09-22 18:47:28
 * @LastEditors: Sissle Lynn
 */
import { DisplayColumnItem } from '../data';

export type IiconTextData = {
  hidden?: boolean;
  title?: string;
  type?: "icon" | "img";
  isheader?: boolean;
  grid?: {
    gutter?: number,
    column?: number,
  }
  dataSource?: DisplayColumnItem[];
   /** 是否有背景色及徽标点 */
   totil?: boolean;
   exteraLink?: any;
   parentLink?: any[];
   bjid?: string;
}

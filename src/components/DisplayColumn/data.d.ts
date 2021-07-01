/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-07 12:10:01
 * @LastEditTime: 2021-06-18 15:47:58
 * @LastEditors: txx
 */
export type IiconTextData = {
  hidden?: boolean;
  title?: string;
  type?: "icon" | "img";
  isheader?: boolean;
  grid?: {
    gutter?: number,
    column?: number,
  }
  dataSource?: {
    text?: string;
    icon?: any;
    img?: string;
    link?: string;
    background?: string;
    fontSize?: string; /** 我的订单中数量决定徽标点是否展示 */
    count?: ReactNode;
    key?: string;
 }[];
   /** 是否有背景色及徽标点 */
   totil?: boolean;
   exteraLink?: any;
}

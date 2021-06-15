/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-07 12:10:01
 * @LastEditTime: 2021-06-07 15:44:54
 * @LastEditors: txx
 */
export type IiconTextData = {
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
    fontSize?: string;
  }[];
}

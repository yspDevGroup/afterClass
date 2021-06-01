/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-31 17:06:32
 * @LastEditTime: 2021-05-31 17:06:33
 * @LastEditors: txx
 */
export type IListCom = {
  data?: {
    img?: string;
    imgWidth?: number;
    imgHeight?: number;
    alt?: string;
    title?: string;
    titleHref?: string;
    two?: string;
    three?: string;
  }[]
  isImg?: boolean;
  layout?: "vertical" | "horizontal";
}
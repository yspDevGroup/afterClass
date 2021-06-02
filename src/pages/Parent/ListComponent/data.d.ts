/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-01 17:45:37
 * @LastEditTime: 2021-06-02 14:37:46
 * @LastEditors: txx
 */
export type IListmock = {
  type?: "header" | "headerTab" | "tabs" | "verticalList" | "horizontalList" | "cardList";
  headerdata?: {
    key?: string;
    title?: string;
    jump?: string;
    href?: string;
  };
  headerTabdata?: {
    key?: string;
    tabText?: string;
  }[];
  tabsdata?: {
    key?: string;
    tabs?: string;
  }[];
  verticalListdata?: {
    key?: string;
    img?: string;
    imgWidth?: string;
    imgHeight?: string;
    alt?: string;
    title?: string;
    openTime?: string;
    totalClassTime?: string;
    href?: string;
  }[];
  horizontalListdata?: {
    key?: string;
    horizontalListText?: string;
    href?: string;
  }[];
  cardListdata?: {
    key?: string;
    courseName?: string;
    state?: string;
    howLong?: string;
    address?: string;
    RemainingClassTime?: string;
    href?: string;
    backgroundColor?: string;
  };
  isImg: boolean;
}


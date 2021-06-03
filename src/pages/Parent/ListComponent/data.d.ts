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

export type ListItem = {
  id?: string; // udid
  title: string; // 标题
  link?: string;  // 链接
  titleRight?: string;  // 标题右边显示信息
  desc?: {
    left: string[];
    right?: string;
  }[];  // 摘要信息（左右分布）
  img?: string; // 缩略图地址
};
type ListType = 'list' | 'picList' | 'descList';
export type ListData = {
  type?: ListType;
  header?: {
    title: string;
    link?: string;
    moreText?: string;
  },
  list: ListItem[];
};
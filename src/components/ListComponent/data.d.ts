/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-01 17:45:37
 * @LastEditTime: 2021-06-08 17:37:02
 * @LastEditors: txx
 */

export type ListItem = {
  id?: string; // udid
  title: string; // 标题
  link?: string;  // 链接
  titleRight?: {
    text?: string;
    color?: string;
  };  // 标题右边显示信息
  desc?: {
    left: string[];
    right?: string | ReactDOM;
  }[];  // 摘要信息（左右分布）
  img?: string; // 缩略图地址
  introduction?: string; // 课程详情
  price?: string; // 课程价格
};
// 无图片仅左边描述列表 | 图片描述列表 | 无图片左右两边描述列表 | 一行有左右两边的列表 | 一行中仅有左边的列表
type ListType = 'list' | 'picList' | 'descList' | 'onlyList' | 'onlyLeftList';
export type ListData = {
  type: ListType;
  cls?: string; // 组件自定义类名
  header?: {
    title: string;
    link?: string;
    moreText?: string;
  },
  list: ListItem[];
  noDataText?: string;
};
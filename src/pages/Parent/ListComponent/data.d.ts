/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-01 17:45:37
 * @LastEditTime: 2021-06-01 18:00:50
 * @LastEditors: txx
 */
type IListmock = {
  type?: "header" | "headerTab" | "tabs" | "verticalList" | "horizontalList" | "cardList";
  data?: {
    title?: string;
    jump?: string;
    href?: string;
    tabOne?: string;
    tabTwo?: string;
    tabThree?: string;
    tabFour?: string;
    img?: string;
    openTime?: string;
    totalClassTime?: string;
    horizontalListText?: string;
    courseName?: string;
    state?: string;
    howLong?: string;
    address?: string;
    RemainingClassTime?: string;
    backgroundColor?: string;
  }[];

}
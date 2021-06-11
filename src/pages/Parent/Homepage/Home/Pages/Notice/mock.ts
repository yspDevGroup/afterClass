import type { ListData } from "@/components/ListComponent/data";
/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-09 12:01:52
 * @LastEditTime: 2021-06-11 10:07:39
 * @LastEditors: txx
 */



export const mock: ListData = {
  type: 'onlyList',
  cls: 'onlyOneList',
  list: [
    {
      title: '本校户籍生现场材料审核公告',
      link: "/parent/home/notice/details",
      titleRight: {
        text: '2020-06-04',
      },
    },
    {
      title: '我校被评为“2020年度家校合作示范学校”',
      link: "/parent/home/notice/details2",
      titleRight: {
        text: '2020-06-04',
      },
    },
    {
      title: '我校承办了西安市小学智慧课堂观摩研讨活动',
      link: "/parent/home/notice/details3",
      titleRight: {
        text: '2020-06-04',
      },
    },
    
  ]
}

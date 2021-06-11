import type { ListData } from "@/components/ListComponent/data";
/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-09 12:01:52
 * @LastEditTime: 2021-06-11 16:47:24
 * @LastEditors: txx
 */



export const mock: ListData = {
  type: 'onlyList',
  cls: 'onlyOneList',
  list: [
    {
      title: '本校户籍生现场材料审核公告',
      link: "/parent/home/notice/details?listpage=page1",
      titleRight: {
        text: '2021-05-10',
      },
    },
    {
      title: '我校被评为“2020年度家校合作示范学校”',
      link: "/parent/home/notice/details?listpage=page2",
      titleRight: {
        text: '2021-04-30',
      },
    },
    {
      title: '我校承办了西安市小学智慧课堂观摩研讨活动',
      link: "/parent/home/notice/details?listpage=page3",
      titleRight: {
        text: '2021-04-15',
      },
    },
    
  ]
}

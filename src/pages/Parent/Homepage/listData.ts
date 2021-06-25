import type { ListData } from "@/components/ListComponent/data";

// 公告栏数据
export const noticData: ListData = {
  type: 'onlyLeftList',
  cls: 'onlyOneList',
  header: {
    title: '公示栏',
    moreText: '全部 >',
    link: '/parent/home/notice'
  },
  list: [
    {
      title: '本校户籍生现场材料审核公告',
      link: "/parent/home/notice/details?listpage=page1",
    },
    {
      title: '我校被评为“2020年度家校合作示范学校”',
      link: "/parent/home/notice/details?listpage=page2",
    },
    {
      title: '我校承办了西安市小学智慧课堂观摩研讨活动',
      link: "/parent/home/notice/details?listpage=page3",
    },
  ],
  noDataText: '暂无通知公告',
};
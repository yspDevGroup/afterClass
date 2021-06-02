/*
 * @description:
 * @author: txx
 * @Date: 2021-05-31 17:17:34
 * @LastEditTime: 2021-06-02 18:04:14
 * @LastEditors: txx
 */

export const Listmock = [
  {
    type: "header",
    headerdata: {
      key: "1",
      title: "公示栏",
      jump: "全部>",
      href: "https://www.baidu.com",
    },
  },
  {
    type: "headerTab",
    headerTabdata: [
      {
        key: "1",
        tabText: "开设课程",
      },
      {
        key: "2",
        tabText: "已选课程",
      },
    ],
    jump: "全部>",
    href: "https://www.baidu.com",
  },
  {
    type: "tabs",
    tabsdata: [
      {
        key: "1",
        tabs: "文化",
      },
      {
        key: "2",
        tabs: "艺术",
      },
      {
        key: "3",
        tabs: "科技",
      },
      {
        key: "4",
        tabs: "体育",
      },
    ]
  },
  {
    type: "verticalList",
    verticalListdata: [
      {
        key: "1",
        img: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
        alt: "alt",
        title: "硬笔书法",
        content: "开设时间：2021.09.12—2021.11.20",
        subContent: "共16课时",
        href: "https://www.baidu.com",
      },
      {
        key: "2",
        img: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
        alt: "alt",
        title: "硬笔书法",
        content: "开设时间：2021.09.12—2021.11.20",
        subContent: "共16课时",
        href: "https://www.baidu.com",
      },
      {
        key: "3",
        img: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
        alt: "alt",
        title: "硬笔书法",
        content: "开设时间：2021.09.12—2021.11.20",
        subContent: "共16课时",
        href: "https://www.baidu.com",
      },
    ]
  },
  {
    type: "horizontalList",
    horizontalListdata: [
      {
        key: "1",
        horizontalListText: "秋季开设课程相关信息及收费标准公示",
        href: "https://www.baidu.com",
      },
      {
        key: "2",
        horizontalListText: "9年级秋季开设课程公示",
        href: "https://www.baidu.com",
      },
    ],
  },
  {
    type: "cardList",
    cardListdata: [
      {
        key: "1",
        courseName: "初中部绘画艺术素描基础课",
        state: "待上课",
        howLong: "15:50—16:50 ",
        address: "｜ 本校",
        RemainingClassTime: "2时43分后开课",
        href: "https://www.baidu.com",
        backgroundColor: "rgba(69, 201, 119, 0.05);",
        stateColor: "#45C977",
      },
      {
        key: "2",
        courseName: "初中部绘画艺术水彩基础课",
        state: "已请假",
        howLong: "17:00—18:10",
        address: "｜ 本校",
        RemainingClassTime: "2时43分后开课",
        href: "https://www.baidu.com",
        backgroundColor: "rgba(252, 127, 43, 0.05)",
        stateColor: "#F6C000",
      },
    ]
  }
]

import type { ListData } from "@/components/ListComponent/data";

export const iconTextData = [
  {
    text: "请假",
    img: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
    icon: "icon-qingjia",
    link: "#",
    background: "#63B5F6",
  },
  {
    text: "课程评价",
    img: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
    icon: "icon-comlist",
    link: "#",
    background: "#F06191",
  },
  {
    text: "待定",
    img: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
    icon: "icon-todo",
    link: "#",
    background: "#FFD541",
  },
]

// 孩子课表数据
 const childlearndata: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      title: '少儿机器人',
      img: 'https://i.postimg.cc/xjFcbq1w/7.jpg',
      link: '/parent/home/courseDetails?id=7548748&type=true',
      desc: [
        {
          left: ['课程时段：2021.09.12—2021.11.20'],
        },
        {
          left: ['共16课时'],
        },
      ],
    },
  ]
};
const childlearndatae: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      title: '少儿数学辅导',
      img: 'https://i.postimg.cc/g0Pwk52r/1.webp',
      link: '/parent/home/courseDetails?id=12345678&type=true',
      desc: [
        {
          left: ['课程时段：2021.09.12—2021.11.20'],
        },
        {
          left: ['共16课时'],
        },
      ],
    },
  ]
};
const childlearndataes: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      title: '少儿跆拳道',
      img: 'https://i.postimg.cc/dtkDRv7L/5.jpg',
      link: '/parent/home/courseDetails?id=126546467&type=true',
      desc: [
        {
          left: ['课程时段：2021.09.12—2021.11.20'],
        },
        {
          left: ['共16课时'],
        },
      ],
    },
  ]
};


export const courseArr = {
  '2021-06-07': childlearndata,
  '2021-06-09': childlearndatae,
  '2021-06-10': childlearndataes,
};

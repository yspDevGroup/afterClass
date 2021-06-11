import type { ListData } from "@/components/ListComponent/data";

export const iconTextData = [
  {
    text: "课堂点名",
    img: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
    icon: "icon-qingjia",
    // link: "/",
    background: "#FF8964",
  },
  {
    text: "离校通知",
    img: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
    icon: "icon-comlist",
    // link: " ",
    background: "#7DCE81",
  },
  {
    text: "请假",
    img: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
    icon: "icon-qingjia",
    // link: "",
    background: "#2FA3FF",
  },
  {
    text: "学生评价",
    img: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
    icon: "icon-comlist",
    // link: " ",
    background: "#FFC700",
  },
];
// 我的课表数据 
const firstData: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      title: '儿童体能训练',
      img: 'https://i.postimg.cc/Jzjngq58/4.jpg',
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['课程时段：2021.09.02—2021.09.20'],
        },
        {
          left: ['共16课时'],
        },
      ],
    },
    {
      title: '专业武术培训',
      img: 'https://i.postimg.cc/85Zs4zBr/2.webp',
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['课程时段：2021.09.02—2021.09.20'],
        },
        {
          left: ['共20课时'],
        },
      ],
    },
    {
      title: '儿童体能训练',
      img: 'https://i.postimg.cc/Jzjngq58/4.jpg',
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['课程时段：2021.09.02—2021.09.20'],
        },
        {
          left: ['共16课时'],
        },
      ],
    },
  ]
};

const secData: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      title: '儿童体能训练',
      img: 'https://i.postimg.cc/Jzjngq58/4.jpg',
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['课程时段：2021.09.02—2021.09.20'],
        },
        {
          left: ['共16课时'],
        },
      ],
    },
    {
      title: '专业武术培训',
      img: 'https://i.postimg.cc/85Zs4zBr/2.webp',
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['课程时段：2021.09.02—2021.09.20'],
        },
        {
          left: ['共20课时'],
        },
      ],
    },
  ]
};
const theData: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      title: '儿童体能训练',
      img: 'https://i.postimg.cc/Jzjngq58/4.jpg',
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['课程时段：2021.09.02—2021.09.20'],
        },
        {
          left: ['共16课时'],
        },
      ],
    },
    {
      title: '专业武术培训',
      img: 'https://i.postimg.cc/85Zs4zBr/2.webp',
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['课程时段：2021.09.02—2021.09.20'],
        },
        {
          left: ['共20课时'],
        },
      ],
    },
    {
      title: '儿童体能训练',
      img: 'https://i.postimg.cc/Jzjngq58/4.jpg',
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['课程时段：2021.09.02—2021.09.20'],
        },
        {
          left: ['共16课时'],
        },
      ],
    },
  ]
};
export const courseArr = {
  '2021-09-02':firstData,
  '2021-09-07':secData,
  '2021-09-09':theData,
};


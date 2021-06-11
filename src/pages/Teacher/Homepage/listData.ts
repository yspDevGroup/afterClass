import type { ListData } from "@/components/ListComponent/data";

// 公告栏数据
export const annoceData: ListData = {
  type: 'onlyLeftList',
  cls: 'onlyOneList',
  header: {
    title: '公示栏',
    moreText: '全部 >',
    link: '/parent/home/notice'
  },
  list: [
    {
      title: '秋季开设课程相关信息及收费标准公示。',
      link: '/parent/home/notice/details'
    },
    {
      title: '9年级秋季开设课程公示。',
      link: '/parent/home/notice/details'
    }
  ]
};

// 任课课程数据 
export const courseData: ListData = {
  type: 'picList',
  cls: 'picList',
  header: {
    title: '任教课程',
  },
  list: [
    {
      title: '儿童体能训练',
      img: 'https://i.postimg.cc/Jzjngq58/4.jpg',
      link: '/teacher/home/courseDetails?id=true',
      desc: [
        {
          left: ['课程时段：2021.09.12—2021.11.20'],
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
          left: ['课程时段：2021.09.12—2021.11.20'],
        },
        {
          left: ['共20课时'],
        },
      ],
    },
    {
      title: '青少年搏击',
      img: 'https://i.postimg.cc/MHXHFJd3/6.jpg',
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['课程时段：2021.09.12—2021.11.20'],
        },
        {
          left: ['共20课时'],
        },
      ],
    },
  ]
};
// 今日课程数据
export const currentData: ListData = {
  type: 'descList',
  cls: 'descList',
  header: {
    title: '今日课程',
  },
  list: [
    {
      title: '小学体能训练',
      titleRight: {
        text: "待上课",
        color: "#45C977",
      },
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['15:50—16:50','本校'],
          right: '2时43分后开课'
        },
      ],
    },
    {
      title: '专业武术培训',
      titleRight: {
        text: "已请假",
        color: "#999999",
      },
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['17:00—18:10','本校'],
        },
      ],
    },
  ]
};

// 已选数据
export const electiveData: ListData = {
  type: 'list',
  cls: 'list',
  list: [
    {
      title: '儿童体能训练',
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['每周二', '15:50—16:50', '本校'],
        },
        {
          left: ['共16课时', '已上6课时'],
        },
      ],
    },
    {
      title: '专业武术培训',
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['每周四', '15:50—16:50', '本校'],
        },
        {
          left: ['共20课时', '已上6课时'],
        },
      ],
    },
  ]
};
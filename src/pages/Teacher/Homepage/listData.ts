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
      title: '硬笔书法',
      img: 'https://i.postimg.cc/43D4nKmD/Rectangle-37.png',
      link: 'https://www.pgyer.com/',
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
      title: '硬笔书法',
      img: 'https://i.postimg.cc/43D4nKmD/Rectangle-37.png',
      link: 'https://www.pgyer.com/',
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
      title: '硬笔书法',
      img: 'https://i.postimg.cc/43D4nKmD/Rectangle-37.png',
      link: 'https://www.pgyer.com/',
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
// 今日课程数据
export const currentData: ListData = {
  type: 'descList',
  cls: 'descList',
  header: {
    title: '今日课程',
  },
  list: [
    {
      title: '初中部绘画艺术素描基础课',
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
      title: '初中部绘画艺术素描基础课',
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
// 我的课表数据 
export const myData: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      title: '硬笔书法',
      img: 'https://i.postimg.cc/43D4nKmD/Rectangle-37.png',
      link: 'https://www.pgyer.com/',
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
      title: '硬笔书法',
      img: 'https://i.postimg.cc/43D4nKmD/Rectangle-37.png',
      link: 'https://www.pgyer.com/',
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
      title: '硬笔书法',
      img: 'https://i.postimg.cc/43D4nKmD/Rectangle-37.png',
      link: 'https://www.pgyer.com/',
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
// 已选数据
export const electiveData: ListData = {
  type: 'list',
  cls: 'list',
  list: [
    {
      title: '硬笔书法',
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['每周三', '15:50—16:50', '本校'],
        },
        {
          left: ['共16课时', '已学6课时'],
        },
      ],
    },
    {
      title: '硬笔书法',
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['每周三', '15:50—16:50', '本校'],
        },
        {
          left: ['共16课时', '已学6课时'],
        },
      ],
    },
  ]
};
import type { ListData } from "@/components/ListComponent/data";

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

// 开设课程中文化数据
export const culturedata: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      title: '儿童机器人',
      img: 'https://i.postimg.cc/5t10MCsC/8.jpg',
      link: 'https://fanyi.baidu.com/?id=1',
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
      title: '少儿数学辅导',
      img: 'https://i.postimg.cc/g0Pwk52r/1.webp',
      link: 'https://fanyi.baidu.com/?id=1',
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
      title: '国际象棋',
      img: 'https://i.postimg.cc/ZKGnVg3j/2.jpg',
      link: 'https://fanyi.baidu.com/?id=1',
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
// 开设课程中艺术数据 
export const artdata: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      title: '少儿音乐课',
      img: 'https://i.postimg.cc/3RxxkH5r/11.jpg',
      link: 'https://fanyi.baidu.com/?id=1',
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
      title: '中国少儿舞',
      img: 'https://i.postimg.cc/j292V31x/3.jpg',
      link: 'https://fanyi.baidu.com/?id=1',
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
      title: '专业武术',
      img: 'https://i.postimg.cc/85Zs4zBr/2.webp',
      link: 'https://fanyi.baidu.com/?id=1',
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
// 开设课程中科技数据 
export const techdata: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      title: '少儿机器人',
      img: 'https://i.postimg.cc/xjFcbq1w/7.jpg',
      link: 'https://fanyi.baidu.com/?id=1',
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
// 开设课程中体育数据
export const sportsdata: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      title: '少儿足球',
      img: 'https://i.postimg.cc/Ss1N8tk6/10.jpg',
      link: 'https://fanyi.baidu.com/?id=1',
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
      title: '乒乓球青训',
      img: 'https://i.postimg.cc/DzgzfwNY/9.jpg',
      link: 'https://fanyi.baidu.com/?id=1',
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
      title: '少儿跆拳道',
      img: 'https://i.postimg.cc/dtkDRv7L/5.jpg',
      link: 'https://fanyi.baidu.com/?id=1',
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
export const selecteddata: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      title: '少儿机器人',
      img: 'https://i.postimg.cc/xjFcbq1w/7.jpg',
      link: 'https://fanyi.baidu.com/?id=1',
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
      title: '国际象棋',
      img: 'https://i.postimg.cc/ZKGnVg3j/2.jpg',
      link: 'https://fanyi.baidu.com/?id=1',
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
      title: '少儿跆拳道',
      img: 'https://i.postimg.cc/dtkDRv7L/5.jpg',
      link: 'https://fanyi.baidu.com/?id=1',
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
// 孩子课表数据
export const childlearndata: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      title: '少儿跆拳道',
      img: 'https://i.postimg.cc/dtkDRv7L/5.jpg',
      link: 'https://fanyi.baidu.com/?id=1',
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
// 在学数据
export const learndata: ListData = {
  type: 'list',
  cls: 'list',
  list: [
    {
      title: '少儿机器人',
      link: 'https://fanyi.baidu.com/?id=1',
      desc: [
        {
          left: ['每周一', '16:50—17:50', '本校'],
        },
        {
          left: ['共16课时', '已学3课时'],
        },
      ],
    },
    {
      title: '国际象棋',
      link: 'https://fanyi.baidu.com/?id=1',
      desc: [
        {
          left: ['每周三', '16:50—17:50', '本校'],
        },
        {
          left: ['共16课时', '已学2课时'],
        },
      ],
    },
    {
      title: '少儿跆拳道',
      link: 'https://fanyi.baidu.com/?id=1',
      desc: [
        {
          left: ['每周五', '16:50—17:50', '本校'],
        },
        {
          left: ['共16课时', '已学4课时'],
        },
      ],
    },



  ]
};
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
      title: '秋季开设课程相关信息及收费标准公示。',
      link: '/parent/home/notice/details'
    },
    {
      title: '3年级秋季开设课程公示。',
      link: '/parent/home/notice/details'
    }
  ]
};
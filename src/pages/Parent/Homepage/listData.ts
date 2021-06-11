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
      id:'123456789',
      title: '儿童机器人',
      img: 'https://i.postimg.cc/5t10MCsC/8.jpg',
      link: '/parent/home/courseDetails?id=123456789&type=true',
      desc: [
        {
          left: ['课程时段：2021.09.12—2021.11.20'],
        },
        {
          left: ['共16课时'],
        },
      ],
      introduction:'学习机器人是掌握一种永久性的技能，在培养技能的同时，学生还能逐渐养成发现问题、探索问题和解决问题的思维习惯，学会自主学习。以校内课程的形式开展机器人学习，不仅可以进一步普及和推广机器人知识，更重要的是提升了学生创新思维能力。机器人技术融合了机械原理、电子传感器、计算机软硬件及人工智能等众多先进技术，为学生能力、素质的培养承载着新的使命。 让学生了解机器人的发展和应用现状，理解机器人的概念和工作方式，为进一步学习机器人技术的有关知识打下基础。让学生了解机器人各个传感器的功能，学习编写简单的机器人控制程序，提高学生分析问题和解决问题的能力。通过机器人竞赛和完成各项任务，使学生在搭建机器人和编制程序的过程中培养动手能力、协作能力和创造能力。'
    },
    {
      id:'12345678',
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
      introduction:'实践一直是少儿数学发展的丰富源泉，数学脱离了现实就会变成“无源之水”、“无本之木”。现代少儿数学教育主张联系学生的日常生活实际，增加数学问题的趣味性，把少儿数学呈现为孩子容易接受的“教育形态”。使学生掌握知识和提高能力两方面。通过形式各样的数学过程，力图培养出儿童对数学学习的浓厚兴趣。在学习兴趣的基础上，丰富儿童的数学基础知识，培养儿童的速算、巧算能力，空间想象能力和发散思维能力，不仅使学生成为数学小天才，还使学生在潜移默化间思维得到优化、提升，即使其他课业知识也能取得优秀成绩。'
    },
    {
      id:'1234567',
      title: '国际象棋',
      img: 'https://i.postimg.cc/ZKGnVg3j/2.jpg',
      link: '/parent/home/courseDetails?id=1234567&type=true',
      desc: [
        {
          left: ['课程时段：2021.09.12—2021.11.20'],
        },
        {
          left: ['共16课时'],
        },
      ],
      introduction:'国象常青藤是中国国际象棋协会的推广机构，总部设在北京。我们学校集国象推广、棋手训练、赛事活动、师资培训等为一体的5A棋馆。我们有优雅的教学环境、先进的办学理念，完全针对性的课程设计、的师资，打造的国际象棋培训品牌。十年来在国际象棋促进青少年成长方面取得了巨大的成就与突破，从这里走出的孩子不仅仅是高水平棋手，更是高素质的杰出人才。美国常青藤系列、中国清华、北大等世界各地的高等学府均有国象常青藤学员的身影。2015年国象常青藤在沈阳成立了分馆。'
    },
  ]
};
// 开设课程中艺术数据 
export const artdata: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      id:'25554456',
      title: '少儿音乐课',
      img: 'https://i.postimg.cc/3RxxkH5r/11.jpg',
      link: '/parent/home/courseDetails?id=25554456&type=true',
      desc: [
        {
          left: ['课程时段：2021.09.12—2021.11.20'],
        },
        {
          left: ['共16课时'],
        },
      ],
      introduction:' 音乐是最容易"被感受“的艺术。它优美、动听旋律能很快引起人们的共鸣，融入我们的精神世界。通过这些美妙的音符能激发孩子们丰富情感和想象力，孩子能以自己的理解来诠释心中的音乐。启发孩子们的道德情操、净化他们的心灵、提高综合素养，使孩子们受到精神层面的教育。致力于发现孩子的天赋，挖掘孩子的潜能，为他们铺上通向艺术殿堂的小阶梯，让孩子们沐浴艺术的光芒、感受艺术的魅力，待他们羽翼丰满，护送他们的梦想启航。'
    },
    {
      id:'8487487',
      title: '中国少儿舞',
      img: 'https://i.postimg.cc/j292V31x/3.jpg',
      link: '/parent/home/courseDetails?id=8487487&type=true',
      desc: [
        {
          left: ['课程时段：2021.09.12—2021.11.20'],
        },
        {
          left: ['共16课时'],
        },
      ],
      introduction:'舞蹈于文学、音乐相伴而生，是人类历史上最早产生的艺术形式之一。它总能鲜明地反映出我们不同的思想、信仰、生活理想和审美要求。它既是供人欣赏和娱乐的艺术形式，也具有宣传教育的社会作用。让孩子们增强体质，塑造优美的身姿，培养他们的审美能力、提高他们的想象力，增强他们的自信。致力于发现孩子的天赋，挖掘孩子的潜能，为他们铺上通向艺术殿堂的小阶梯，让孩子们沐浴艺术的光芒、感受艺术的魅力，待他们羽翼丰满，护送他们的梦想启航。'
    },
    {
      id:'89415674678',
      title: '专业武术',
      img: 'https://i.postimg.cc/85Zs4zBr/2.webp',
      link: '/parent/home/courseDetails?id=89415674678&type=true',
      desc: [
        {
          left: ['课程时段：2021.09.12—2021.11.20'],
        },
        {
          left: ['共16课时'],
        },
      ],
      introduction:''
    },
  ]
};
// 开设课程中科技数据 
export const techdata: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      id:'7548748',
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
      introduction:''
    },

  ]
};
// 开设课程中体育数据
export const sportsdata: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [
    {
      id:'454576457',
      title: '少儿足球',
      img: 'https://i.postimg.cc/Ss1N8tk6/10.jpg',
      link: '/parent/home/courseDetails?id=454576457&type=true',
      desc: [
        {
          left: ['课程时段：2021.09.12—2021.11.20'],
        },
        {
          left: ['共16课时'],
        },
      ],
      introduction:''
    },
    {
      id:'984563414',
      title: '乒乓球青训',
      img: 'https://i.postimg.cc/DzgzfwNY/9.jpg',
      link: '/parent/home/courseDetails?id=984563414&type=true',
      desc: [
        {
          left: ['课程时段：2021.09.12—2021.11.20'],
        },
        {
          left: ['共16课时'],
        },
      ],
      introduction:''
    },
    {
      id:'126546467',
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
      introduction:''
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
      title: '本校户籍生现场材料审核公告',
      link: '/parent/home/notice/details'
    },
    {
      title: '我校被评为“2020年度家校合作示范学校”',
      link: '/parent/home/notice/details2'
    }
  ]
};
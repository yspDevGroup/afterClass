/*
 * @description:
 * @author: txx
 * @Date: 2021-05-31 17:17:34
 * @LastEditTime: 2021-06-03 16:47:09
 * @LastEditors: txx
 */

import type { ListData } from "./data";

export const listData: ListData = {
  type: 'picList',
  cls: 'picList',
  header: {
    title: '公示栏',
    moreText: 'more+',
    link: 'https://www.baidu.com/'
  },
  list: [
    {
      title: '秋季开设课程相关信息及收费标准公示',
      titleRight: '2020-06-04',
      img: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['开设时间：2021.09.12—2021.11.20'],
          right: '雁塔校区A座'
        },
        {
          left: ['共16课时', '已学6课时', '剩余10课时',]
        },
      ],
    },
    {
      title: '秋季开设课程相关信息及收费标准公示',
      titleRight: '2020-06-04',
      img: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
      link: 'https://www.pgyer.com/',
      desc: [
        {
          left: ['开设时间：2021.09.12—2021.11.20'],
          right: '雁塔校区A座',
        },
        {
          left: ['共16课时', '已学6课时', '剩余10课时',]
        },
      ],

    }
  ]
};
import type { statisticalType } from "./data";

export const statisticalList: statisticalType[] = [
    {
        id:'12312313',
        KC: '初中部绘画艺术素描基础课',
        data : [
            {
              type: '正常',
              value: 12,
            },
            {
              type: '异常',
              value: 1,
            },
            {
              type: '待上',
              value: 3,
            },
          ]
    },
    {
        id:'12312313',
        KC: '初中部绘画艺术素描基础课',
        data : [
            {
              type: '正常',
              value: 10,
            },
            {
              type: '异常',
              value: 1,
            },
            {
              type: '待上',
              value: 3,
            },
          ]
    },
    {
        id:'12312313',
        KC: '初中部语文基础课',
        data : [
            {
              type: '正常',
              value: 8,
            },
            {
              type: '异常',
              value: 1,
            },
            {
              type: '待上',
              value: 7,
            },
          ]
    },
  
]
export const iconTextData = [
  {
    text: "待付款",
    icon: "icon-weifukuan",
    link: "/parent/mine/order?id=1",
    background: "#F5F5F5",
    fontSize: '28px',
  },
  {
    text: "已完成",
    icon: "icon-yiwancheng",
    link: "/parent/mine/order?id=2",
    background: "#F5F5F5",
    fontSize: '28px',
  },
  {
    text: "退课退款",
    icon: "icon-tuiketuikuan",
    link: "/parent/mine/order?id=3",
    background: "#F5F5F5",
    fontSize: '28px',
  },
  {
    text: "全部订单",
    icon: "icon-quanbudingdan",
    link: "/parent/mine/order?id=4",
    background: "#F5F5F5",
    fontSize: '28px',
  },
]
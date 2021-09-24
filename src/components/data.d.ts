/*
 * @description: 组件库公共属性
 * @author: zpl
 * @Date: 2021-03-31 12:21:29
 * @LastEditTime: 2021-04-01 08:58:15
 * @LastEditors: zpl
 */
export type CompPropsType = {
  size?: 'small' | 'middle' | 'large';
  /** 数据，请自行保证组件使用数据的正确性 */
  data?: any;
  /** 动态获取数据的方法，存在data时此参数不应生效，请在组件中控制 */
  getData?: () => string | Promise<string>;
  /** 可针对各组件设置特殊配置 */
  settings?: Record<string, any>;
};

export type DisplayColumnItem = {
  text?: string;
  icon?: any;
  img?: string;
  link?: string;
  background?: string;
  fontSize?: string; /** 我的订单中数量决定徽标点是否展示 */
  count?: ReactNode;
  key?: string;
  itemType?: 'img' | 'icon';
  handleClick?: any;
}

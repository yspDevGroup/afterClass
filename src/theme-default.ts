/*
 * @description: 运行时主题配置，可在部署后实时变更
 * @author: zpl
 * @Date: 2021-03-30 10:02:36
 * @LastEditTime: 2021-06-28 11:28:31
 * @LastEditors: txx
 */
const themeColor = {
  blue: 'rgba(72, 132, 255, 1)', // 极客蓝
  navyBlue: 'rgba(36, 54, 81, 1)', // 深蓝色
  yellow: 'rgba(246, 164, 0, 1)', // 秋叶黄
  orange: 'rgba(250, 84, 28, 1)', // 朱砂橙
  red: 'rgba(235, 47, 47, 1)', // 赤焰红
};

const mainColor = themeColor.blue;

// 主题配置
export const theme: Record<string, string> = {
  primaryColor: mainColor, // 全局主色
  linkColor: 'rgba(24, 144, 255, 1)', // 链接色
  headingColor: 'rgba(34, 34, 34, 1)', // 标题色
  backgroundColorBase: 'rgba(245, 245, 245, 1)', // 默认背景色
  backgroundColorLight: 'rgba(249, 249, 249, 1)', // 标题和所选项目,表头的背景
};

// 色盘
export const colorDisk = [
  'rgba(255, 137, 100, 1)', // 图标底色-橙色
  'rgba(255, 213, 65, 1)', // 图标底色-黄色
  'rgba(218, 233, 76, 1)', // 图标底色-青色
  'rgba(125, 206, 129, 1)', // 图标底色-绿色
  'rgba(100, 213, 227, 1)', // 图标底色-浅蓝
  'rgba(99, 181, 246, 1)', // 图标底色-天空蓝
  'rgba(149, 118, 204, 1)', // 图标底色-紫色
  'rgba(240, 97, 145, 1)', // 图标底色-绯红
];

// 课程颜色
export const courseColorType: Record<string, string> = {
  DarkBlue: 'rgba(65, 78, 182, 1)', // 深蓝
  GrassGreen: 'rgba(38, 149, 0, 1)', // 草绿
  BlueGreen: 'rgba(0, 140, 128, 1)', // 蓝绿
  SkyBlue: 'rgba(64, 132, 202, 1)', // 天空蓝
  Crimson: 'rgba(234, 64, 51, 1)', // 深红
  DeepPurple: 'rgba(152, 0, 176, 1)', // 深紫
  EarthyYellow: 'rgba(203, 134, 0, 1)', // 土黄
};

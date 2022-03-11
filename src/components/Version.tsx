/*
 * @description: 版本号显示组件
 * @author: zpl
 * @Date: 2021-11-16 08:55:11
 * @LastEditTime: 2022-03-11 18:24:26
 * @LastEditors: zpl
 */
import type { CSSProperties } from 'react';

const Version = ({ style }: { style?: CSSProperties }) => {
  return <div style={style}>版本号：V2.4.0311</div>;
};

export default Version;

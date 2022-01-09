/*
 * @description: 版本号显示组件
 * @author: zpl
 * @Date: 2021-11-16 08:55:11
 * @LastEditTime: 2022-01-07 18:15:50
 * @LastEditors: zpl
 */
import React from 'react';
import type { CSSProperties } from 'react';

const Version = ({ style }: { style?: CSSProperties }) => {
  return <div style={style}>版本号：V2.3.0107</div>;
};

export default Version;

/*
 * @description: 版本号显示组件
 * @author: zpl
 * @Date: 2021-11-16 08:55:11
 * @LastEditTime: 2022-02-14 10:32:22
 * @LastEditors: zpl
 */
import React from 'react';
import type { CSSProperties } from 'react';

const Version = ({ style }: { style?: CSSProperties }) => {
  return <div style={style}>版本号：V2.3.0211</div>;
};

export default Version;

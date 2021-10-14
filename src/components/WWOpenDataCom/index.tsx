/*
 * @description: 企业微信通讯录展示组件
 * @author: zpl
 * @Date: 2021-09-17 14:41:57
 * @LastEditTime: 2021-10-14 16:55:36
 * @LastEditors: zpl
 */
import React, { useRef, useLayoutEffect } from 'react';
import type { CSSProperties } from '@umijs/renderer-react/node_modules/@types/react';

type PropsType = {
  type: 'userName' | 'departmentName';
  openid: string;
  style?: CSSProperties;
};
export default function WWOpenDataCom({ type, openid, style = {} }: PropsType) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (openid && typeof WWOpenData !== 'undefined' && WWOpenData.bind) {
      WWOpenData.bind(ref.current);
    }
  }, [openid]);
  return <ww-open-data style={{ color: '#333', ...style }} ref={ref} type={type} openid={openid} />;
}

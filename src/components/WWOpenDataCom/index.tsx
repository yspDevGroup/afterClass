/*
 * @description: 企业微信通讯录展示组件
 * @author: zpl
 * @Date: 2021-09-17 14:41:57
 * @LastEditTime: 2021-10-27 18:23:19
 * @LastEditors: zpl
 */
import React, { useRef, useLayoutEffect, useState } from 'react';
import type { CSSProperties } from '@umijs/renderer-react/node_modules/@types/react';

type PropsType = {
  type: 'userName' | 'departmentName';
  openid: string;
  style?: CSSProperties;
};
export default function WWOpenDataCom({ type, openid, style = {} }: PropsType) {
  const [showWechat, setShowWechat] = useState(true);
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (openid && typeof WWOpenData !== 'undefined' && WWOpenData.bind) {
      WWOpenData.bind(ref.current);
    } else {
      setShowWechat(false);
    }
  }, [openid]);

  if (showWechat) {
    return (
      <ww-open-data style={{ color: '#333', ...style }} ref={ref} type={type} openid={openid} />
    );
  }
  return (
    <span
      style={{
        color: '#333',
        display: 'inherit',
        maxWidth: '5em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        ...style,
      }}
    >
      {openid}
    </span>
  );
}

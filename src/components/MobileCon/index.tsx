/*
 * @description: 移动端页面容器
 * @author: zpl
 * @Date: 2022-04-19 10:09:08
 * @LastEditTime: 2022-04-19 10:30:18
 * @LastEditors: zpl
 */
import { envjudge } from '@/utils/utils';
import type { FC, ReactNode } from 'react';

const ej = envjudge();

const MobileCon: FC<{ children: ReactNode }> = (props) => {
  return (
    <div
      style={{
        margin: '0 auto',
        maxWidth: ej.endsWith('mobile') ? '100vw' : '480px',
      }}
    >
      {props.children}
    </div>
  );
};

export default MobileCon;

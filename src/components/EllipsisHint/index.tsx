/*
 * @Author: your name
 * @Date: 2021-10-25 16:46:40
 * @LastEditTime: 2021-11-17 10:01:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \afterClass_qxjyj\src\components\EllipsisHint\index.tsx
 */
import { Tooltip } from 'antd';
import styles from './index.module.less';

/**
 * 超出部分省略号显示组件
 * @param props
 * @returns
 */
const EllipsisHint = (props: { text: any; width?: string | number; twoLines?: number }) => {
  const { text, width, twoLines } = props;
  return (
    <Tooltip title={<div className={styles.father}>{text}</div>}>
      <div
        style={{ width: width || 200, WebkitLineClamp: twoLines || 1 }}
        className={styles.ellips2}
      >
        {text}
      </div>
    </Tooltip>
  );
};

export default EllipsisHint;

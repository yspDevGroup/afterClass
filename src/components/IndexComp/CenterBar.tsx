/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-01 10:53:07
 * @LastEditTime: 2021-10-18 17:21:13
 * @LastEditors: Please set LastEditors
 */
import { Col, Row } from 'antd';
import { centerNum } from './utils';

import styles from './index.less';
import { Link } from 'umi';
import { RightOutlined } from '@ant-design/icons';

const CenterBar = (props: { data: any }) => {
  const { data } = props;
  return (
    <div className={styles.topHeaders}>
      {centerNum.map((item) => {
        return < Link to={item.path}>
          <div >
            <div className={styles.lb} style={{ backgroundColor: `${item.color}` }} />
            <p title={item.title}>{item.title}</p>
            <h3>{data?.[item.type] || 0}</h3>
          </div>
        </Link>
      })}
    </div >
  );
};
export default CenterBar;

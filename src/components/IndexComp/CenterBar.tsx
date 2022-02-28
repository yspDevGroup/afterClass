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
        return <div >
          < Link to={item.path}>
            <div className={styles.lb} style={{ backgroundColor: `${item.color}` }} />
            <p title={item.title}>{item.title}</p>
            <h3>{data?.[item.type] || 0}</h3>
          </Link>
        </div>
      })}
    </div >
    // <Row gutter={[24, 24]} className={styles.topHeader}>
    //   {centerNum.map((item, index) => {
    //     return <Col span={4} key={item.title}>
    //       <Link to={item.path}>
    //         <div className={styles.centerItem}>
    //           <div className={styles.borderWrap}>
    //             <div className={styles.lb} style={{ backgroundColor: `${item.color}` }} />
    //             <p title={item.title}>{item.title} <span><RightOutlined /></span></p>
    //             <h3>{data?.[item.type] || 0}</h3>
    //           </div>
    //         </div>
    //       </Link>
    //     </Col>
    //   })}
    // </Row>
  );
};
export default CenterBar;

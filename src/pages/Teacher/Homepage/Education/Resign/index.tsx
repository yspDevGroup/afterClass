/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-12-06 09:46:54
 * @LastEditTime: 2021-12-06 15:49:46
 * @LastEditors: Sissle Lynn
 */
import React from 'react';
import { Button } from 'antd';
import { history} from 'umi';
import GoBack from '@/components/GoBack';
import styles from './index.less';

const Resign: React.FC = () => {
  return (
    <>
      <GoBack title={'教师补签'} teacher onclick="/teacher/home?index=education" />
      <div className={styles.resignList}>
        <div className={styles.listWrapper}>
          <div className={styles.card}>
            <div>
              <h3>10月考勤异常</h3>
              <p>
                <span className={styles.light}>缺卡：</span>
                <span>5次</span>
              </p>
            </div>
            <div>
              <span className={styles.light}>统计于：2021-12-16</span>
              <Button type='dashed' disabled>已逾期</Button>
              {/* <Button type='primary'>立即处理</Button> */}
            </div>
          </div>
          <div className={styles.card}>
            <div>
              <h3>11月考勤异常</h3>
              <p>
                <span className={styles.light}>缺卡：</span>
                <span>2次</span>
              </p>
            </div>
            <div>
              <span className={styles.light}>统计于：2021-12-16</span>
              <Button type='primary' onClick={()=>{
                history.replace('/teacher/education/dealAbnormal');
              }}>立即处理</Button>
            </div>
          </div>
        </div>
        {/* <div className={styles.noData}>
          <img src={noOrder} alt="" />
          <p>暂无数据</p>
        </div> */}
      </div>
    </>
  );
};

export default Resign;

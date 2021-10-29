/*
 * @description:
 * @author: wsl
 * @Date: 2021-09-04 14:33:06
 * @LastEditTime: 2021-09-04 14:37:32
 * @LastEditors: wsl
 */
import GoBack from '@/components/GoBack';
import {  Tabs } from 'antd';
import DropOut from './components/DropOut';
import ReturnService from './components/ReturnService';
import styles from './index.less';

const { TabPane } = Tabs;

const Apply = () => {

  return (
    <div className={styles.Evaluation}>
      <GoBack title={'申请退订'}  />
      <Tabs type="card">
        <TabPane tab="课程退订" key="课程退订">
         <DropOut/>
        </TabPane>
        <TabPane tab="服务退订" key="服务退订">
          <ReturnService/>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Apply;

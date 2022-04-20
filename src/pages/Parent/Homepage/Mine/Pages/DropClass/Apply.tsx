/*
 * @description:
 * @author: wsl
 * @Date: 2021-09-04 14:33:06
 * @LastEditTime: 2022-04-20 09:44:33
 * @LastEditors: Wu Zhan
 */
import GoBack from '@/components/GoBack';
import MobileCon from '@/components/MobileCon';
import { Tabs } from 'antd';
import AfterClassService from './components/AfterClassService';
import DropOut from './components/DropOut';
import ReturnService from './components/ReturnService';
import styles from './index.less';

const { TabPane } = Tabs;

const Apply = () => {
  return (
    <MobileCon>
      <div className={styles.Evaluation}>
        <GoBack title={'申请退订'} />
        <Tabs type="card">
          <TabPane tab="课后服务" key="课后服务退订">
            <AfterClassService />
          </TabPane>
          <TabPane tab="订餐&托管" key="服务退订">
            <ReturnService />
          </TabPane>
          <TabPane tab="缤纷课堂" key="课程退订">
            <DropOut />
          </TabPane>
        </Tabs>
      </div>
    </MobileCon>
  );
};

export default Apply;

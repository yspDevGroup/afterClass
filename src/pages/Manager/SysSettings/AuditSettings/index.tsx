/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-11-22 15:12:11
 * @LastEditTime: 2021-11-22 16:33:16
 * @LastEditors: Sissle Lynn
 */
import { Switch } from 'antd';
import PageContainer from '@/components/PageContainer';

import styles from './index.less';

const AuditSettings = () => {
  return (
    <PageContainer>
      <div className={styles.wrapperCard} >
        <div>
          <h3>请假流程</h3>
          <div>
            <ul>
              <li><span>教师请假</span><Switch defaultChecked /></li>
              <li><span>学生请假</span><Switch defaultChecked /></li>
            </ul>
          </div>
        </div>
        <div>
          <h3>调代课流程</h3>
          <div>
            <ul>
              <li><span>教师调课</span><Switch defaultChecked /></li>
              <li><span>教师代课</span><Switch defaultChecked /></li>
            </ul>
          </div>
        </div>
        <div>
          <h3>退课退款流程</h3>
          <div>
            <ul>
              <li><span>学生退课</span><Switch defaultChecked /></li>
              <li><span>学生退款</span><Switch defaultChecked /></li>
            </ul>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
export default AuditSettings;

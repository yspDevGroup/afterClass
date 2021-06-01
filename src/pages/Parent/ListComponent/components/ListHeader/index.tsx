/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-31 10:50:29
 * @LastEditTime: 2021-05-31 17:50:13
 * @LastEditors: txx
 */
import type { FC } from "react";
import { Tabs, } from 'antd';
import type { IListHeader } from "./type";
import styles from './index.less';

const { TabPane } = Tabs;
function callback(key: any) {
  console.log(key);
}
const data = [
  { tab: "已选课程", },
  { tab: "未选课程", }
]
const ListHeader: FC<IListHeader> = (
  {
    HeaderRightHref,
    HeaderRight
  }
) => {
  return (
    <div className={styles.ListHeaderBigBox}>
      <div className={styles.HeaderLeft}>
        <Tabs defaultActiveKey="1" onChange={callback}>
          {data.map(i => (
            <TabPane tab={i.tab} key={i.tab}>
            </TabPane>
          ))}
        </Tabs>
      </div>
      <div className={styles.HeaderRight}>
        <a href={HeaderRightHref}>
          {HeaderRight}
        </a>
      </div>
    </div>
  )

}
export default ListHeader
/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-31 15:18:58
 * @LastEditTime: 2021-05-31 16:18:01
 * @LastEditors: txx
 */
import React from 'react'
import { Tabs, } from 'antd';
import styles from "./index.less"

const { TabPane } = Tabs;
function callback(key: any) {
  console.log(key);
}
const data = [
  { tab: "文艺", content: "文艺" },
  { tab: "艺术", content: "艺术" },
  { tab: "科技", content: "科技" },
  { tab: "体育", content: "体育" }
]
const ListTabs = () => {
  return (
    <div className={styles.ListTabsBox}>
      <Tabs defaultActiveKey="1" onChange={callback}>
        {data.map(i => (
          <TabPane tab={i.tab} key={i.tab}>
            {i.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
}
export default ListTabs
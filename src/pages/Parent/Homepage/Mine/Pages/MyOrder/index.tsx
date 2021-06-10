import { Tabs } from "antd";
import React from "react";
import styles from './index.less';


const MyOrder = () => {
    const { TabPane } = Tabs;
    return (
        <div className={`${styles.tabHeader}`}>
            <Tabs defaultActiveKey="1" centered size='large'>
                <TabPane tab="全部" key="1">
                    Content of Tab Pane 1
            </TabPane>
                <TabPane tab="待付款" key="2">
                    Content of Tab Pane 2
            </TabPane>
                <TabPane tab="已完成" key="3">
                    Content of Tab Pane 3
            </TabPane>
                <TabPane tab="退可退款" key="4">
                    Content of Tab Pane 3
            </TabPane>
            </Tabs>
        </div>
    )
}

export default MyOrder
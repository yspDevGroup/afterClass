import GoBack from "@/components/GoBack";
import { Tabs } from "antd";
import { useState } from "react";
import DkApply from "./Components/DkApply";
import TkApply from "./Components/TkApply";
import styles from './index.less'

const { TabPane } = Tabs;
const Applys = () => {
  const [state, setstate] = useState('dksq');
  const onchange = (key: any) => {
    setstate(key);
  };
  return <div className={styles.Applys}>
    <GoBack title={'发起申请'} teacher />
    <Tabs type="card" activeKey={state} onChange={onchange}>
      <TabPane tab="代课申请" key="dksq">
        <DkApply setActiveKey={setstate} />
      </TabPane>
      <TabPane tab="调课申请" key="tksq">
        <TkApply setActiveKey={setstate} />
      </TabPane>
    </Tabs>
  </div>
}

export default Applys;

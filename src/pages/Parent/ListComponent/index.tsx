/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-31 10:24:05
 * @LastEditTime: 2021-06-01 16:42:04
 * @LastEditors: txx
 */

import ListHeader from "./components/ListHeader"
import ListTabs from "./components/ListTabs"
import ListCom from "./components/List"
import VerticalList from "./components/verticalList"
import styles from "./index.less"
import { data, VerticalListData } from "./mock"

const ListComp = () => {
  return (
    <div style={styles.ListComponentBigBox}>
      <ListHeader
        HeaderRight="全部>"
        HeaderTab={true}
      />
      <hr />
      <ListTabs />
      <hr />
      <ListCom
        data={data}
        isImg={true}
        layout="vertical"
      />
      <hr />
      <VerticalList
        data={VerticalListData}
      />
    </div>
  )

}
export default ListComp
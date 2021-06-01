/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-31 10:24:05
 * @LastEditTime: 2021-05-31 17:56:28
 * @LastEditors: txx
 */

import ListHeader from "./components/ListHeader"
import ListTabs from "./components/ListTabs"
import ListCom from "./components/List"
import styles from "./index.less"
import { data } from "./mock"

const ListComp = () => {
  return (
    <div style={styles.ListComponentBigBox}>
      <ListHeader
        HeaderRight="全部>"
      />
      <hr />
      <ListTabs />
      <hr />
      <ListCom
        data={data}
        isImg={true}
        layout="vertical"
      />
    </div>
  )

}
export default ListComp
/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-01 12:14:10
 * @LastEditTime: 2021-06-01 15:14:08
 * @LastEditors: txx
 */
import styles from "./index.less"
import { List } from "antd"
import type { FC } from "react"

type IVerticalList = {
  data?: {
    Left: string;
    Right: string;
    Twoleft: string;
    Tworight: string;
    color: string;
  }[]
}

const VerticalList: FC<IVerticalList> = ({ data }) => {
  return (
    <div className={styles.ListTabsBox}>
      <List
        dataSource={data}
        renderItem={(item) => (
          <div className={styles.ListBox} style={{ background: item.color }} >
            <div className={styles.ListBoxOne}>
              <div className={styles.ListSideLeftBox}>{item.Left}</div>
              <div className={styles.ListSideRightBox}>{item.Right}</div>
            </div>
            <div className={styles.ListBoxTwo}>
              <div className={styles.ListSideLeftBox}>{item.Twoleft}</div>
              <div className={styles.ListSideRightBox}>{item.Tworight}</div>
            </div>
          </div>
        )}
      />
    </div>
  )
}
export default VerticalList
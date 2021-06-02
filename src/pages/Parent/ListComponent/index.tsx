/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-31 10:24:05
 * @LastEditTime: 2021-06-02 18:03:14
 * @LastEditors: txx
 */

import type { FC } from "react";
import type { IListmock } from "./data";
import { Tabs, List } from 'antd';
import { Listmock } from "./mock";
import styles from "./index.less";

const { TabPane } = Tabs;
function callback(key: any) {
  console.log(key);
}
const ListComp: FC<IListmock> = (
  { isImg = true }
) => {
  return (
    <div className={styles.ListComponentBigBox}>
      {Listmock.map((item) => {
        const { type, href, jump, headerdata, headerTabdata, tabsdata, verticalListdata, horizontalListdata, cardListdata } = item;
        switch (type) {
          case 'header':
            return <div className={styles.ListHeader}>
              <div className={styles.ListHeaderTitle}>
                {headerdata?.title}
              </div>
              <div className={styles.ListHeaderMore}>
                <a href={headerdata?.href}>
                  {headerdata?.jump}
                </a>
              </div>
            </div>
          case 'headerTab':
            return <div className={styles.ListHeaderTab}>
              <div className={styles.ListHeaderTabLeft}>
                <Tabs defaultActiveKey="1" onChange={callback}>
                  {headerTabdata?.map((i: any) => (
                    <TabPane tab={i.tabText} key={i.key}>
                    </TabPane>
                  ))}
                </Tabs>
              </div>
              <div className={styles.ListHeaderTabRight}>
                <a href={href}>
                  {jump}
                </a>
              </div>
            </div>
          case 'tabs':
            return <div className={styles.ListTabs}>
              <Tabs defaultActiveKey="1" onChange={callback}>
                {tabsdata?.map((i: any) => (
                  <TabPane tab={i.tabs} key={i.key}>
                  </TabPane>
                ))}
              </Tabs>
            </div>
          case 'verticalList':
            return <div className={styles.Listvertical}>
              <List
                dataSource={verticalListdata}
                renderItem={(v) => (
                  <List.Item.Meta
                    avatar={isImg === true ?
                      (<img
                        width="110"
                        height="70"
                        alt={v.alt}
                        src={v.img}
                      />)
                      : ""}
                    title={<a href={v.href}>{v.title} </a>}
                    description={<div>
                      <div className={styles.OpenTime}>{v.content}</div>
                      <div className={styles.TotalHour}>{v.subContent}</div>
                    </div>}
                  />

                )}
              />
            </div>
          case 'horizontalList':
            return <div className={styles.Listhorizontal}>
              <List
                bordered={false}
                dataSource={horizontalListdata}
                renderItem={(h) => (
                  <a href={h.href}>
                    <div className={styles.ListComDiv}>
                      <span>●</span>
                      {h.horizontalListText}
                    </div>
                  </a>
                )}
              />
            </div>
          case 'cardList':
            return <List
              dataSource={cardListdata}
              renderItem={(c) => (
                <div className={styles.cardList} style={{ background: c.backgroundColor }} >
                  <div className={styles.ListBoxOne}>
                    <div className={styles.ListSideLeftBox}>
                      <a href={item.href}>
                        {c.courseName}
                      </a>
                    </div>
                    <div className={styles.ListSideRightBox} style={{ color: c.stateColor }}>
                      {c.state}
                    </div>
                  </div>
                  <div className={styles.ListBoxTwo}>
                    <div className={styles.ListSideLeftBox}>{c.howLong}{c.address}</div>
                    <div className={styles.ListSideRightBox}>{c.RemainingClassTime}</div>
                  </div>
                </div>
              )}
            />
            break;
          default:
            return <></>
        }
      })}
    </div >
  )
}
export default ListComp
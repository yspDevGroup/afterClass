/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-31 10:24:05
 * @LastEditTime: 2021-06-03 15:37:13
 * @LastEditors: txx
 */
import type { ListItem } from "./data";
import { List } from 'antd';
import { listData } from "./mock";
import styles from "./index.less";


const NewsList = (props: { data: ListItem[] }) => {
  const { data } = props;
  return <div className={styles.Listvertical}>
    <List
      dataSource={data}
      renderItem={(v) => (
        <List.Item.Meta
          avatar={v.img ? <img width="110" height="70" alt={v.title} src={v.img} /> : ''}
          title={<div className={styles.ListverticalTitleRow}>
            <div className={styles.Title} >
              <a href={v.link}>
                {v.title}
              </a>
            </div>
            <div className={styles.TitleRight}>
              {v.titleRight ?
                <span >
                  {v.titleRight}
                </span>
                : ''}
            </div>
          </div>}
          description={<>{v.desc?.map((item, index) => {
            return <div className={styles.descRow} key={`${v.title}${index.toString()}`}>
              <div className={styles.descleft}>
                {item.left.map((t, i) => {
                  return <span key={t} className={styles.descleftspan}>
                    {i === 0 ? '' : <span className={styles.descleftInspan}>|</span>}
                    {t}
                  </span>
                })}
              </div>
              <div className={styles.descright}>
                {item.right}
              </div>
            </div>
          })}</>}
        />

      )}
    />
  </div>
};
const ListComp = () => {
  const { header, list, cls } = listData;
  return (
    <div className={`${styles.ListComponentBigBox} ${cls}`}>
      {header ? <div className={styles.ListHeader}>
        <div className={styles.ListHeaderTitle}>
          {header?.title}
        </div>
        <div className={styles.ListHeaderMore}>
          <a href={header?.link}>
            {header?.moreText}
          </a>
        </div>
      </div> : ''}
      <NewsList data={list} />
    </div >
  )
}
export default ListComp
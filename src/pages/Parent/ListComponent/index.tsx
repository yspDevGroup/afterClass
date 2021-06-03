/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-31 10:24:05
 * @LastEditTime: 2021-06-02 18:03:14
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
          avatar={v.img ? <img
            width="110"
            height="70"
            alt={v.title}
            src={v.img}
          /> : ''}
          title={<div>
            <a href={v.link}>{v.title} </a>
            {v.titleRight ? <span>{v.titleRight}</span> : ''}
          </div>}
          description={<>{v.desc?.map((item, index) => {
            return <div className={styles.descRow} key={`${v.title}${index.toString()}`}>
              <div className={styles.descleft}>
                {item.left.map((t, i) => {
                  return <span key={t}>{i === 0 ? '' : <span>|</span>}{t}</span>
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
  const { header, list } = listData;
  return (
    <div className={styles.ListComponentBigBox}>
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
/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-31 10:24:05
 * @,@LastEditTime: ,: 2021-06-23 09:47:05
 * @,@LastEditors: ,: Please set LastEditors
 */

import type { ListData, ListItem, ListType } from "./data";
import { List } from 'antd';
import { Link } from "umi";
import styles from "./index.less";
import noData from '@/assets/noData.png';
import IconFont from "../CustomIcon";


const NewsList = (props: { data: ListItem[], type: ListType }) => {
  const { data, type } = props;
  return <div className={styles[type]}>
    <List
      dataSource={data}
      renderItem={(v) => (
        <Link to={v.link!}>
          <List.Item.Meta
            style={type === 'descList' ? { background: v.titleRight?.text === "待上课" ? "rgba(69, 201, 119, 0.05)" : "rgba(102, 102, 102, 0.05)" } : {}}
            // eslint-disable-next-line no-nested-ternary
            avatar={v.img ?( v.img.indexOf('http') > -1 ? <img width="110" height="70" alt={v.title} src={v.img} /> : <IconFont type="icon-zanwutupian1" style={{fontSize:'110px',height:'70px'}} />):''}
            title={<div className={styles.TitleRow}>
              <div className={styles.Title} >
                {v.title}
              </div>
              <div className={styles.TitleRight}>
                {v.titleRight ?
                  <span style={{ color: v.titleRight.text === "待上课" ? "#45C977" : "#999999" }}  >
                    {v.titleRight.text}
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
        </Link>

      )}
    />
  </div>
};
const ListComp = (props: { listData?: ListData, cls?: string,operation?: any }) => {
  if (props.listData) {
    const { header, list, type, noDataImg, noDataText, noDataIcon} = props.listData;
    const { cls } = props;
    
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
        {list && list.length ? <NewsList data={list} type={type} /> : <div className={styles.noData}>
          <img src={noDataImg || noData} alt="暂无数据" />
          <h4>{noDataIcon ? <IconFont type='icon-xiuxi' />:''}{noDataText} </h4>
        </div>}
      </div >
    )

  }
  return <></>

}
export default ListComp;
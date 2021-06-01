/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-31 16:29:08
 * @LastEditTime: 2021-06-01 12:13:21
 * @LastEditors: txx
 */
import { List } from 'antd';
import type { FC } from 'react';
import styles from "./index.less"
import type { IListCom } from "./type"

const ListCom: FC<IListCom> = ({ data, isImg, layout }) => {
  return (
    <div className={styles.ListComBox}>
      {layout === "vertical" ?
        (<List
          dataSource={data}
          renderItem={(item) => (
            <List.Item.Meta
              avatar={
                isImg === true ?
                  (<img
                    width={item.imgWidth}
                    height={item.imgHeight}
                    alt={item.alt}
                    src={item.img}
                  />)
                  : ""
              }
              title={<a href={item.titleHref}>
                {item.title}
              </a>}
              description={<div>
                <div className={styles.OpenTime}>{item.two}</div>
                <div className={styles.TotalHour}>{item.three}</div>
              </div>}
            />
          )
          }
        />)
        :
        (<div>
          <List
            bordered={false}
            dataSource={data}
            renderItem={item => (
              <div className={styles.ListComDiv}>
                <span>●</span>
                {item.title}
              </div>
            )}
          />
        </div>)
      }
    </div >
  )
}

export default ListCom

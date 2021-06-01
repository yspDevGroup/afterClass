/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-31 16:29:08
 * @LastEditTime: 2021-05-31 18:04:59
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
                <div>{item.two}</div>
                <div>{item.three}</div>
              </div>}
            />
          )
          }
        />)
        :
        (
          <div>
            <List
              bordered={false}
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  {item}
                </List.Item>
              )}
            />
          </div>
        )
      }

    </div >
  )
}

export default ListCom

/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-09 10:36:02
 * @LastEditTime: 2021-06-11 09:36:22
 * @LastEditors: txx
 */
import React from 'react'
import { mock } from "./mock"
import styles from "./index.less"

const Details3 = () => {
  return (
    <div className={styles.DetailsBox}>
      <div className={styles.title}>{mock.title}</div>
      <div className={styles.time}>发布时间：{mock.time}</div>
      <div className={styles.line}></div>
      <div className={styles.text}>
        {mock.list.map((i) => {
          return (
            <div>
              <p>{i.content}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Details3
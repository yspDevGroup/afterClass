/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-09 10:36:02
 * @LastEditTime: 2021-06-11 16:56:08
 * @LastEditors: txx
 */
import React, { useEffect, useState } from 'react'
import { Articles } from "./mock"
import styles from "./index.less"
import { getQueryString } from '@/utils/utils'



const Details = () => {
  const [content, setContent] = useState<any>();
  useEffect(() => {
    const pageId = getQueryString("listpage");

    if (pageId) {
      setContent(Articles[pageId]);
    }
  }, [])
  if (content) {

    return (
      <div className={styles.DetailsBox}>
        <div className={styles.title}>{content.title}</div>
        <div className={styles.time}>发布时间：{content.time}</div>
        <div className={styles.line}></div>
        <div className={styles.text}>
          {content.list.map((i: any) => {
            return (
              <div>
                {i.subtitle ? <h3>{i.subtitle}</h3> : ''}
                <p>{i.content}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  return ''
}

export default Details
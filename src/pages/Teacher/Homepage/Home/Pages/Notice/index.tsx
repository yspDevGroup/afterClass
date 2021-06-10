/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-09 10:32:04
 * @LastEditTime: 2021-06-09 17:38:39
 * @LastEditors: txx
 */
import React from 'react';
import ListComp from '@/components/ListComponent';
import styles from "./index.less";
import { ListData } from '@/components/ListComponent/data';
import { mock } from './mock';


const Notice = (porps: { listData?: ListData }) => {
  const { listData = mock } = porps
  return (
    <div className={styles.NoticeBox}>
      <ListComp listData={listData} />
    </div>
  )
}

export default Notice
/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-09 10:32:04
 * @LastEditTime: 2021-06-11 09:06:30
 * @LastEditors: txx
 */
import React from 'react';
import ListComp from '@/components/ListComponent';
import styles from "./index.less";
import { noticData } from "../../../listData"
import { Pagination } from 'antd';


const Notice = () => {
  return (
    <div className={styles.NoticeBox}>
      <ListComp listData={noticData} />
      <Pagination size="small" total={5} />
    </div>
  )
}

export default Notice
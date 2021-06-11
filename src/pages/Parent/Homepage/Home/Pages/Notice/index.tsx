/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-09 10:32:04
 * @LastEditTime: 2021-06-11 15:06:47
 * @LastEditors: txx
 */
import React from 'react';
import ListComp from '@/components/ListComponent';
import styles from "./index.less";
import { mock } from "./mock"
import Pagina from '../../components/Pagination/Pagination';



const Notice = () => {
  return (
    <div className={styles.NoticeBox}>
      <ListComp listData={mock} />
      <Pagina/>
    </div>
  )
}

export default Notice
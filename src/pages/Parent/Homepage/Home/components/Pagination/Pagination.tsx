/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-11 15:02:49
 * @LastEditTime: 2021-06-11 15:04:37
 * @LastEditors: txx
 */
import React from 'react'
import { Pagination } from 'antd';
import styles from "./index.less"

const Pagina = () => {
  return (
    <div className={styles.paginationBox}>
      <Pagination size="small" total={5} />
    </div>
  )
}

export default Pagina

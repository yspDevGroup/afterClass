/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-09 10:30:23
 * @LastEditTime: 2021-06-09 18:06:08
 * @LastEditors: txx
 */

import React from 'react'
import CourseTab from '../../components/CourseTab'
import type { ListData } from "@/components/ListComponent/data";
import styles from "./index.less"
import { mock } from './mock';

const Course = (porp: { listData?: ListData }) => {
  const { listData = mock } = porp
  return (
    <div className={styles.CourseBox}>
      <CourseTab
        cls={styles.courseCenterTab}
        listData={listData}
        centered={true}
      />
    </div>
  )
}

export default Course

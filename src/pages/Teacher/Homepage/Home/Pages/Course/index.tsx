/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-09 10:30:23
 * @,@LastEditTime: ,: 2021-07-12 17:16:36
 * @,@LastEditors: ,: Please set LastEditors
 */

import React from 'react'
import type { ListData } from "@/components/ListComponent/data";
import styles from "./index.less"
import { mock } from './mock';
import CourseTab from '@/pages/Parent/Homepage/Home/components/CourseTab';

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

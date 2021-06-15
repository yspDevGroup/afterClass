/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-09 10:30:23
 * @LastEditTime: 2021-06-15 16:41:49
 * @LastEditors: txx
 */

import React from 'react'
import CourseTab from '../../components/CourseTab'
import styles from "./index.less"
import { culturedata, artdata, techdata, sportsdata, selecteddata } from '../../../listData';
import Pagina from '../../components/Pagination/Pagination';

const Course = () => {
 
  return (
    <div className={styles.CourseBox}>
      <CourseTab
        cls={styles.courseCenterTab}
        cultureData = {culturedata}
        artData = {artdata}
        techData = {techdata}
        sportsData ={ sportsdata}
        selectedData = {selecteddata}
        centered={true}
      />
       <Pagina total={5}/>
    </div>
  )
}

export default Course

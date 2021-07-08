/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-26 11:20:42
 * @,@LastEditTime: ,: 2021-07-08 16:04:43
 * @,@LastEditors: ,: Please set LastEditors
 */
import React, { useContext, useEffect } from 'react'
import ListComp from '@/components/ListComponent'
import myContext from '@/utils/MyContext';
import noData from '@/assets/noCourses1.png';
import { useState } from 'react';
import moment from 'moment';

const TeachCourses = () => {
  const { yxkc } = useContext(myContext);
  const [dataSource, setDataSource] = useState<any>();
  const getDataList = (data: any) => {
    return [].map.call(data, (item: any) => {
      return {
        id: item.id,
        title: item.KHKCSJ.KCMC,
        img: item.KCTP ? item.KCTP : item.KHKCSJ.KCTP,
        link: `/teacher/home/courseDetails?classid=${item.id}&courseid=${item.KHKCSJ.id}`,
        desc: [
          {
            left: [`课程时段：${item.KKRQ ? moment(item.KKRQ).format('YYYY.MM.DD') : moment(item.KHKCSJ.KKRQ).format('YYYY.MM.DD')}-${item.JKRQ ? moment(item.JKRQ).format('YYYY.MM.DD') : moment(item.KHKCSJ.JKRQ).format('YYYY.MM.DD')}`],
          },
          {
            left: [`共${item.KSS}课时`],
          },
        ],
        introduction: item.KHKCSJ.KCMS,
      }
    })
  };
  useEffect(() => {
    const newData = {
      header: {
        title: '任教课程'
      },
      type: 'picList',
      cls: 'picList',
      list: yxkc && getDataList(yxkc) || [],
      noDataText: '暂无课程',
      noDataImg: noData
    };
    setDataSource(newData);
  }, [yxkc])
  return (
    <div style={{marginBottom:'5px'}}>
      <ListComp listData={dataSource} />
    </div>
  )
}

export default TeachCourses



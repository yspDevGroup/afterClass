/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-26 11:20:42
 * @,@LastEditTime: ,: 2021-07-02 09:50:39
 * @,@LastEditors: ,: Please set LastEditors
 */
import React, { useContext, useEffect } from 'react'
import ListComp from '@/components/ListComponent'
import myContext from '@/utils/MyContext';
import { useState } from 'react';

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
            left: [`课程时段：${item.KKRQ ? item.KKRQ : item.KHKCSJ.KKRQ}-${item.JKRQ ? item.JKRQ : item.KHKCSJ.JKRQ}`],
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
      noDataText: '暂无任课数据'
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



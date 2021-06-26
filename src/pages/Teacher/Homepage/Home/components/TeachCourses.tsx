/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-26 11:20:42
 * @LastEditTime: 2021-06-26 11:24:46
 * @LastEditors: txx
 */
import React, { useContext } from 'react'
import ListComp from '@/components/ListComponent'
import myContext from '@/utils/MyContext';

const TeachCourses = () => {
  const { rjkc } = useContext(myContext);
  return (
    <div>
      {rjkc?.map((item: any) => {
        // eslint-disable-next-line no-param-reassign
        item.yy = {
          type: 'picList',
          cls: 'picList',
          list: [
            {
              id: item.id,
              title: item.KHKCSJ.KCMC,
              img: item.KCTP ? item.KCTP : item.KHKCSJ.KCTP,
              link: `/parent/home/courseDetails?id=${item.KHKCSJ.id}&type=false`,
              desc: [
                {
                  left: [`课程时段：${item.KKRQ ? item.KKRQ : item.KHKCSJ.KKRQ}-${item.JKRQ ? item.JKRQ : item.KHKCSJ.JKRQ}`],
                },
                {
                  left: [`共${item.KSS}课时`],
                },
              ],
              introduction: item.KHKCSJ.KCMS,
            },
          ]
        }
        return <ListComp listData={item.yy} />
      })}
    </div>
  )
}

export default TeachCourses



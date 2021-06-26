/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-26 18:09:08
 * @LastEditTime: 2021-06-26 18:31:37
 * @LastEditors: txx
 */
import React, { useEffect, useState } from 'react'

const TimeRight = ({ startTimeHour, startTimeMin }: { startTimeHour: number, startTimeMin: number }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    const time = setInterval(() => {
      const day = new Date();// 获取现在的时间  eg:day Thu Jun 24 2021 18:54:38 GMT+0800 (中国标准时间)
      const nowMin = Number(day.getHours() * 60) + Number(day.getMinutes()); // 现在的总分钟
      const classMin = Number(startTimeHour * 60) + Number(startTimeMin); // 上课的总分钟
      const diff = Number(classMin - nowMin);  // 剩余总分钟
      const hour = Math.floor(diff / 60); // 剩余小时
      const min = diff % 60; // 剩余分钟
      const desRight = ` ${hour}时${min}分后开课`; // 剩余时间显示
      setText(desRight)
    }, 1000)
    return () => {
      clearInterval(time);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      {text}
    </>
  )
}

export default TimeRight

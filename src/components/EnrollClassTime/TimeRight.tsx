/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-26 18:09:08
 * @LastEditTime: 2021-06-26 18:31:37
 * @LastEditors: txx
 */
import moment from 'moment';
import React, { useEffect, useState } from 'react'

const TimeRight = (props: { startTime: string }) => {
  const { startTime } = props;
  const [text, setText] = useState('');

  const newDay = moment(new Date()).format('YYYY-MM-DD')
  const NowTime = new Date().getTime(); // 当前时间
  const startTimes = new Date(`${newDay} ${startTime}`).getTime(); // 上课开始时间
  useEffect(() => {
    const time = setInterval(() => {
      const Times = startTimes - NowTime;
      const newHour = ((Times % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString();
      const newMinute = ((Times % (1000 * 60 * 60)) / (1000 * 60)).toString();
      const hours = parseInt(newHour, 10);
      const minutes = parseInt(newMinute, 10);
      const desRight = ` ${hours}时${minutes}分后开课`; // 剩余时间显示
      setText(desRight)
    }, 1000)
    return () => {
      clearInterval(time);
    }
  }, [])
  return (
    <>
      {text}
    </>
  )
}

export default TimeRight

/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-07 15:31:43
 * @LastEditTime: 2021-06-07 17:54:28
 * @LastEditors: txx
 */
import React from 'react'
import IconTextComp from './component'
import { iconTextData } from './mock'


const icontext = () => {
  return (
    <div>
      <IconTextComp
        title="我的订单"
        type="icon"
        isheader={true}
        grid={{ column: 4 }}
        dataSource={iconTextData}
      />

    </div>
  )
}

export default icontext

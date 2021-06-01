<!--
 * @,@Author: ,: your name
 * @,@Date: ,: 2021-05-31 09:29:36
 * @,@LastEditTime: ,: 2021-06-01 08:44:19
 * @,@LastEditors: ,: your name
 * @,@Description: ,: In User Settings Edit
 * @,@FilePath: ,: \afterClass\src\components\DisplayColumn\index.md
 -->
/**  
这是一个简单的样式封装，每一层都可以自定义类名，通过val数组来解析如何渲染展示部分
*/


import DisplayColumn from "@/components/DisplayColumn"
import { PlayCircleOutlined } from "@ant-design/icons"
import React from "react";
import './index.less'


const Text=()=>{
    const val: any[] =[
        {
            type:'icon',
            content:<PlayCircleOutlined />,
            title:'ceshi'
        },
        {
            type:'img',
            text:"https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            title:'ceshi',
            valclassnam:'xx'
        },
    ]
    return(

        <>
        <DisplayColumn val={val} title='测试'/>
        </>
     
    )
}
export default Text
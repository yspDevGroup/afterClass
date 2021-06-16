/*
 * @,@Author: ,: your name
 * @,@Date: ,: 2021-06-16 15:00:14
 * @,@LastEditTime: ,: 2021-06-16 15:13:43
 * @,@LastEditors: ,: Please set LastEditors
 * @,@Description: ,: In User Settings Edit
 * @,@FilePath: ,: \afterClass\src\pages\Manager\ClassMaintenance\searchConfig.ts
 */
import type { SearchDataType } from "@/components/Search/data";

export const searchData: SearchDataType = [
  {
    label: '课程名称：',
    type: 'select',
    defaultValue: {
      first: '',
      second: ''
    },
    data: [],
  },
  {
    label: '班级名称',
    type: 'input',
    isLabel: false,
    placeHolder: '班级名称',
    data: [],
  },
];
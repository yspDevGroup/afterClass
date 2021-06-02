/*
 * @,@Author: ,: your name
 * @,@Date: ,: 2021-06-02 12:33:59
 * @,@LastEditTime: ,: 2021-06-02 14:51:12
 * @,@LastEditors: ,: Please set LastEditors
 * @,@Description: ,: In User Settings Edit
 * @,@FilePath: ,: \afterClass\src\pages\Manager\CourseManagements\serarchConfig.ts
 */
import type { SearchDataType } from "@/components/Search/data";

export const searchData: SearchDataType = [
  {
    label: '学年学期：',
    type: 'chainSelect',
    placeHolder: '请选择',
    defaultValue: {
      first: '',
      second: ''
    },
    data: [],
  },
  {
    label: '课程名称',
    type: 'input',
    isLabel: false,
    placeHolder: '课程名称',
    data: [],
  },
];
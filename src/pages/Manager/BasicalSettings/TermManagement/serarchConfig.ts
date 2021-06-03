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
  // {
  //   label: '年级：',
  //   type: 'select',
  //   placeHolder: '请选择',
  //   defaultValue: {
  //     first: ''
  //   },
  //   data: [],
  // },
  // {
  //   label: '课程名称',
  //   type: 'input',
  //   isLabel: false,
  //   placeHolder: '课程名称',
  //   data: [],
  // },
];
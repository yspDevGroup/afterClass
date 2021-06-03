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
];
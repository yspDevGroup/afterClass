/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-28 11:59:36
 * @LastEditTime: 2021-05-28 11:59:52
 * @LastEditors: txx
 */
export const dataSource = {
  itemRecourse: [
    {
      label: '学年学期：',
      type: 'chainSelect',
      placeHolder: '请选择',
    },
    {
      label: '年级：',
      type: 'select',
      placeHolder: '请选择',
      data: [
        { title: "一年级", key: "1" },
        { title: "二年级", key: "2" },
        { title: "三年级", key: "3" },
      ]
    },
    {
      label: '场地名称',
      type: 'input',
      isLabel: false,
      placeHolder: '场地名称',
    },
  ],
  chainData: {
    data: [
      { title: "2020 - 2021", key: "2020" },
      { title: "2019 - 2020", key: "2019" },
      { title: "2018 - 2019", key: "2018" },
    ],
    subData: {
      '2020': [{ title: "第一学期", key: "1" }],
      '2019': [{ title: "第一学期", key: "1" }, { title: "第二学期", key: "2" },],
      '2018': [{ title: "第一学期", key: "1" }, { title: "第二学期", key: "2" },],
    }
  }
};
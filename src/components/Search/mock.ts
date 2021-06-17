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
        { label: "一年级", value: "1" },
        { label: "二年级", value: "2" },
        { label: "三年级", value: "3" },
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
      { label: "2020 - 2021", value: "2020" },
      { label: "2019 - 2020", value: "2019" },
      { label: "2018 - 2019", value: "2018" },
    ],
    subData: {
      '2020': [{ label: "第一学期", value: "1" }],
      '2019': [{ label: "第一学期", value: "1" }, { label: "第二学期", value: "2" },],
      '2018': [{ label: "第一学期", value: "1" }, { label: "第二学期", value: "2" },],
    }
  }
};
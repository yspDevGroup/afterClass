/*
 * @description:
 * @author: zpl
 * @Date: 2021-04-23 11:48:05
 * @LastEditTime: 2021-04-23 18:20:08
 * @LastEditors: zpl
 */
import Form from './index';

const Demo1 = () => {
  const formItemLayout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12 },
  };
  const readonly = false;
  const initialValues = {
    a: '张三',
    b: '男',
  };
  const onFinish = (value: any) => {
    console.log('value', value);
  };
  const formItems = [
    {
      type: 'group',
      key: 'group1',
      groupItems: [
        {
          type: 'input',
          readonly,
          label: '姓名',
          name: 'a',
          key: 'a',
          width: 'md',
        },
        {
          type: 'radio',
          name: 'b',
          key: 'b',
          readonly,
          label: '性别',
          width: 'md',
          options: [
            {
              label: '男',
              value: '男',
            },
            {
              label: '女',
              value: '女',
            },
          ],
        },
        {
          type: 'input',
          readonly,
          name: 'c',
          key: 'c',
          label: '账号',
          width: 'md',
        },
      ],
    },
    {
      type: 'group',
      key: 'group2',
      groupItems: [
        {
          type: 'select',
          readonly,
          name: 'd',
          key: 'd',
          label: '证件类型',
          width: 'md',
          valueEnum: {},
        },
        {
          type: 'input',
          readonly,
          key: 'e',
          name: 'e',
          label: '证件号码',
          width: 'md',
        },
        {
          type: 'input',
          readonly,
          key: 'f',
          name: 'f',
          label: '个人邮箱',
          width: 'md',
        },
      ],
    },
    {
      type: 'group',
      key: 'group3',
      groupItems: [
        {
          type: 'select',
          readonly,
          key: 'g',
          name: 'g',
          label: '所属部门',
          width: 'md',
          valueEnum: {},
        },
        {
          type: 'input',
          readonly,
          key: 'h',
          name: 'h',
          label: '联系方式',
          width: 'md',
        },
        {
          type: 'date',
          readonly,
          key: 'i',
          name: 'i',
          label: '出生日期',
          width: 'md',
        },
      ],
    },
    {
      type: 'group',
      key: 'group4',
      groupItems: [
        {
          type: 'select',
          readonly,
          key: 'j',
          name: 'j',
          label: '婚姻状况',
          width: 'md',
          valueEnum: {},
        },
        {
          type: 'select',
          readonly,
          key: 'k',
          name: 'k',
          label: '政治面貌',
          width: 'md',
        },
        {
          type: 'select',
          readonly,
          key: 'l',
          name: 'l',
          label: '健康状况',
          width: 'md',
        },
      ],
    },
    {
      type: 'group',
      key: 'group5',
      groupItems: [
        {
          type: 'select',
          readonly,
          key: 'mm',
          name: 'mm',
          label: '血型',
          width: 'md',
          valueEnum: {},
        },
        {
          type: 'date',
          readonly,
          key: 'n',
          name: 'n',
          label: '参加工作年月',
          width: 'md',
        },
        {
          type: 'select',
          readonly,
          key: 'oo',
          name: 'oo',
          label: '学历',
          width: 'md',
          valueEnum: {},
        },
      ],
    },
    {
      type: 'group',
      key: 'group6',
      groupItems: [
        {
          type: 'select',
          readonly,
          key: 'm',
          name: 'm',
          label: '教职工类别',
          width: 'md',
          valueEnum: {},
        },
        {
          type: 'radio',
          readonly,
          key: 'nn',
          name: 'nn',
          label: '是否在编',
          width: 'md',
          options: [
            {
              label: '是',
              value: '是',
            },
            {
              label: '否',
              value: '否',
            },
          ],
        },
        {
          type: 'radio',
          readonly,
          key: 'o',
          name: 'o',
          label: '是否省级骨干教师',
          width: 'md',
          options: [
            {
              label: '是',
              value: '是',
            },
            {
              label: '否',
              value: '否',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      key: 'group7',
      groupItems: [
        {
          type: 'input',
          readonly,
          key: 'p',
          name: 'p',
          label: '专业技术职务',
          width: 'md',
        },
        {
          type: 'select',
          readonly,
          key: 'q',
          name: 'q',
          label: '任教学段',
          width: 'md',
          valueEnum: {},
        },
        {
          type: 'input',
          readonly,
          key: 'r',
          name: 'r',
          label: '任教课程',
          width: 'md',
        },
      ],
    },
    {
      type: 'group',
      key: 'group8',
      groupItems: [
        {
          type: 'input',
          readonly,
          key: 's',
          name: 's',
          label: '周课时数',
          width: 'md',
        },
        {
          type: 'input',
          readonly,
          key: 't',
          name: 't',
          label: '管理职务',
          width: 'md',
        },
        {
          type: 'select',
          readonly,
          key: 'uu',
          name: 'uu',
          label: '第一学历',
          width: 'md',
        },
      ],
    },
    {
      type: 'group',
      key: 'group9',
      groupItems: [
        {
          type: 'input',
          readonly,
          key: 'v',
          name: 'v',
          label: '第一学历毕业专业',
          width: 'md',
        },
        {
          type: 'input',
          readonly,
          key: 'w',
          name: 'w',
          label: '最高学历毕业专业',
          width: 'md',
        },
        {
          type: 'radio',
          readonly,
          key: 'x',
          name: 'x',
          label: '是否省级骨干教师',
          width: 'md',
          options: [
            {
              label: '是',
              value: '是',
            },
            {
              label: '否',
              value: '否',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      key: 'group10',
      groupItems: [
        {
          type: 'radio',
          readonly,
          key: 'y',
          name: 'y',
          label: '是否心理健康教育教师',
          width: 'md',
          options: [
            {
              label: '是',
              value: '是',
            },
            {
              label: '否',
              value: '否',
            },
          ],
        },
        {
          type: 'radio',
          readonly,
          key: 'z',
          name: 'z',
          label: '是否国级骨干教师',
          width: 'md',
          options: [
            {
              label: '是',
              value: '是',
            },
            {
              label: '否',
              value: '否',
            },
          ],
        },
        {
          type: 'radio',
          readonly,
          key: 'aa',
          name: 'aa',
          label: '是否省级学科带头人',
          width: 'md',
          options: [
            {
              label: '是',
              value: '是',
            },
            {
              label: '否',
              value: '否',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      key: 'group11',
      groupItems: [
        {
          type: 'radio',
          readonly,
          key: 'bb',
          name: 'bb',
          label: '是否国家级学科带头人',
          width: 'md',
          options: [
            {
              label: '是',
              value: '是',
            },
            {
              label: '否',
              value: '否',
            },
          ],
        },
        {},
        {},
      ],
    },
  ];

  return (
    <Form
      initialValues={initialValues}
      layout="horizontal"
      onFinish={onFinish}
      // setForm={setForm}
      formItems={formItems}
      formItemLayout={formItemLayout}
    />
  );
};

export default Demo1;

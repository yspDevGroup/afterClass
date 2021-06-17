/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-17 09:23:06
 * @LastEditTime: 2021-06-17 11:08:18
 * @LastEditors: txx
 */
import React from 'react';
import ProFormFields from '@/components/ProFormFields';

const SignUpTable = () => {
  // 表单项布局
  const formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };
  // 表单项字段数据
  const formItems: any[] = [
    {
      type: 'input',
      hidden: true,
      name: 'id',
      key: 'id',
    },
    {
      type: 'input',
      label: '报名名称',
      name: 'BMMC',
      key: 'BMMC',
      rules: [{ required: true, messsage: '请填写报名名称' }]
    },
    {
      type: 'date',
      label: '报名开始时间',
      name: 'BMKSSJ',
      key: 'BMKSSJ',
      width: '100%',
      rules: [{ type: 'any', required: true, messsage: '请选择报名开始时间' }],
    },
    {
      type: 'date',
      label: '报名结束时间',
      name: 'BMJSSJ',
      key: 'BMJSSJ',
      width: '100%',
      rules: [{ type: 'any', required: true, messsage: '请选择报名结束时间' }],
    },
    {
      type: 'date',
      label: '开课时间',
      name: 'KKSJ',
      key: 'KKSJ',
      width: '100%',
      rules: [{ type: 'any', required: true, messsage: '请选择开课时间' }],
    },
    {
      type: 'date',
      label: '结课时间',
      name: 'JKSJ',
      key: 'JKSJ',
      width: '100%',
      rules: [{ type: 'any', required: true, messsage: '请选择结课时间' }],
    },
  ];

  return (
    <div>
      <ProFormFields
        layout="horizontal"
        formItems={formItems}
        formItemLayout={formLayout}
      />
    </div>
  )
}

export default SignUpTable

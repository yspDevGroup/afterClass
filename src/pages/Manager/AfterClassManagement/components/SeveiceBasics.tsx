/*
 * @description:
 * @author: Wu Zhan
 * @Date: 2021-12-14 08:59:02
 * @LastEditTime: 2021-12-15 09:55:41
 * @LastEditors: Wu Zhan
 */

import React, { useState, useEffect, useRef } from 'react'
import { ModalForm } from '@ant-design/pro-form'
import { Button, message } from 'antd'
import { useModel } from 'umi';
import  { renderFormItems } from '@/components/ProFormFields';
import { getGradesByCampus } from '@/services/after-class/njsj';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getSchoolClasses } from '@/services/after-class/bjsj';
import { getAllCourses } from '@/services/after-class/khkcsj';

type ServiceBasicsType = {
  title: string,
}



const SeveiceBasics = (props: ServiceBasicsType) => {
  const { title } = props;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // const [campusId, setCampusId] = useState<string>();
  const [campusData, setCampusData] = useState<any[]>();
  const [NJData,setNJData]=useState<any[]>();
  const [XNXQData,setXNXQData]=useState<any[]>();

  //  获取校区
  const getCampusData = async () => {
    const res = await getAllXQSJ({
      XXJBSJId: currentUser?.xxId,
    });
    if (res?.status === 'ok') {
      console.log('res', res.data);
      const arr = res?.data?.map((item) => {
        return {
          label: item?.XQMC,
          value: item?.id,
        };
      });

      setCampusData(arr);
    }
  };

  // 学年学期
  const getXNXQData=async()=>{
    const res =await queryXNXQList(currentUser?.xxId)
    console.log('学年学期',res);
    const {current} =res;
    if(current){
      setXNXQData([{label:`${current?.XN} ${current?.XQ}`, value:current.id}])
    }
  }

  const formRef = useRef();

  const formLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
  };

  // 获取年级
  /**
   *
   * @param value 校区Id
   * @returns
   */
 const getNJData= async(value: string)=>{
    const res= await getGradesByCampus({
      XQSJId:value,
    })
    if(res?.status==='ok'){
      const list=res?.data?.map((item: any)=>{return {label: `${item.XD}${item.NJMC}`,value: item.id}})
      setNJData(list);

    }

  }

  const getKCData= async (njList: string[]) =>{

    // const res =await getAllCourses({
    //   njId: njList,
    //   XXJBSJId: currentUser?.xxId,
    //   XQSJId:'',
    //   XNXQId:''
    // })
  }

  // 表单所需的内容
  const formItems: any[] = [
    {
    type: 'input',
    label: '服务名称',
    name: 'FWMC',
    key: 'FWMC',
    rules: [
      { required: true, message: '请填写服务名称' },
      { max: 18, message: '最长为 18 位' },
    ],
    fieldProps: {
      autocomplete: 'off',
    },
  },
  {
    type: 'select',
    name: 'XQSJId',
    key: 'XQSJId',
    label: '所属校区:',
    rules: [{ required: true, message: '请选择所属校区' }],
    fieldProps: {
      options: campusData,
      onChange:(value: string)=>{
        console.log('onChange',value);
        getNJData(value);
      }
    },
  },
  {
    type: 'select',
    name: 'SYNJIds',
    key: 'SYNJIds',
    label: '适用年级:',
    rules: [{ required: true, message: '请选择适用年级' }],
    fieldProps: {
      options: NJData,
      mode:'multiple',
    },
  }, {
    type: 'select',
    name: 'SYXQId',
    key: 'SYXQId',
    label: '适用学期:',
    rules: [{ required: true, message: '请选择适用年级' }],
    fieldProps: {
      options: XNXQData,
    },
  }
  ,{
   type: 'uploadImage',
   name: 'TP',
   key:'TP',
   label: '服务图片',
  },
  {
    type: 'textArea',
    label: '简介：',
    rules: [{ required: true, message: '请输入班级课程安排' }],
    name: 'BJMS',
    key: 'BJMS',
    placeholder: '请输入班级课程安排',
    fieldProps:{
      autoSize:{ minRows: 3, maxRows: 5 },
      showCount:true,
      maxLength: 200,
    }
  },
  ]

  useEffect(() => {
    getCampusData();
    getXNXQData();
  }, [])

  console.log('currentUser',currentUser);


  return (
    <>
    <ModalForm<{
      name: string;
      company: string;
    }>
    formRef={formRef}
      title={title}
      trigger={
        <Button type="primary">
          新建
        </Button>
      }
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      onFinish={async (values) => {
        console.log(values.name);
        message.success('提交成功');
        return true;
      }}
      layout='horizontal'
      {...formLayout}
    >
      {renderFormItems(formItems)}
    {/* <ProFormFields
        layout='horizontal'
        formItems={formItems}
        formItemLayout={formLayout}
      /> */}
    </ModalForm>
    </>
  )
}



export default SeveiceBasics

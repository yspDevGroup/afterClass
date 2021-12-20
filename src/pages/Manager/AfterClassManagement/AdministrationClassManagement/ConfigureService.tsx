import React, { useState, useRef, useEffect } from 'react'
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form'
import { Button, Col, InputNumber, message, Row, Space, Spin } from 'antd'


import SelectCourses from '../components/SelectCourses';
import ProForm, { ProFormSwitch, ProFormSelect } from '@ant-design/pro-form';
import styles from './index.less'
import UploadImage from '@/components/ProFormFields/components/UploadImage';
import { createKHFWBJ, getKHFWBJ, updateKHFWBJ } from '@/services/after-class/khfwbj';



type ConfigureSeverType = {
  KHFWBJs: any[],
  XNXQId: string | undefined,
  // campusId: string,
  BJSJId: string,
  NJSJ: any,
}
type ModalValue={
  isTemplate: boolean,
  KCFD: any[],
  KHKC: any[],
  KXSL: number,
  FWMC: string,
  FWFY: number,
  FWMS: string,
  id?: string,
}
const ConfigureService = (props: ConfigureSeverType) => {
  const { XNXQId, BJSJId, NJSJ, KHFWBJs, } = props;
  const [isTemplate, setIsTemplate] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState('');
  const [detailValue,setDetailValue]=useState<ModalValue>()
  const formRef = useRef();
  const formLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  };

  const getDetailValue= async()=>{
   const res= await getKHFWBJ({
      BJSJId,
      XNXQId,
    })
    if( res.status==='ok'){

        const KCFD: any=[];
        const KHKC: any=[];
        const {data}= res;
        if(data){
          data?.KCFWBJs?.forEach((item: any) => {
            console.log(item)
           if(item.LX===0){
             KCFD.push({label:item?.KHBJSJ?.BJMC,value:item?.KHBJSJ?.id})
           }
           if(item?.LX===1){
             KHKC.push({label:item?.KHBJSJ?.BJMC,value:item?.KHBJSJ?.id})
           }
         });
         setDetailValue({
          isTemplate: false,
          KCFD,
          KHKC,
          KXSL: data?.KCSL,
          FWMC: data?.FWMC,
          FWFY: data?.FWFY,
          FWMS: data?.FWMS,
          id: data?.id,
         })
         if(data.FWTP){
           setImageUrl(data.FWTP);
         }
        }

      }

    }



  const imageChange = (type: string, e?: any) => {
    if (e.file.status === 'done') {
      const mas = e.file.response.message;
      if (typeof e.file.response === 'object' && e.file.response.status === 'error') {
        message.error(`上传失败，${mas}`);
      } else {
        const res = e.file.response;
        if (res.status === 'ok') {
          message.success(`上传成功`);
          setImageUrl(res.data);
        }
      }
    } else if (e.file.status === 'error') {
      const mass = e.file.response.message;
      message.error(`上传失败，${mass}`);
    }
  };



  // modal 提交
  const onFinish= async (values: ModalValue) => {
    console.log(values);

    const KHBJSJIds: any[]= [];
    // KHBJSJIds=[ { KHBJSJId: '719ac8f1-192c-4bc4-840c-0f6d065d345e', LX: 1 },{KHBJSJId: 'f0bc43eb-2d6a-40cd-a80a-82d0596443d3', LX: 0}];
    if (values?.KCFD) {
      values?.KCFD?.forEach((item: any)=>{
        KHBJSJIds.push({KHBJSJId:item.value,LX:0})
      })
    }
    if (values?.KHKC) {
      values?.KHKC?.forEach((item: any)=>{
        KHBJSJIds.push({KHBJSJId:item.value,LX:1})
      })
    }

    const params = {
      BJSJId,
      XNXQId,
      // ZT?: number;
      FWMC: values?.FWMC,
      FWTP: imageUrl,
      FWMS: values?.FWMS,
      FWFY: values?.FWFY,
      KXSL: values.KXSL,
      KHBJSJIds,
    }
    //编辑
  if(detailValue?.id){
    const res =await updateKHFWBJ({id:detailValue?.id}, {...params})
    if(res.status==='ok'){
      message.success('修改成功')
    }else{
      message.error(res.message)
    }

  }else{
    // 新增
    const res=  await createKHFWBJ(params);
    if(res.status==='ok'){
      message.success('配置成功');
    }else{
      message.error(res.message)
    }
  }

    return true;
  }

  useEffect(() => {
    if(detailValue){
      formRef?.current?.setFieldsValue(detailValue)
    }
  }, [detailValue])


  return (
    <Spin spinning={false}>
      <ModalForm<ModalValue>
        formRef={formRef}
        title={KHFWBJs?.length ? '编辑' : '配置课后服务'}
        trigger={
          <Button type="link" onClick={()=>{
            if(KHFWBJs.length){
              getDetailValue()}
          }}>
            {KHFWBJs?.length ? '编辑' : '配置课后服务'}
          </Button>
        }
        submitter={
          {
            searchConfig: {
              submitText: '保存',
              resetText: '取消',
            },

            render: (props, defaultDoms) => {
              return [
                <div className={styles.modelFooter}>
                  <span className={styles.modelTips}>

                    <Button type='primary' > 存为服务模板 </Button>
                  </span>
                  <div>
                    <Button >保存并批量报名</Button>
                    {
                      defaultDoms[1]
                    }
                    {defaultDoms[0]}
                  </div>
                </div>,
                // <Button type='primary' ghost> 存为服务模板 </Button>,
                // <Button >保存并批量报名</Button>,
                // ...defaultDoms
              ]
            }
          }
        }
        modalProps={{
          destroyOnClose: true,
          // onCancel: () => console.log('run'),
          // footer:<>

          //   <>
          //   <Button >保存并批量报名</Button>
          //   <Button type='primary'>保存</Button>
          //   <Button>取消</Button>
          //   </>
          // </>
        }}

        onFinish={onFinish }
        layout='horizontal'
        {...formLayout}
      >
        <ProFormSwitch
          name="isTemplate"
          label="引用模板："
          initialValue={isTemplate}
          fieldProps={{
            onChange: (checked: boolean) => {
              setIsTemplate(checked)
            }
          }}
        />
        {
          isTemplate &&
          <ProForm.Item label="服务模板：" wrapperCol={{ span: 20 }} >
            <Row justify='start' gutter={12}>
              <Col span={8}>
                <ProFormSelect noStyle name="text" placeholder="请选择服务模板" />
              </Col>
              <Col span={8} className={styles.ghostButton}>
                <Space>
                  <Button type='primary' ghost>更新模板</Button>
                  <Button type='primary' ghost >存为模板</Button>
                </Space>
              </Col>
            </Row>
          </ProForm.Item>
        }
        <ProFormText label='服务名称：' name='FWMC' labelCol={{span:3}} wrapperCol={{span:6}} rules={[{ required: true, message: '请选择课程班' }]} />
        <Row >
          <Col span={12}>
            <ProFormTextArea label='简介：'
              rules={
                [{ required: false, message: '请输入班级课程安排' }]
              }
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              name='FWMS'
              key='FWMS'
              placeholder='请输入班级课程安排'
              fieldProps={{
                autoSize: { minRows: 4, maxRows: 5 },
                showCount: true,
                maxLength: 200,
              }
              } />
          </Col>
          <Col span={12}>
            <ProForm.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              name='FWTP'
              key='FWTP'
              label='服务图片'>
              <UploadImage
                imageurl={imageUrl}
                upurl='/api/upload/uploadFile?type=badge&plat=agency'
                accept='.jpg, .jpeg, .png'
                imagename='image'
                handleImageChange={
                  (value: any) => {
                    imageChange('ZP', value);
                  }
                }
              />
            </ProForm.Item>
          </Col>
        </Row>

        <ProForm.Item
          label='课后辅导：'
          rules={[{ required: true, message: '请选择课后辅导班' }]}
          name='KCFD'
          key='KCFD'
        >
          <SelectCourses
            title='选择辅导班'
            maxLength={50}
            getNJArr={() => {
              // 获取年级
              if (NJSJ) {
                return [NJSJ?.id]
              }
              return []
            }}
            XNXQId={XNXQId}
            // 课程班=0 辅导班=1
            flag={1}
          />
        </ProForm.Item>
        <ProForm.Item
          label='课后课程：'
          rules={[{ required: true, message: '请选择课程班' }]}
          name='KHKC'
          key='KHKC'
        >
          <SelectCourses
            title='选择课程班'
            maxLength={50}
            getNJArr={() => {
              // 获取年级
              if (NJSJ) {
                return [NJSJ?.id]
              }
              return []
            }}
            XNXQId={XNXQId}
            // 课程班=0 辅导班=1
            flag={0}
          />
        </ProForm.Item>
        <ProForm.Item label='课程数限制' name='KXSL' key='KXSL' >
          <InputNumber
            defaultValue={12}
            placeholder={'请输入'}
            min={0} max={50} width={100} /><span style={{ color: '#999' }} className="ant-form-text"> 限制每个学生最大可选课后课程班数量</span>
        </ProForm.Item>
        <ProForm.Item label='服务费用' name='FWFY' key='FWFY' >
          <InputNumber defaultValue={12} width={100} min={0} placeholder={'请输入'} /><span style={{ color: '#999' }} className="ant-form-text"> 课后服务按月收费，家长可随时缴纳截至当前月的服务费用</span>
        </ProForm.Item>
      </ModalForm>
    </Spin>
  )
}

export default ConfigureService

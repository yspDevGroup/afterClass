/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import type { RoomItem, SchoolAreaType } from '../data';
import ProFormFields from '@/components/ProFormFields';
import { RoomType } from '@/constant';
import { getAllXQSJ } from '@/services/after-class/xqsj';

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

type PropsType = {
  current?: RoomItem;
  onCancel?: () => void;
  setForm: React.Dispatch<React.SetStateAction<FormInstance<any> | undefined>>;
  readonly?: boolean;
};

const AddRoom = (props: PropsType) => {
  const { current, setForm, readonly } = props;
  const [schoolArea,setSchoolArea] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    // 根据学校ID获取所有校区信息
    async function fetchData() {
      try {
        const result = await getAllXQSJ({
          xxid: 'd18f9105-9dfb-4373-9c76-bc68f670fff5'
        });
        if (result.status === 'ok') {
          if(result.data && result.data.length > 0) {
            const data: any = [].map.call(result.data, (item: SchoolAreaType) => {
              return {
                value: item.id,
                text: item.XQMC
              }
            });
            setSchoolArea(data);
          }
        }
      } catch (error) {
        console.log('数据获取失败');
        
      }


    }
    fetchData();
  }, [])
  console.log(schoolArea);
  
  const formItems: any[] = [
    {
      type: 'input',
      readonly,
      label: '名称',
      name: 'FJMC',
      key: 'FJMC',
      rules: [{ required: true, message: '请填写名称' }],
    },
    {
      type: 'input',
      readonly,
      label: '编号',
      name: 'FJBH',
      key: 'FJBH',
      rules: [{ required: true, message: '请填写编号' }],
    },
    {
      type: 'select',
      readonly,
      label: '类型',
      name: 'FJLX',
      key: 'FJLX',
      rules: [{ required: true, message: '请填写名称' }],
      valueEnum: RoomType,
    },
    {
      type: 'select',
      readonly,
      label: '所属校区',
      name: 'SSXQ',
      key: 'SSXQ',
      rules: [{ required: true, message: '请选择所属校区' }],
      valueEnum: schoolArea,
    },
    {
      type: 'input',
      readonly,
      label: '容纳人数',
      name: 'FJRS',
      key: 'FJRS',
      rules: [{ required: true, message: '请填写场地容纳人数' }],
    },
    {
      type: 'input',
      readonly,
      label: '场地地址',
      name: 'BZXX',
      key: 'BZXX',
      rules: [{ required: true, message: '请填写场地地址' }],
    },
  ];
  return (
    <>
      <ProFormFields
        layout="horizontal"
        setForm={setForm}
        values={current}
        formItems={formItems}
        formItemLayout={formLayout}
      />
    </>
  );
};

export default AddRoom;

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import { message } from 'antd';
import type { FJLX, RoomItem, SchoolAreaType } from '../data';
import ProFormFields from '@/components/ProFormFields';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import { getAllFJLX } from '@/services/after-class/fjlx';

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
  const [schoolArea, setSchoolArea] = useState<Record<string, string>[]>([]);
  const [roomType, setRoomType] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // 根据学校ID获取所有校区信息
        const result = await getAllXQSJ({
          xxid: 'd6879944-be88-11eb-9edd-00ff016ba5b8',
        });
        if (result.status === 'ok') {
          if (result.data && result.data.length > 0) {
            const data: any = [].map.call(result.data, (item: SchoolAreaType) => {
              return {
                value: item.id,
                text: item.XQMC,
              };
            });
            setSchoolArea(data);
          }
        } else {
          message.info(result.message);
        }
        // 根据学校ID获取所有场地类型
        const response = await getAllFJLX({
          xxId: 'd6879944-be88-11eb-9edd-00ff016ba5b8',
          name: '',
        });
        if (response.status === 'ok') {
          if (response.data && response.data.length > 0) {
            const data: any = [].map.call(response.data, (item: FJLX) => {
              return {
                value: item.id,
                text: item.FJLX,
              };
            });
            setRoomType(data);
          }
        } else {
          message.info(result.message);
        }
      } catch (error) {
        console.log('数据获取失败');
      }
    }
    fetchData();
  }, []);
  console.log(schoolArea, roomType);

  const formItems: any[] = [
    {
      type: 'input',
      readonly,
      hidden: true,
      name: 'id',
      key: 'id',
    },
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
      rules: [{ required: true, message: '请填写类型' }],
      valueEnum: roomType,
    },
    {
      type: 'select',
      readonly,
      label: '所属校区',
      name: 'SSXQ',
      key: 'SSXQ',
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

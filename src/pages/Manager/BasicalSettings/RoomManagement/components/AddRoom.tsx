/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import { message } from 'antd';
import ProFormFields from '@/components/ProFormFields';
import { getAllFJLX } from '@/services/after-class/fjlx';
import { queryXQList } from '@/services/wechat/service';

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

type PropsType = {
  current?: RoomItem;
  onCancel?: () => void;
  setForm: React.Dispatch<React.SetStateAction<FormInstance<any> | undefined>>;
  readonly?: boolean;
  setopens: (value: boolean) => void;
  setModalVisible: (value: boolean) => void;
  setXQLabelItem: (value: string) => void;
};

const AddRoom = (props: PropsType) => {
  const { current, setForm, readonly, setopens, setModalVisible, setXQLabelItem } = props;
  const [roomType, setRoomType] = useState<Record<string, string>[]>([]);
  // 校区
  const [campus, setCampus] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // 获取所有校区信息
        const currentXQ = await queryXQList();
        const XQ: { label: any; value: any }[] = [];
        currentXQ?.map((item: any) => {
          XQ.push({
            label: item.name,
            value: item.id,
          });
          return '';
        });
        setCampus(XQ);
        // 根据学校ID获取所有场地类型
        const response = await getAllFJLX({
          name: '',
        });
        if (response.status === 'ok') {
          if (response.data && response.data.length > 0) {
            const data: any = [].map.call(response.data, (item: RoomType) => {
              return {
                label: item.FJLX,
                value: item.id,
              };
            });
            setRoomType(data);
          } else {
            setopens(true);
            //  setTimeout( function(){setModalVisible(false)},500)
          }
        } else {
          message.info(response.message);
        }
      } catch (error) {
        console.log('数据获取失败');
      }
    }
    fetchData();
  }, []);

  const formItems: any[] = [
    {
      type: 'input',
      readonly,
      hidden: true,
      name: 'id',
      key: 'id',
      fieldProps: {
        autocomplete: 'off',
      },
    },
    {
      type: 'input',
      readonly,
      label: '名称',
      name: 'FJMC',
      key: 'FJMC',
      fieldProps: {
        autocomplete: 'off',
      },
      rules: [{ required: true, message: '请填写名称' }],
    },
    {
      type: 'input',
      readonly,
      label: '编号',
      name: 'FJBH',
      key: 'FJBH',
      rules: [{ required: true, message: '请填写编号' }],
      fieldProps: {
        autocomplete: 'off',
      },
    },
    {
      type: 'select',
      readonly,
      label: '类型',
      name: 'FJLXId',
      key: 'FJLXId',
      rules: [{ required: true, message: '请填写类型' }],
      options: roomType,
    },
    {
      type: 'select',
      readonly,
      label: '所属校区',
      name: 'XQ',
      key: 'XQ',
      rules: [{ required: true, message: '请填写所属校区' }],
      fieldProps: {
        options: campus,
        onChange(value: any, option: any) {
          setXQLabelItem(option.label);
        },
      },
    },
    {
      type: 'inputNumber',
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
      fieldProps: {
        autocomplete: 'off',
      },
    },
  ];
  return (
    <>
      <ProFormFields
        layout="horizontal"
        setForm={setForm}
        values={(() => {
          if (current) {
            const { FJLX, XQSJ, XQName, ...info } = current;
            return {
              FJLXId: FJLX?.id,
              XQSJId: XQSJ?.id,
              XQ: XQName,
              ...info,
            };
          }
          return undefined;
        })()}
        formItems={formItems}
        formItemLayout={formLayout}
      />
    </>
  );
};

export default AddRoom;

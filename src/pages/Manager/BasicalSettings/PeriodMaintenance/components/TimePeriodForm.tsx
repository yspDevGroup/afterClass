import React, { useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import ProFormFields from '@/components/ProFormFields';
import { queryXNXQList } from '@/services/local-services/xnxq';
import type { Maintenance } from '../data';

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

type PropsType = {
  currentStatus?: string;
  current?: Maintenance;
  onCancel?: () => void;
  setForm: React.Dispatch<React.SetStateAction<FormInstance<any> | undefined>>;
};

const TimePeriodForm = (props: PropsType) => {
  const { currentStatus, current, setForm } = props;
  const [chainData, setchainData] = useState<ChainDataType>();// 联动数据
  const [terms, setTerms] = useState<{ label: string; value: string }[]>();// 联动数据中的学期数据   
  useEffect(() => {
    async function fetchData() {
      // 从本地获取学期学年信息
      const currentXQXN = await queryXNXQList();
      setchainData(currentXQXN?.xnxqList); // 改变联动数据
    }
    fetchData();
  }, []);
  const formItems: any[] = [
    {
      type: 'input',
      hidden: true,
      name: 'id',
      key: 'id',
    },
    {
      type: 'input',
      label: '时段名称',
      name: 'SDMC',
      key: 'SDMC',
      rules: [{ required: true, message: '请填写名称' }],
      fieldProps: {
        autocomplete: 'off'
      }
    },
    {
      type: 'cascader',
      label: '学年学期：',
      key: 'XNXQ',
      cascaderItem: [
        {
          type: 'select',
          width: '100%',
          name: 'XN',
          key: 'XN',
          placeholder: '请选择学年',
          options: chainData?.data,
          noStyle: true,
          fieldProps: {
            onChange: (event: string) => {
              setTerms(chainData?.subData[event])
            },
          },
        },
        {
          type: 'select',
          name: 'XQ',
          width: '100%',
          key: 'XQ',
          placeholder: '请选择学期',
          noStyle: true,
          options: terms,
        },
      ],
    },
    {
      type: currentStatus === 'schedule' ? 'time' : 'date',
      label: '开始时间',
      name: 'KSSJ',
      key: 'KSSJ',
      width: '100%',
      fieldProps: {
        format: currentStatus === 'schedule' ? 'HH:mm' : 'YYYY-MM-DD',
        minuteStep: 5,
        hideDisabledOptions: true,
        disabledHours: () => {
          return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 21, 22, 23, 24]
        }
      },
      rules: [{ type: 'any', required: true, messsage: '请填写日期' }],
    },
    {
      type: currentStatus === 'schedule' ? 'time' : 'date',
      label: '结束时间',
      name: 'JSSJ',
      key: 'JSSJ',
      width: '100%',
      fieldProps: {
        format: currentStatus === 'schedule' ? 'HH:mm' : 'YYYY-MM-DD',
        minuteStep: 5,
        hideDisabledOptions: true,
        disabledHours: () => {
          return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 21, 22, 23, 24]
        }
      },
      rules: [{ type: 'any', required: true, messsage: '请填写日期' }],
    },
    {
      type: 'textArea',
      label: '备注',
      name: 'BZXX',
      key: 'BZXX',
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
export default TimePeriodForm;

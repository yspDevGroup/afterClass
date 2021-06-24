import React, { useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import ProFormFields from '@/components/ProFormFields';
import { queryXNXQList } from '@/services/local-services/xnxq';
import type { Maintenance } from '../data';
import styles from './index.less';

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
  const [chainData, setchainData] = useState<ChainDataType>(); // 联动数据
  const [terms, setTerms] = useState<{ label: string; value: string }[]>(); // 联动数据中的学期数据
  const [currentTerm, setCurrentTerm] = useState<string>();
  useEffect(() => {
    async function fetchData() {
      // 从本地获取学期学年信息
      const currentXQXN = await queryXNXQList();
      setchainData(currentXQXN?.xnxqList); // 改变联动数据
      if (current?.XNXQ?.XN) {
        setTerms(currentXQXN?.xnxqList.subData[current?.XNXQ?.XN]);
      }
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
      name: 'TITLE',
      key: 'TITLE',
      rules: [{ required: true, message: '请填写名称' }],
      fieldProps: {
        autocomplete: 'off',
        placeholder: currentStatus === 'schedule' ?'如：第一节课':(currentStatus === 'enroll' ? '如：2020-2021':'如：2021春季'),
      },
    },
    {
      type: 'cascader',
      label: '学年学期：',
      key: 'XNXQ',
      style: { marginBottom: 0 },
      cascaderItem: [
        {
          type: 'select',
          width: '100%',
          name: 'xn',
          key: 'xn',
          placeholder: '请选择学年',
          options: chainData?.data,
          rules: [{ required: true, message: '请选择学年' }],
          // noStyle: true,
          fieldProps: {
            onChange: (event: string) => {
              if (event) {
                setTerms(chainData?.subData[event]);
                setCurrentTerm(chainData?.subData[event][0].value);
              }
            },
          },
        },
        {
          type: 'select',
          name: 'xq',
          width: '100%',
          key: 'xq',
          rules: [{ required: true, message: '请选择学期' }],
          placeholder: '请选择学期',
          // noStyle: true,
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
          return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 21, 22, 23, 24];
        },
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
          return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 21, 22, 23, 24];
        },
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
    <div className={styles.courseStyles}>
      <ProFormFields
        layout="horizontal"
        setForm={setForm}
        values={currentTerm ? { xq: currentTerm } : current}
        formItems={formItems}
        formItemLayout={formLayout}
      />
    </div>
  );
};
export default TimePeriodForm;

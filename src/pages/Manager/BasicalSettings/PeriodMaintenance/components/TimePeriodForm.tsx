/* eslint-disable no-nested-ternary */
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
  const [terms, setTerms] = useState<{ label: string; value: string }[]>(); // 联动数据中的学期数据
  useEffect(() => {
    async function fetchData() {
      // 从本地获取学期学年信息
      const res = await queryXNXQList();
      const newData = res.xnxqList.map((item: any) => {
        return {
          label: item.text,
          value: item.value,
        };
      });
      setTerms(newData);
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
      rules: [
        { required: true, message: '请填写名称' },
        { max: 10, message: '最长为 10 位' },
      ],
      fieldProps: {
        autocomplete: 'off',
        placeholder:
          currentStatus === 'schedule'
            ? '如：第一节课'
            : currentStatus === 'enroll'
            ? '如：2020-2021'
            : '如：2021春季',
      },
    },
    {
      type: 'select',
      label: '学年学期：',
      name: 'XNXQId',
      width: '100%',
      key: 'XNXQId',
      rules: [{ required: true, message: '请选择学期' }],
      placeholder: '请选择学期',
      options: terms,
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
        rules: [{ required: true, message: '请填写开始时间' }],
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
        rules: [{ required: true, message: '请填写结束时间' }],
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
        values={current}
        formItems={formItems}
        formItemLayout={formLayout}
      />
    </div>
  );
};
export default TimePeriodForm;

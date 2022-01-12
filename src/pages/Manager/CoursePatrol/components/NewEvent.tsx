/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FormInstance } from 'antd';
import { useModel } from 'umi';
import ProFormFields from '@/components/ProFormFields';
import styles from '../index.less';
import { getAllJZGJBSJ } from '@/services/after-class/jzgjbsj';
import moment from 'moment';

const formLayout = {
  labelCol: { flex: '10em' },
  wrapperCol: {},
};

type PropsType = {
  setForm: React.Dispatch<React.SetStateAction<FormInstance<any> | undefined>>;
  date?: string;
  current?: any;
};

const NewEvent = (props: PropsType) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { setForm, date, current } = props;
  // 教师
  const [teacherData, setTeacherData] = useState<any[]>([]);
  // 获取教师
  const getTeacher = async () => {
    const res = await getAllJZGJBSJ({ XXJBSJId: currentUser?.xxId, page: 0, pageSize: 0 });
    if (res.status === 'ok') {
      const data = res.data?.rows;
      const teachOption: any = [];
      data?.forEach((item) => {
        teachOption.push({
          label: item.XM,
          value: item.id,
        });
      });
      setTeacherData(teachOption);
    }
  };
  useEffect(() => {
    getTeacher();
  }, [])
  const formItems: any[] = [
    {
      type: 'input',
      label: '值班日期',
      name: 'RQ',
      key: 'RQ',
      disabled: true,
    },
    {
      type: 'select',
      label: '值班教师 (多选)',
      name: 'JZGJBSJId',
      key: 'JZGJBSJId',
      rules: [{ required: true, message: '值班教师' }],
      fieldProps: {
        mode: 'multiple',
        showSearch: true,
        options: [...teacherData],
        optionFilterProp: 'label',
        allowClear: true,
      },
    },
  ];
  return (
    <div style={{ padding: '0 48px' }} className={styles.arrangeForm}>
      <ProFormFields
        setForm={setForm}
        formItems={formItems}
        formItemLayout={formLayout}
        values={{
          RQ: moment(date).format('YYYY-MM-DD'),
          ...current
        }}
      />
    </div>
  );
};

export default NewEvent;

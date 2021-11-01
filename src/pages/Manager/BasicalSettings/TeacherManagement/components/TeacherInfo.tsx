/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-08-26 16:24:39
 * @LastEditTime: 2021-11-01 11:56:07
 * @LastEditors: Sissle Lynn
 */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FormInstance, message } from 'antd';
import CustomForm from '@/components/CustomForm';
import { FormItemType } from '@/components/CustomForm/interfice';

import 'antd/es/modal/style';
import styles from './components.less';
import { createJZG, updateJZGJBSJ } from '@/services/after-class/jzgjbsj';
import { getHashData } from './util';

const formItemLayout = {
  labelCol: { flex: '8em' },
  wrapperCol: { flex: 'auto' }
};
type PropsType = {
  values: any;
  setForm: React.Dispatch<React.SetStateAction<FormInstance<any> | undefined>>;
  readonly?: boolean;
};
type itemType = {
  text: string;
  value: string;
}[];
const SchoolInfo = (props: PropsType) => {
  const { values, setForm, readonly = false } = props;
  const [info, setInfo] = useState<any>();
  const [zpUrl, setZPUrl] = useState('');
  const [zgzsUrl, setZGZSUrl] = useState('');
  const [mzlist, setMzlist] = useState<itemType>([]);
  const [xllist, setXllist] = useState<itemType>([]);
  useEffect(() => {
    async function fetchData() {
      const mz = await getHashData('B.9');
      const xl = await getHashData('B.12');
      setMzlist(mz);
      setXllist(xl)
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (values) {
      const { ZP, ZGZS, CSRQ, XBM, ...rest } = values;
      setZPUrl(ZP || '');
      setZGZSUrl(ZGZS || '');
      const XBLX = XBM ? XBM : '男性';
      const newData =  {
        CSRQ: CSRQ ? moment(CSRQ) : '',
        XBM: readonly ? XBLX?.substring(0, 1) : XBLX,
        ...rest
      };
      setInfo(newData);
    }
  }, [values]);
  // 文件状态改变的回调
  const imageChange = (type: string, e?: any) => {
    if (e.file.status === 'done') {
      const mas = e.file.response.message;
      if (typeof e.file.response === 'object' && e.file.response.status === 'error') {
        message.error(`上传失败，${mas}`);
      } else {
        const res = e.file.response;
        if (res.status === 'ok') {
          message.success(`上传成功`);
          type === 'ZP' ? setZPUrl(res.data) : setZGZSUrl(res.data);
        }
      }
    } else if (e.file.status === 'error') {
      const mass = e.file.response.message;
      message.error(`上传失败，${mass}`);
    }
  };
  const basicForm: FormItemType[] = [
    {
      type: 'input',
      label: 'id',
      name: 'id',
      key: 'id',
      hidden: true
    },
    {
      type: 'group',
      key: 'group1',
      groupItems: [
        {
          type: 'uploadImage',
          label: '个人照片',
          name: 'ZP',
          key: 'ZP',
          imgWidth: 100,
          imgHeight: 100,
          imageurl: zpUrl,
          upurl: '/api/upload/uploadFile?type=badge&plat=agency',
          accept: '.jpg, .jpeg, .png',
          imagename: 'image',
          handleImageChange: (value: any) => {
            imageChange('ZP', value);
          }
        },
        {
          type: 'uploadImage',
          label: '资格证书',
          name: 'ZGZS',
          key: 'ZGZS',
          imgWidth: 100,
          imgHeight: 100,
          imageurl: zgzsUrl,
          upurl: '/api/upload/uploadFile?type=badge&plat=agency',
          accept: '.jpg, .jpeg, .png',
          imagename: 'image',
          handleImageChange: (value: any) => {
            imageChange('ZGZS', value);
          }
        }
      ]
    },
    {
      type: 'group',
      key: 'group2',
      groupItems: [
        {
          type: 'input',
          label: '姓名',
          name: 'XM',
          key: 'XM',
          rules: [{ required: true, message: '请输入姓名' }, { type: 'string', max: 60 },],
          placeholder: readonly ? '-' : ''
        },
        {
          type: 'input',
          label: '资格证书编号',
          name: 'ZGZSBH',
          key: 'ZGZSBH',
          placeholder: readonly ? '-' : ''
        }
      ]
    },
    {
      type: 'group',
      key: 'group3',
      groupItems: [
        {
          type: 'radio',
          name: 'XBM',
          key: 'XBM',
          label: '性别',
          hidden: readonly,
          span: 12,
          items: [
            {
              text: '男',
              value: '男性'
            },
            {
              text: '女',
              value: '女性'
            }
          ]
        },
        {
          type: 'input',
          label: '性别',
          span: 12,
          name: 'XBM',
          key: 'XBM2',
          hidden: !readonly,
          placeholder: readonly ? '-' : ''
        },
        {
          type: 'select',
          label: '学历',
          span: 12,
          key: 'XLM',
          name: 'XLM',
          items: xllist
        },
      ]
    },
    {
      type: 'group',
      key: 'group4',
      groupItems: [
        {
          type: 'select',
          key: 'MZM',
          name: 'MZM',
          label: '民族',
          items: mzlist
        },
        {
          type: 'input',
          label: '毕业院校',
          name: 'BYYX',
          key: 'BYYX',
          rules: [{ type: 'string', max: 255 },],
          placeholder: readonly ? '-' : ''
        }
      ]
    },
    {
      type: 'group',
      key: 'group6',
      groupItems: [
        {
          type: 'time',
          subtype: 'date',
          label: '出生日期',
          name: 'CSRQ',
          key: 'CSRQ',
          placeholder: readonly ? '-' : ''
        },
        {
          type: 'input',
          label: '专业',
          name: 'SXZY',
          key: 'ZY',
          rules: [{ type: 'string', max: 255 },],
          placeholder: readonly ? '-' : ''
        }
      ]
    },
    {
      type: 'group',
      key: 'group7',
      groupItems: [
        {
          type: 'input',
          label: '联系电话',
          name: 'LXDH',
          key: 'LXDH',
          placeholder: readonly ? '-' : '',
          rules: [
            { required: true, message: '请输入联系电话' },
            { type: 'string', max: 32 },
            {
              pattern: new RegExp(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/),
              message: '填写的电话格式有误',
            },
          ]
        },
        {
          type: 'inputNumber',
          label: '教龄（年）',
          name: 'JL',
          key: 'JL',
          max: 100,
          min: 1,
          placeholder: readonly ? '-' : '',
          formatter: (value) => `${Math.round(value)}`,
          tooltip: '注意：教龄四舍五入，只能填写整数'
        }
      ]
    },
    {
      type: 'group',
      key: 'group8',
      groupItems: [
        {
          type: 'select',
          key: 'SFZJLXM',
          name: 'SFZJLXM',
          label: '证件类型',
          placeholder: readonly ? '-' : '',
          items: [
            {
              value: '居民身份证',
              text: '居民身份证'
            },
            {
              value: '护照',
              text: '护照'
            },
            {
              value: '户口簿',
              text: '户口簿'
            },
            {
              value: '其他',
              text: '其他'
            }
          ]
        },
        {
          type: 'input',
          label: '教授科目',
          name: 'JSKM',
          key: 'JSKM',
          rules: [{ type: 'string', max: 255 },],
          placeholder: readonly ? '-' : ''
        }
      ]
    },
    {
      type: 'group',
      key: 'group9',
      groupItems: [
        {
          type: 'input',
          key: 'SFZJH',
          name: 'SFZJH',
          label: '证件号码',
          rules: [{ type: 'string', max: 20 },],
          placeholder: readonly ? '-' : ''
        },
        {
          type: 'input',
          label: '电子邮箱',
          name: 'DZXX',
          key: 'DZXX',
          placeholder: readonly ? '-' : '',
          rules: [
            {
              type: 'email',
              message: '填写的邮箱格式有误',
            },
            { type: 'string', max: 32 },
          ]
        }
      ]
    },
    {
      type: 'group',
      key: 'group10',
      groupItems: [
        {},
        {
          type: 'textArea',
          label: '个人简介',
          name: 'BZ',
          key: 'BZ',
          rules: [{ type: 'string', max: 255 },],
          placeholder: readonly ? '-' : ''
        }
      ]
    }
  ];
  const onFinish = async (values: any) => {
    let res;
    values.CSRQ = values.CSRQ ? moment(values.CSRQ).format('YYYY-MM-DD') : undefined;
    values.ZGZS = zgzsUrl ? zgzsUrl : values.ZGZS;
    values.ZP = zpUrl ? zpUrl : values.ZP;
    if (values.id) {
      res = await updateJZGJBSJ(
        {
          id: values.id
        },
        values
      );
    } else {
      res = await createJZG(values);
    }
    if (res.status === 'ok') {
      message.success('保存成功');
      history.go(-1);
    } else {
      let msg = res.message;
      message.error(msg);
    }
  };
  return (
    <div className={styles.teacherWrapper}>
      <div className={styles.teacherInfoBody}>
        <CustomForm
          values={info}
          formDisabled={readonly}
          setForm={setForm}
          formItems={basicForm}
          formLayout={formItemLayout}
          onFinish={onFinish}
          hideBtn={true}
        />
      </div>
    </div>
  );
};

export default SchoolInfo;

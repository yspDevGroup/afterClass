/* eslint-disable func-names */
/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-01 08:49:11
 * @LastEditTime: 2021-09-08 11:20:14
 * @LastEditors: wsl
 */
import React, { useEffect, useState } from 'react';
import { Button, Form, message, Select } from 'antd';
import img from '@/assets/Company.png';
import styles from './index.less';
import { updateXXJBSJ } from '@/services/after-class/xxjbsj';
import { useModel } from '@/.umi/plugin-model/useModel';

const { Option } = Select;

const Register = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [form] = Form.useForm();
  const [cities, setCities] = useState<any>();
  const [cityAdcode, setCityAdcode] = useState<string>();
  const [secondCity, setSecondCity] = useState<any>();
  const [county, setCounty] = useState<any>();

  const requestData = () => {
    const ajax = new XMLHttpRequest();
    ajax.open(
      'get',
      'http://datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/100000_province.json',
    );
    ajax.send();
    // eslint-disable-next-line func-names
    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4 && ajax.status === 200) {
        const data = JSON.parse(ajax.responseText);
        setCities(data.rows);
      }
    };
  };
  useEffect(() => {
    requestData();
  }, []);

  const handleChange = (type: string, value: any) => {
    if (type === 'cities') {
      const ajax = new XMLHttpRequest();
      ajax.open(
        'get',
        `http://datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/${value}_city.json`,
      );
      ajax.send();
      ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
          const data = JSON.parse(ajax.responseText);
          setSecondCity(data.rows);
        }
      };
    } else if (type === 'secondCity') {
      const ajax = new XMLHttpRequest();
      ajax.open(
        'get',
        `http://datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/${value}_district.json`,
      );
      ajax.send();
      ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
          const newArr: any[] = [];
          const data = JSON.parse(ajax.responseText);
          data.rows.forEach((item: any) => {
            if (item.adcode.substring(0, 4) === value.substring(0, 4)) {
              newArr.push(item);
            }
          });
          setCounty(newArr);
        }
      };
    } else if (type === 'county') {
      setCityAdcode(value);
    }
  };
  const submit = async (params: any) => {
    if (typeof cityAdcode === 'undefined') {
      message.info('请选择所在行政区');
    } else if (typeof params.XD === 'undefined') {
      message.info('请选择学段');
    }
    const res = await updateXXJBSJ(
      { id: currentUser!.xxId! },
      { XZQHM: cityAdcode, XD: params.XD.toString() },
    );
    if (res.status === 'ok') {
      message.success('保存成功');
      window.location.reload();
    } else {
      message.success(res.message);
    }
  };
  return (
    <div className={styles.Index}>
      <img src={img} alt="" />
      <p className={styles.hello}>您好，欢迎使用课后服务平台</p>
      <p className={styles.apply}>请先选择所在行政区域及学段</p>
      <Form form={form} onFinish={submit} className={styles.Forms}>
        <Form.Item name="XZQHM" key="XZQHM" label="行政区域">
          <Select
            placeholder="请选择"
            style={{ width: 120, marginRight: 10 }}
            onChange={(value: any) => {
              handleChange('cities', value);
            }}
          >
            {cities?.map((item: any) => {
              return (
                <Option value={item.adcode} key={item.name}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
          <Select
            placeholder="请选择"
            style={{ width: 120, marginRight: 10 }}
            onChange={(value: any) => {
              handleChange('secondCity', value);
            }}
          >
            {secondCity?.map((item: any) => {
              return (
                <Option value={item.adcode} key={item.name}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
          <Select
            style={{ width: 120 }}
            placeholder="请选择"
            onChange={(value: any) => {
              handleChange('county', value);
            }}
          >
            {county?.map((item: any) => {
              return (
                <Option value={item.adcode} key={item.adcode}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="XD" key="XD" label="学段">
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="请选择"
            onChange={handleChange}
          >
            <Option value="幼儿园">幼儿园</Option>
            <Option value="小学">小学</Option>
            <Option value="初中">初中</Option>
            <Option value="高中">高中</Option>
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Register;

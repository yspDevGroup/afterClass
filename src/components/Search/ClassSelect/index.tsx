/*
 * @Author: Sissle Lynn
 * @Date: 2021-11-17 12:21:39
 * @LastEditTime: 2021-11-19 12:06:52
 * @LastEditors: Sissle Lynn
 * @Description: 课程班查询
 */
import type { FC } from 'react';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getAllClasses } from '@/services/after-class/khbjsj';

const { Option } = Select;

type ClassSecectProps = {
  XNXQId?: string;
  KHKCSJId?: string;
  onChange?: (val: any, data?: any) => void;
};
const ClassSelect: FC<ClassSecectProps> = ({ onChange, XNXQId, KHKCSJId }) => {
  const [classList, setClassList] = useState<any>();
  const [classValue, setClassValue] = useState<string>();
  const getClass = async (termId?: string, kcId?: string) => {
    const bjmcResl = await getAllClasses({
      page: 0,
      pageSize: 0,
      KHKCSJId: kcId,
      XNXQId: termId,
    });
    if (bjmcResl.status === 'ok') {
      const BJMC = bjmcResl.data.rows?.map((item: any) => ({
        text: item.BJMC,
        value: item.id,
      }));
      setClassList(BJMC);
    }
  }
  useEffect(() => {
    setClassValue(undefined);
    onChange?.(undefined, undefined);
    if (XNXQId) {
      getClass(XNXQId, KHKCSJId);
    }
  }, [XNXQId, KHKCSJId]);

  return (
    <div>
      <label htmlFor='course'>课程班名称：</label>
      <Select
        value={classValue}
        allowClear
        onChange={(value: string, option: any) => {
          setClassValue(value);
          onChange?.(value, option);
        }}
      >
        {classList?.map((item: any) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.text}
            </Option>
          );
        })}
      </Select>
    </div>
  );
};
export default ClassSelect;

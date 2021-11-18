/*
 * @Author: Sissle Lynn
 * @Date: 2021-11-17 12:21:39
 * @LastEditTime: 2021-11-18 11:42:05
 * @LastEditors: Sissle Lynn
 * @Description: 课程班查询
 */
import type { FC } from 'react';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getAllClasses } from '@/services/after-class/khbjsj';

const { Option } = Select;

type ClassSecectProps = {
  XNXQId: string;
  KHKCSJId?: string;
  onChange?: (val: string) => void;
};
const ClassSecect: FC<ClassSecectProps> = ({ onChange, XNXQId, KHKCSJId }) => {
  const [classList, setClassList] = useState<any>();
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
    if (XNXQId) {
      getClass(XNXQId, KHKCSJId);
    }
  }, [XNXQId, KHKCSJId]);

  return (
    <div>
      <label htmlFor='course'>课程班名称：</label>
      <Select
        allowClear
        onChange={(value: string) => {
          onChange?.(value);
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
export default ClassSecect;

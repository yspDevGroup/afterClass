/*
 * @Author: wuzhan
 * @Date: 2021-10-27 09:00:26
 * @LastEditTime: 2022-05-12 17:39:00
 * @LastEditors: Sissle Lynn
 * @Description: 学年学期
 */
import type { FC } from 'react';
import { message, Select } from 'antd';
import { useEffect, useState } from 'react';
import { queryXNXQList } from '@/services/local-services/xnxq';

const { Option } = Select;

type SemesterSelectProps = {
  XXJBSJId?: string;
  onChange?: (val: string, key?: string, start?: string, end?: string) => void;
};
const SemesterSelect: FC<SemesterSelectProps> = ({ onChange, XXJBSJId }) => {
  const [termList, setTermList] = useState<any>();
  const [term, setTerm] = useState<string>();
  const getXNXQ = async (xxdm?: string) => {
    const res = await queryXNXQList(xxdm);
    const newData = res.xnxqList;
    const curTerm = res.current;
    if (newData) {
      setTermList(newData);
      setTerm(curTerm?.id || newData[0].id);
      onChange?.(
        curTerm?.id || newData[0].id,
        `${curTerm?.XN} ${curTerm?.XQ}`,
        curTerm.KSRQ,
        curTerm.JSRQ,
      );
    } else {
      message.error(res.message);
    }
  };
  useEffect(() => {
    if (XXJBSJId) {
      getXNXQ(XXJBSJId);
    }
  }, [XXJBSJId]);

  return (
    <div>
      <label htmlFor="term">所属学年学期：</label>
      <Select
        value={term}
        allowClear
        onChange={(value: string, key: any) => {
          setTerm(value);
          const curr = termList.find((val: { value: string }) => val.value === value);
          onChange?.(value, key?.children, curr?.KSRQ, curr?.JSRQ);
        }}
      >
        {termList?.map((item: any) => {
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
export default SemesterSelect;

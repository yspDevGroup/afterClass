/*
 * @Author: Sissle Lynn
 * @Date: 2021-11-17 10:04:45
 * @LastEditTime: 2021-11-19 12:06:35
 * @LastEditors: Sissle Lynn
 * @Description: 课程查询
 */
import type { FC } from 'react';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getAllCourses } from '@/services/after-class/khkcsj';

const { Option } = Select;

type CourseSecectProps = {
  XXJBSJId?: string;
  XNXQId?: string;
  onChange?: (val: any, data?: any) => void;
};
const CourseSelect: FC<CourseSecectProps> = ({ onChange, XXJBSJId, XNXQId }) => {
  const [courseList, setCourseList] = useState<any>();
  const [courseValue, setCourseValue] = useState<string>();
  const getCourse = async (xxdm: string) => {
    const res = await getAllCourses({
      page: 0,
      pageSize: 0,
      XXJBSJId: xxdm,
    });
    if (res?.status === 'ok') {
      const courseArry: { text: string; value: string }[] = [];
      res?.data?.rows?.forEach((item: any) => {
        courseArry.push({
          text: item.KCMC,
          value: item.id,
        });
      });
      setCourseList(courseArry);
    }
  };
  useEffect(() => {
    if (XXJBSJId) {
      getCourse(XXJBSJId);
    }
  }, [XXJBSJId]);
  useEffect(() => {
    setCourseValue(undefined);
    onChange?.(undefined, undefined);
  }, [XNXQId])

  return (
    <div>
      <label htmlFor='course'>课程名称：</label>
      <Select
        value={courseValue}
        allowClear
        onChange={(value: string, option: any) => {
          setCourseValue(value);
          onChange?.(value, option);
        }}
      >
        {courseList?.map((item: any) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.text}
            </Option>
          );
        })}
      </Select></div>
  );
};
export default CourseSelect;

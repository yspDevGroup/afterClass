/*
 * @Author: Sissle Lynn
 * @Date: 2021-11-17 10:04:45
 * @LastEditTime: 2021-11-17 14:06:17
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
  onChange?: (val: string) => void;
};
const CourseSecect: FC<CourseSecectProps> = ({ onChange, XXJBSJId }) => {
  const [courseList, setCourseList] = useState<any>();
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

  return (
    <div>
      <label htmlFor='course'>课程名称：</label>
      <Select
        onChange={(value: string) => {
          onChange?.(value);
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
export default CourseSecect;

/*
 * @description:
 * @author: txx
 * @Date: 2021-05-24 16:33:45
 * @LastEditTime: 2021-11-18 11:27:26
 * @LastEditors: Sissle Lynn
 */

import { useState } from 'react';
import { Select } from 'antd';
import { useModel } from 'umi';
import SearchLayout from './Layout';
import ClassSelect from './ClassSelect';
import CourseSelect from './CourseSelect';
import SemesterSelect from './SemesterSelect';

const { Option } = Select;
const SearchComponent = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 当前学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 当前课程
  const [curKCId, setCurKCId] = useState<any>();
  // 当前课程班
  // const [curBJId, setBJId] = useState<any>();
  // 学年学期筛选
  const termChange = (val: string) => {
    setCurXNXQId(val);
  }
  // 课程筛选
  const courseChange = (val: string) => {
    setCurKCId(val);
  }
  // 课程班筛选
  const classChange = (val: string) => {
    console.log(val);
  }

  return (
    <SearchLayout>
      <SemesterSelect XXJBSJId={currentUser?.xxId} onChange={termChange} />
      <CourseSelect XXJBSJId={currentUser?.xxId} onChange={courseChange} />
      <ClassSelect XNXQId={curXNXQId} KHKCSJId={curKCId} onChange={classChange} />
      <div>
        <label htmlFor="school">学校名称：</label>
        <Select
          allowClear
          placeholder="请选择"
        >
          <Option value='2' key='2'>
            12
          </Option>
        </Select>
      </div>
    </SearchLayout>
  )
}
export default SearchComponent

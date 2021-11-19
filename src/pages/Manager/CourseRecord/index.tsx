import React from 'react';
import { useEffect, useState } from 'react';
import { useModel, Link } from 'umi';
import { Select } from 'antd';
import type { TableItem } from './data';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getAllpresence } from '@/services/after-class/khktfc';
import PageContainer from '@/components/PageContainer';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';
import CourseSelect from '@/components/Search/CourseSelect';
import ClassSelect from '@/components/Search/ClassSelect';

const { Option } = Select;
const CourseRecord: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 当前学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 当前课程
  const [curKCId, setCurKCId] = useState<any>();
  // 当前课程班
  const [curBJId, setBJId] = useState<any>();
  // 课程来源
  const [KCLY, setKCLY] = useState<string>();
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
    setBJId(val);
  }
  // 表格数据源
  const [dataSource, setDataSource] = useState<any>([]);
  const getData = async () => {
    const res3 = await getAllpresence({
      XNXQId: curXNXQId,
      KHKCId: curKCId,
      KHBJId: curBJId,
      KHKCLY: KCLY,
      page: 0,
      pageSize: 0,
    });
    if (res3.status === 'ok') {
      setDataSource(res3?.data);
    }
  }
  useEffect(() => {
    getData();
  }, [curXNXQId, curKCId, curBJId, KCLY,]);

  // table表格数据
  const columns: ProColumns<TableItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center'
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (_, record: any) => {
        return record?.KHKCSJ?.KCMC
      }
    },
    {
      title: '课程班名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      width: 120,
      ellipsis: true,
    },
    {
      title: '课程来源',
      dataIndex: 'KCLY',
      key: 'KCLY',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (_, record: any) => {
        return record?.KHKCSJ?.SSJGLX
      }
    },
    // {
    //   title: '授课教师',
    //   dataIndex: 'SKJS',
    //   key: 'SKJS',
    //   align: 'center',
    //   width: 120,
    //   ellipsis: true,
    //   render: (_, record: any) => {
    //     return record?.KHBJJs[0]?.JZGJBSJ?.XM
    //   }
    // },
    {
      title: '发布次数',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
      width: 130,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 90,
      ellipsis: true,
      render: (_, record) => (
        <>
          <Link
            to={{
              pathname: 'courseRecord/detail',
              state: {
                type: 'detail',
                data: record,
              },
            }}
          >
            详情
          </Link>
        </>
      ),
    },
  ];
  return (
    // PageContainer组件是顶部的信息
    <PageContainer>
      <ProTable
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        search={false}
        headerTitle={
          <>
            <SearchLayout>
              <SemesterSelect XXJBSJId={currentUser?.xxId} onChange={termChange} />
              <CourseSelect XXJBSJId={currentUser?.xxId} XNXQId={curXNXQId} onChange={courseChange} />
              <ClassSelect XNXQId={curXNXQId} KHKCSJId={curKCId} onChange={classChange} />
              <div>
                <label htmlFor='kcly'>课程来源：</label>
                <Select
                  allowClear
                  placeholder="课程来源"
                  onChange={(value) => {
                    setKCLY(value);
                  }}
                  value={KCLY}
                >
                  <Option value='校内课程' key='校内课程'>
                    校内课程
                  </Option>
                  <Option value='机构课程' key='机构课程'>
                    机构课程
                  </Option>
                </Select>
              </div>
            </SearchLayout>
          </>
        }
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          defaultCurrent: 1,
        }}
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
      />
    </PageContainer>
  );
};
export default CourseRecord;

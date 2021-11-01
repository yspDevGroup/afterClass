import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
// import { message } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';

import { useModel, Link } from 'umi';
import { Input, Select } from 'antd';
import { getAllpresence } from '@/services/after-class/khktfc';
import { queryXNXQList } from '@/services/local-services/xnxq';
import ProTable from '@ant-design/pro-table';

import Style from './index.less';
import { TableItem } from './data';
import { getAllCourses } from '@/services/after-class/khkcsj';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import { getAllFJSJ, getFJPlan } from '@/services/after-class/fjsj';
import React from 'react';
import { getAllClasses } from '@/services/after-class/khbjsj';

const { Option } = Select;
const { Search } = Input;
type selectType = { label: string; value: string };

const CourseRecord: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  const [kcmcValue, setKcmcValue] = useState<any>();
  const [bjmcData, setBjmcData] = useState<selectType[] | undefined>([]);
  const [kcmcData, setKcmcData] = useState<selectType[] | undefined>([]);
  const [kclyValue, setKCLYValue] = useState<any>();
  const [teacher, setTeacher] = useState<any>();
  const [bjmcValue, setBjmcValue] = useState<any>();
  // 学期学年没有数据时提示的开关
  // 表格数据源
  const [dataSource, setDataSource] = useState<any>([]);
  /// table表格数据
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
  useEffect(() => {
    // 获取学年学期数据的获取
    (async () => {
      const res = await queryXNXQList(currentUser?.xxId);
      // 获取到的整个列表的信息
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          setCurXNXQId(curTerm.id);
          setTermList(newData);
        }
      } else {
      }
    })();
  }, []);

  useEffect(() => {
    if (kcmcValue) {
      getBjData();
    }
  }, [kcmcValue]);

  useEffect(() => {
    getData();
  }, [kcmcValue, bjmcValue, teacher, kclyValue, teacher]);

  const getData = async () => {
    const res3 = await getAllpresence({
      XNXQId: curXNXQId,
      KHKCId: kcmcValue,
      KHBJId: bjmcValue,
      KHKCLY: kclyValue,
      KHKCJSXM: teacher,
    });
    if (res3.status === 'ok') {
      setDataSource(res3?.data);
    }
  }

  // 学年学期变化
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    (async () => {
      if (curXNXQId) {
        ChoseSelect(curXNXQId);
        const params = {
          page: 0,
          pageSize: 0,
          XNXQId: curXNXQId,
          XXJBSJId: currentUser?.xxId,
        };

        // 通过课程数据接口拿到所有的课程
        const khkcResl = await getAllCourses(params);
        if (khkcResl.status === 'ok') {
          const KCMC = khkcResl.data.rows?.map((item: any) => ({
            label: item.KCMC,
            value: item.id,
          }));
          setKcmcData(KCMC);
        }
      }
    })()
  }, [curXNXQId]);


  // 学年学期选相框触发的函数
  const ChoseSelect = async (SelectData: string) => {
    const res3 = await getAllpresence({
      XNXQId: SelectData,
    });
    if (res3.status === 'ok') {
      setDataSource(res3?.data);
    }
  };

  // 获取课程对应课程班数据信息
  const getBjData = async () => {
    const bjmcResl = await getAllClasses({
      page: 0,
      pageSize: 0,
      KHKCSJId: kcmcValue,
      XNXQId: curXNXQId,
    });
    if (bjmcResl.status === 'ok') {
      const BJMC = bjmcResl.data.rows?.map((item: any) => ({
        label: item.BJMC,
        value: item.id,
      }));
      setBjmcData(BJMC);
    }
  };

  return (
    /// PageContainer组件是顶部的信息
    <PageContainer>
      <div className={Style.searchWrapper}>
        <div>
          <div>
            <span>
              所属学年学期：
              <Select
                value={curXNXQId}
                style={{ width: 200 }}
                onChange={(value: string) => {
                  // 选择不同学期从新更新页面的数据
                  setCurXNXQId(value);
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
            </span>
          </div>
          <div>
            <span>课程名称：</span>
            <div>
              <Select
                style={{ width: 200 }}
                value={kcmcValue}
                allowClear
                placeholder="请选择"
                onChange={(value) => {
                  setKcmcValue(value);
                  setBjmcData(undefined);
                  setBjmcValue(undefined);
                }}
              >
                {kcmcData?.map((item: selectType) => {
                  if (item.value) {
                    return (
                      <Option value={item.value} key={item.value}>
                        {item.label}
                      </Option>
                    );
                  }
                  return '';
                })}
              </Select>
            </div>
          </div>
          <div>
            <span>课程班名称：</span>
            <div>
              <Select
                style={{ width: 200 }}
                value={bjmcValue}
                allowClear
                placeholder="请选择"
                onChange={(value) => setBjmcValue(value)}
              >
                {bjmcData?.map((item: selectType) => {
                  return (
                    <Option value={item.value} key={item.value}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>
          <div>
            <span>教师名称：</span>
            <div>
              <Search
                allowClear
                style={{ width: 200 }}
                onSearch={(value) => setTeacher(value)}
              />
            </div>
          </div>
          <div>
            <span>课程班来源：</span>
            <div>
              <Select
                style={{ width: 200 }}
                value={kclyValue}
                allowClear
                placeholder="请选择"
                onChange={(value) => setKCLYValue(value)}
              >
                <Option value={'校内课程'}>
                  校内课程
                </Option>
                <Option value={'机构课程'}>
                  机构课程
                </Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ProTable
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          search={false}
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
      </div>
      {/* <Link to={{ pathname: '/afterSchoolCourse/detail',}}>详情</Link> */}
    </PageContainer>
  );
};
export default CourseRecord;

import PageContainer from '@/components/PageContainer';
import { Tabs, Select, Input,Form } from 'antd';
import { useEffect, useState,useRef } from 'react';
import Table from './compoents/TableList'
import type { ProColumns } from '@ant-design/pro-table';
import { getTeachers, getStudents } from '@/services/after-class/reports';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { useModel, Link } from 'umi';

const { Search } = Input;

const { Option } = Select;

const { TabPane } = Tabs;
const LeaveManagement = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  const [key, setKey] = useState<string>('1');
  
const inputVal = useRef<Input | null>(null);


  const teacher: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 58,
      fixed: 'left',
    },
    {
      title: '姓名',
      dataIndex: 'XM',
      key: 'XM',
      align: 'center',
      fixed: 'left',
      width: 100,
      render: (_, record) => {
        const showWXName = record?.JZGJBSJ?.XM === '未知' && record?.JZGJBSJ?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.JZGJBSJ.WechatUserId} />;
        }
        return record?.JZGJBSJ?.XM;
      },
    },
    {
      title: '授课班级数',
      dataIndex: 'BJS',
      key: 'BJS',
      align: 'center',
      width: 110,
    },
    {
      title: '授课总课时数',
      dataIndex: 'KSS',
      key: 'KSS',
      width: 120,
      align: 'center',
    },
    {
      title: '出勤次数',
      dataIndex: 'CQS',
      key: 'CQS',
      align: 'center',
      width: 100,
    },
    {
      title: '缺勤次数',
      dataIndex: 'QQS',
      key: 'QQS',
      align: 'center',
      width: 100,
    },
    {
      title: '出勤总时长(小时)',
      dataIndex: 'KSSC',
      key: 'KSSC',
      align: 'center',
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Link
            to={{
              pathname: '/statistics/attendance/detail',
              state: {
                type: 'detail',
                data: record,
                XNXQId: curXNXQId,
                position: '老师',
              },
            }}
          >
            详情
          </Link>
        </>
      ),
    },
  ];
  const student: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 58,
      fixed: 'left'
    },
    {
      title: '姓名',
      dataIndex: 'XM',
      key: 'XM',
      align: 'center',
      fixed: 'left',
      width: 100,
      render: (_text: any, record: any) => {
        const showWXName = record?.XSJBSJ?.XM === '未知' && record?.XSJBSJ?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.XSJBSJ.WechatUserId} />;
        }
        return record?.XSJBSJ?.XM;
      },
    },
    {
      title: '行政班名称',
      dataIndex: 'XZBJSJ',
      key: 'XZBJSJ',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSJBSJ?.BJSJ?.NJSJ?.NJMC}${record?.XSJBSJ?.BJSJ?.BJ}`;
      },
    },
    {
      title: '报名课程班数',
      dataIndex: 'BJS',
      key: 'BJS',
      align: 'center',
      width: 120,
    },
    {
      title: '出勤次数',
      dataIndex: 'CQS',
      key: 'CQS',
      align: 'center',
      width: 100,
    },
    {
      title: '缺勤次数',
      dataIndex: 'QQS',
      key: 'QQS',
      align: 'center',
      width: 100,
    },
    {
      title: '课时总时长(小时)',
      dataIndex: 'KSSC',
      key: 'KSSC',
      align: 'center',
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <>
          <Link
            to={{
              pathname: '/statistics/attendance/detail',
              state: {
                type: 'detail',
                data: record,
                XNXQId: curXNXQId,
                position: '学生',
              },
            }}
          >
            详情
          </Link>
        </>
      ),
    },
  ];

  const getDataSource = async (name?: string) => {
    let res;
    if (key === '1') {
      res = await getTeachers({ XNXQId: curXNXQId, XM:name, });
    } else {
      res = await getStudents({ XNXQId: curXNXQId, XM:name });
    }
    if (res?.status === 'ok') {
      setDataSource(res?.data?.rows)
    }
  }

  useEffect(() => {
    if (curXNXQId) {
      // inputVal.current.value=undefined;
      getDataSource();
    }
  }, [key, curXNXQId]);

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
      }
    })();
  }, []);

  // console.log('XM', XM);



  return (
    <PageContainer>
      <Form layout='inline' style={{ padding: '0 0 24px' }}>
        <Form.Item label='所属学年学期:'>
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
        </Form.Item>
        <Form.Item>
          <Search
              ref={inputVal}
              placeholder="姓名"
              allowClear onSearch={(value)=>{getDataSource(value)}} style={{ width: 200 }} />
        </Form.Item>
      </Form>
      {/* <div >
        <span>
          所属学年学期：
          
        </span>
        <span>
          
        </span>
      </div> */}
      <Tabs
        onChange={(value) => { 
          setKey(value); 
          // console.log('inputVal',inputVal.current);
          inputVal.current?.setValue('');
      }} defaultActiveKey={key}>
        <TabPane tab="教师考勤统计" key="1">
          <Table TableList={{ position: '老师' }} dataSource={dataSource} columns={teacher} />
        </TabPane>

        <TabPane tab="学生考勤统计" key="2">
          <Table TableList={{ position: '学生' }} dataSource={dataSource} columns={student} />
        </TabPane>
      </Tabs>

    </PageContainer>
  )
}
export default LeaveManagement

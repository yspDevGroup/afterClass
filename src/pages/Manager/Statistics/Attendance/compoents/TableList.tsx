import { getTableWidth } from '@/utils/utils';
import ProTable from '@ant-design/pro-table';
// import type { ProColumns } from '@ant-design/pro-table';
// import { useEffect, useState } from 'react';
// import { queryXNXQList } from '@/services/local-services/xnxq';
// import { useModel, Link } from 'umi';
// import { Select } from 'antd';
// import { getTeachers, getStudents } from '@/services/after-class/reports';
// import WWOpenDataCom from '@/components/WWOpenDataCom';

// const { Option } = Select;

const Table = (props: any) => {
  const {dataSource, columns } = props;
  // const { TableList } = props;
  // const { initialState } = useModel('@@initialState');
  // const { currentUser } = initialState || {};
  // // 选择学年学期
  // const [curXNXQId, setCurXNXQId] = useState<any>();
  // // 学年学期列表数据
  // const [termList, setTermList] = useState<any>();
  // const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  // const [studentData, setStudent] = useState<API.KHXSDD[] | undefined>([]);
  // useEffect(() => {
  //   // 获取学年学期数据的获取
  //   (async () => {
  //     const res = await queryXNXQList(currentUser?.xxId);
  //     // 获取到的整个列表的信息
  //     const newData = res.xnxqList;
  //     const curTerm = res.current;
  //     if (newData?.length) {
  //       if (curTerm) {
  //         setCurXNXQId(curTerm.id);
  //         setTermList(newData);
  //       }
  //     }
  //   })();
  // }, []);
  // useEffect(() => {
  //   // 教师列表
  //   (async () => {
  //     const res = await getTeachers({ XNXQId: curXNXQId });
  //     if (res.status === 'ok') {
  //       setDataSource(res?.data?.rows);
  //     }
  //   })();
  //   // 学生列表
  //   (async () => {
  //     const res2 = await getStudents({ XNXQId: curXNXQId });
  //     if (res2.status === 'ok') {
  //       setStudent(res2?.data?.rows);
  //     }
  //   })();
  // }, [curXNXQId]);
  // const teacher: ProColumns<any>[] = [
  //   {
  //     title: '序号',
  //     dataIndex: 'index',
  //     valueType: 'index',
  //     align: 'center',
  //     width: 58,
  //     fixed: 'left',
  //   },
  //   {
  //     title: '姓名',
  //     dataIndex: 'XM',
  //     key: 'XM',
  //     align: 'center',
  //     fixed: 'left',
  //     width: 100,
  //     render: (_, record) => {
  //       const showWXName = record?.JZGJBSJ?.XM === '未知' && record?.JZGJBSJ?.WechatUserId;
  //       if (showWXName) {
  //         return <WWOpenDataCom type="userName" openid={record?.JZGJBSJ.WechatUserId} />;
  //       }
  //       return record?.JZGJBSJ?.XM;
  //     },
  //   },
  //   {
  //     title: '授课班级数',
  //     dataIndex: 'BJS',
  //     key: 'BJS',
  //     align: 'center',
  //     width: 110,
  //   },
  //   {
  //     title: '授课总课时数',
  //     dataIndex: 'KSS',
  //     key: 'KSS',
  //     width: 120,
  //     align: 'center',
  //   },
  //   {
  //     title: '出勤次数',
  //     dataIndex: 'CQS',
  //     key: 'CQS',
  //     align: 'center',
  //     width: 100,
  //   },
  //   {
  //     title: '缺勤次数',
  //     dataIndex: 'QQS',
  //     key: 'QQS',
  //     align: 'center',
  //     width: 100,
  //   },
  //   {
  //     title: '出勤总时长(小时)',
  //     dataIndex: 'KSSC',
  //     key: 'KSSC',
  //     align: 'center',
  //     width: 120,
  //   },
  //   {
  //     title: '操作',
  //     dataIndex: 'operation',
  //     key: 'operation',
  //     align: 'center',
  //     width: 100,
  //     fixed: 'right',
  //     render: (_, record) => (
  //       <>
  //         <Link
  //           to={{
  //             pathname: '/statistics/attendance/detail',
  //             state: {
  //               type: 'detail',
  //               data: record,
  //               XNXQId: curXNXQId,
  //               position: TableList.position,
  //             },
  //           }}
  //         >
  //           详情
  //         </Link>
  //       </>
  //     ),
  //   },
  // ];
  // const student: ProColumns<any>[] = [
  //   {
  //     title: '序号',
  //     dataIndex: 'index',
  //     valueType: 'index',
  //     align: 'center',
  //     width: 58,
  //     fixed: 'left'
  //   },
  //   {
  //     title: '姓名',
  //     dataIndex: 'XM',
  //     key: 'XM',
  //     align: 'center',
  //     fixed: 'left',
  //     width: 100,
  //     render: (_text: any, record: any) => {
  //       const showWXName = record?.XSJBSJ?.XM === '未知' && record?.XSJBSJ?.WechatUserId;
  //       if (showWXName) {
  //         return <WWOpenDataCom type="userName" openid={record?.XSJBSJ.WechatUserId} />;
  //       }
  //       return record?.XSJBSJ?.XM;
  //     },
  //   },
  //   {
  //     title: '行政班名称',
  //     dataIndex: 'XZBJSJ',
  //     key: 'XZBJSJ',
  //     align: 'center',
  //     width: 120,
  //     ellipsis: true,
  //     render: (_text: any, record: any) => {
  //       return `${record?.XSJBSJ?.BJSJ?.NJSJ?.NJMC}${record?.XSJBSJ?.BJSJ?.BJ}`;
  //     },
  //   },
  //   {
  //     title: '报名课程班数',
  //     dataIndex: 'BJS',
  //     key: 'BJS',
  //     align: 'center',
  //     width: 120,
  //   },
  //   {
  //     title: '出勤次数',
  //     dataIndex: 'CQS',
  //     key: 'CQS',
  //     align: 'center',
  //     width: 100,
  //   },
  //   {
  //     title: '缺勤次数',
  //     dataIndex: 'QQS',
  //     key: 'QQS',
  //     align: 'center',
  //     width: 100,
  //   },
  //   {
  //     title: '课时总时长(小时)',
  //     dataIndex: 'KSSC',
  //     key: 'KSSC',
  //     align: 'center',
  //     width: 120,
  //   },
  //   {
  //     title: '操作',
  //     dataIndex: 'operation',
  //     key: 'operation',
  //     fixed: 'right',
  //     align: 'center',
  //     width: 100,
  //     render: (_, record) => (
  //       <>
  //         <Link
  //           to={{
  //             pathname: '/statistics/attendance/detail',
  //             state: {
  //               type: 'detail',
  //               data: record,
  //               XNXQId: curXNXQId,
  //               position: TableList.position,
  //             },
  //           }}
  //         >
  //           详情
  //         </Link>
  //       </>
  //     ),
  //   },
  // ];

  return (
    <>
      {/*
       <div style={{ padding: '0 0 24px' }}>
        <span>
          所属学年学期：
          <Select
            value={curXNXQId}
            style={{ width: 160 }}
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
       */}
      <ProTable
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          defaultCurrent: 1,
        }}
        scroll={{ x: getTableWidth(columns) }}
        columns={ columns}
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        dataSource={dataSource }
        search={false}
      />
    </>
  );
};
export default Table;

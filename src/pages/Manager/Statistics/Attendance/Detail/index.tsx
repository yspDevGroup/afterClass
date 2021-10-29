import { getTeacherDetail, getStudentDetail } from '@/services/after-class/reports'
import { useEffect, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import PageContainer from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import WWOpenDataCom from '@/components/WWOpenDataCom';

const AttendanceDetail = (props: any) => {
  const { data, XNXQId, position } = props.location.state;
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  useEffect(() => {
    if (position === '老师') {
      (async () => {
        const res = await getTeacherDetail({ JZGJBSJId: data.JZGJBSJId, XNXQId })
        if (res.status === 'ok') {
          setDataSource(res.data)
        }
      })()
    } else {
      (async () => {
        const res = await getStudentDetail({ XSJBSJId: data.XSJBSJId, XNXQId })
        if (res.status === 'ok') {
          setDataSource(res.data)
        }
      })()
    }
  }, [])
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
      width: 100,
      fixed: 'left',
      render: (_, record) => {
        const showWXName = data?.JZGJBSJ?.XM === '未知' && data?.JZGJBSJ?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={data?.JZGJBSJ?.WechatUserId} />;
        }
        return data?.JZGJBSJ?.XM;
      },
    },
    {
      title: '课程名称',
      dataIndex: 'KHKCSJ',
      key: 'KHKCSJ',
      width: 120,
      align: 'center',
      render: (text: any) => <div>{text?.KCMC}</div>
    },
    {
      title: '课程班名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      width: 120,
      align: 'center',
    },
    {
      title: '授课总课时数',
      dataIndex: 'KSS',
      key: 'KSS',
      width: 130,
      align: 'center',
    },
    {
      title: '出勤次数',
      dataIndex: 'cq_count',
      key: 'cq_count',
      width: 100,
      align: 'center',
    },
    {
      title: '缺勤次数',
      dataIndex: 'qq_count',
      key: 'qq_count',
      width: 100,
      align: 'center',
    },
    {
      title: '课时总时长(小时)',
      dataIndex: 'KSSC',
      key: 'KSSC',
      width: 120,
      align: 'center',
    },
  ]
  const student: ProColumns<any>[] = [
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
      width: 100,
      fixed: 'left',
      align: 'center',
      render: () => {
        const showWXName = data?.XSJBSJ?.XM === '未知' && data?.XSJBSJ?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={data?.XSJBSJ.WechatUserId} />;
        }
        return <div>{data?.XSJBSJ?.XM}</div>
      },
    },
    {
      title: '课程班名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      width: 120,
    },
    {
      title: '课程名称',
      dataIndex: 'KHKCSJ',
      key: 'KHKCSJ',
      align: 'center',
      width: 120,
      render: (text: any) => <div>{text?.KCMC}</div>
    },
    {
      title: '出勤次数',
      dataIndex: 'cq_count',
      key: 'cq_count',
      align: 'center',
      width: 100,
    },
    {
      title: '缺勤次数',
      dataIndex: 'qq_count',
      key: 'qq_count',
      align: 'center',
      width: 100,
    },
    {
      title: '课时总时长(小时)',
      dataIndex: 'KSSC',
      key: 'KSSC',
      align: 'center',
      width: 150,
    },
  ]

  return (
    <div>
      <PageContainer>
        <Button
          type="primary"
          onClick={() => {
            history.go(-1);
          }}
          style={{
            marginBottom: '24px',
          }}
        >
          <LeftOutlined />
          返回上一页
        </Button>
        <ProTable
          columns={position === '老师' ? teacher : student}
          dataSource={dataSource}
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          scroll={{ x: 1000 }}
          search={false}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
        />
      </PageContainer>
    </div>
  )
}
export default AttendanceDetail

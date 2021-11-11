import {
  getTeacherAttendanceDetailByDate,
  getStudentAttendanceDetailByDate,
  exportTeacherAttendanceDetailByDate,
  exportStudentAttendanceDetailByDate,
} from '@/services/after-class/reports';
import { useEffect, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import PageContainer from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal, Spin } from 'antd';
import { DownloadOutlined, LeftOutlined } from '@ant-design/icons';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { getAllKHJSCQ } from '@/services/after-class/khjscq';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';

const AttendanceDetail = (props: any) => {
  const { data, XNXQId, position, startDate, endDate, duration } = props.location.state;
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  const [absenteeismData, setAbsenteeismData] = useState<any>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getAbsenteeismData = async (id: string) => {
    let res;
    if (position === '老师') {
      res = await getAllKHJSCQ({
        JZGJBSJId: data?.id,
        KHBJSJId: id,
        CQZT: ['缺席', '代课', '请假'],
        startDate,
        endDate,
      });
    } else {
      res = await getAllKHXSCQ({
        xsId: data?.id,
        bjId: id,
        CQZT: ['请假', '缺席'],
        startDate: startDate,
        endDate: endDate,
      });
    }
    if (res?.status === 'ok') {
      setAbsenteeismData(res.data);
      setVisible(true);
    }
  };
  useEffect(() => {
    setLoading(true);
    if (position === '老师') {
      (async () => {
        const res = await getTeacherAttendanceDetailByDate({
          JZGJBSJId: data.id,
          XNXQId,
          startDate,
          endDate,
        });
        if (res.status === 'ok') {
          setDataSource(res.data.rows);
          setLoading(false);
        }
      })();
    } else {
      (async () => {
        const res = await getStudentAttendanceDetailByDate({
          XSJBSJId: data.id,
          XNXQId,
          startDate,
          endDate,
        });
        if (res.status === 'ok') {
          setDataSource(res.data.rows);
          setLoading(false);
        }
      })();
    }
  }, []);
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
      render: () => {
        const showWXName = data?.XM === '未知' && data?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={data?.WechatUserId} />;
        }
        return data?.XM;
      },
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      width: 120,
      align: 'center',
      // render: (text: any) => <div>{text?.KCMC}</div>
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
      dataIndex: 'attendance',
      key: 'attendance',
      width: 100,
      align: 'center',
    },
    {
      title: '缺勤次数',
      dataIndex: 'absenteeism',
      key: 'absenteeism',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => {
            if (Number(record.absenteeism) + Number(record.leave) + Number(record.substitute) !== 0)
              getAbsenteeismData(record.id);
          }}
        >
          {Number(record.absenteeism) + Number(record.leave) + Number(record.substitute)}
        </Button>
      ),
    },
    {
      title: '课时总时长(小时)',
      dataIndex: 'KSS',
      key: 'KSS',
      width: 120,
      align: 'center',
      render: (text, record) => {
        if (record.KSS !== '0' && duration) {
          return ((Number(record.KSS) * duration) / 60).toFixed(2);
        }
        return '0';
      },
    },
  ];
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
        const showWXName = data?.XM === '未知' && data?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={data?.WechatUserId} />;
        }
        return <div>{data?.XM}</div>;
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
      render: (_, text: any) => <div>{text?.KCMC}</div>,
    },
    {
      title: '出勤次数',
      dataIndex: 'attendance',
      key: 'attendance',
      align: 'center',
      width: 100,
    },
    {
      title: '缺勤次数',
      dataIndex: 'absenteeism',
      key: 'absenteeism',
      align: 'center',
      width: 100,
      render: (text: any, record: any) => (
        <Button
          type="link"
          onClick={() => {
            if (Number(record?.absenteeism) + Number(record?.leave) !== 0) {
              getAbsenteeismData(record.id);
            }
          }}
        >
          {Number(record.absenteeism) + Number(record.leave)}
        </Button>
      ),
    },
    {
      title: '课时总时长(小时)',
      dataIndex: 'KSSC',
      key: 'KSSC',
      align: 'center',
      width: 150,
      render: (text, record) => {
        if (record.attendance !== '0' && duration) {
          return ((Number(record.attendance) * duration) / 60).toFixed(2);
        }
        return '0';
      },
    },
  ];
  const colomns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 58,
    },
    {
      title: '缺勤类型',
      dataIndex: 'CQZT',
      key: 'CQZT',
      align: 'center',
    },
    {
      title: '缺勤日期',
      dataIndex: 'CQRQ',
      key: 'CQRQ',
      align: 'center',
    },
  ];

  const onExportClick = () => {
    setLoading(true);
    if (position === '老师') {
      (async () => {
        const res = await exportTeacherAttendanceDetailByDate({
          JZGJBSJId: data.id,
          XNXQId,
          startDate,
          endDate,
        });
        if (res.status === 'ok') {
          window.location.href= res.data;
          setLoading(false);
        } else {
          message.error(res.message);
          setLoading(false);
        }
      })();
    } else {
      (async () => {
        const res = await exportStudentAttendanceDetailByDate({
          XSJBSJId: data.id,
          XNXQId,
          startDate,
          endDate,
        });
        if (res.status === 'ok') {
          window.location.href= res.data;
          setLoading(false);
        } else {
          message.error(res.message);
          setLoading(false);
        }
      })();
    }
  };

  return (
    <div>
      <PageContainer>
        <Spin spinning={loading}>
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
          <Button style={{float: 'right'}}  icon={<DownloadOutlined />} type="primary" onClick={onExportClick}>
            导出
          </Button>

          <ProTable
            columns={position === '老师' ? teacher : student}
            headerTitle={`${startDate} ~ ${endDate}`}
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
        </Spin>
        <Modal
          title={'缺勤详情'}
          visible={visible}
          onCancel={() => {
            setVisible(false);
          }}
          footer={null}
        >
          <ProTable
            pagination={false}
            options={{
              setting: false,
              fullScreen: false,
              density: false,
              reload: false,
            }}
            search={false}
            columns={colomns}
            dataSource={absenteeismData}
          ></ProTable>
        </Modal>
      </PageContainer>
    </div>
  );
};
export default AttendanceDetail;

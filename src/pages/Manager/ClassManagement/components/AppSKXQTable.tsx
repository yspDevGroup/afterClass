import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type {  ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import styles from '../index.less';
import { getAllKHJSCQ } from '@/services/after-class/khjscq';


type ApplicantPropsType = {
  SKXQData?: any;
};

const ApplicantInfoTable: FC<ApplicantPropsType> = (props) => {
  const { SKXQData } = props;
  const [DataSource, setDataSource] = useState<any>();

  useEffect(() => {
    (
      async () => {
        const res = await getAllKHJSCQ({
          KHBJSJId: SKXQData.id
        })
        if (res.status === 'ok') {
          setDataSource(res.data)
        }
      }
    )()
  }, [])


  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center',
    },
    {
      title: '教师名称',
      dataIndex: 'JZGJBSJ',
      key: 'JZGJBSJ',
      align: 'center',
      width: 160,
      ellipsis: true,
      render: (_text: any, record: any) => {
        const showWXName = record?.JZGJBSJ?.XM === '未知' && record?.JZGJBSJ?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.JZGJBSJ?.WechatUserId} />;
        }
        return record?.JZGJBSJ?.XM;
      },
    },
    {
      title: '上课日期',
      dataIndex: 'CQRQ',
      key: 'CQRQ',
      align: 'center',
      width: 100,
    },
    {
      title: '出勤状态',
      dataIndex: 'CQZT',
      key: 'CQZT',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
  ];



  return (
    <div className={styles.BMdiv}>
      <ProTable
        rowKey="id"
        search={false}
        dataSource={DataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
          defaultCurrent: 1,
          pageSizeOptions: ['5'],
          showQuickJumper: false,
          showSizeChanger: false,
          showTotal: undefined,
        }}
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        headerTitle={`课程班名称：${SKXQData?.BJMC}`}
      />


    </div>
  );
};

export default ApplicantInfoTable;

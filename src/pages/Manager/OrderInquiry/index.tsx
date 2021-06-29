/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Tooltip } from 'antd';

import PageContainer from '@/components/PageContainer';
import { getAllKHXSDD } from '@/services/after-class/khxsdd';
import type { ColumnsType } from 'antd/lib/table';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import WWOpenDataCom from '../ClassManagement/components/WWOpenDataCom';

/**
 *
 * 订单查询页面
 * @return
 */
const OrderInquiry = () => {
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);

  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const res = await getAllKHXSDD({});
      if (res.status === 'ok') {
        setDataSource(res.data);
      }
    })();
  }, []);
  const columns: ColumnsType<API.KHXSDD> | undefined = [
    {
      title: '学年学期',
      dataIndex: 'XNXQ',
      key: 'XNXQ',
      align: 'center',
      render: (text: any, record: any) => {
        const XNXQ = record?.KHBJSJ?.KHKCSJ?.XNXQ;
        return (
          <div>
            {XNXQ?.XN}
            {XNXQ?.XQ}
          </div>
        );
      },
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      render: (text: any, record: any) => {
        return <div>{record?.KHBJSJ?.KHKCSJ?.KCMC}</div>;
      },
    },
    {
      title: '班级',
      dataIndex: 'class',
      key: 'class',
      align: 'center',
      render: (text: any, record: any) => {
        return (
          <div className="ui-table-col-elp">
            <Tooltip title={record?.KHBJSJ?.NJSName} arrowPointAtCenter>
              {record?.KHBJSJ?.NJSName?.split(',')?.map((item: any) => {
                return <Tag>{item}</Tag>;
              })}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: '学生姓名',
      dataIndex: 'XSId',
      key: 'XSId',
      align: 'center',
      render: (text: string, record: any) => {
        return <WWOpenDataCom type="userName" openid={text} />;
      },
    },
    {
      title: '订单状态',
      dataIndex: 'DDZT',
      key: 'DDZT',
      align: 'center',
    },
  ];
  return (
    <PageContainer>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowKey={() => Math.random()}
      />
    </PageContainer>
  );
};

export default OrderInquiry;

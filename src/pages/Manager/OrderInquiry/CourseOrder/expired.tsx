/*
 * @description:订单查询页面
 * @author: gxh
 * @Date: 2021-09-23 09:09:58
 * @LastEditTime: 2021-11-18 15:31:24
 * @LastEditors: Sissle Lynn
 */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, message, Select, Spin } from 'antd';
import { exportStudentOrders, getAllKHXSDD } from '@/services/after-class/khxsdd';
import PromptInformation from '@/components/PromptInformation';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import styles from './index.less';
import { useModel } from 'umi';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { DownloadOutlined } from '@ant-design/icons';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';
import CourseSelect from '@/components/Search/CourseSelect';
import ClassSelect from '@/components/Search/ClassSelect';

const { Search } = Input;
const OrderInquiry = (props: any) => {
  const DDZT = props.TabState;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  // 学生姓名选择
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  // 当前学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 当前课程
  const [curKCId, setCurKCId] = useState<any>();
  const [kcmc, setKcmc] = useState<any>();
  // 当前课程班
  const [curBJId, setBJId] = useState<any>();
  const [bjmc, setBjmc] = useState<any>();
  // 控制学期学年数据提示框的函数
  const kaiguan = () => {
    setkai(false);
  };
  // 学年学期筛选
  const termChange = (val: string) => {
    setCurXNXQId(val);
  }
  // 课程筛选
  const courseChange = (val: string, data?: any) => {
    setKcmc(data?.children);
    setCurKCId(val);
  }
  // 课程班筛选
  const classChange = (val: string, data?: any) => {
    setBjmc(data?.children);
    setBJId(val);
  }
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);
    })();
  }, []);
  const getData = async () => {
    const resAll = await getAllKHXSDD({
      XNXQId: curXNXQId,
      DDZT: DDZT === '已付款' ? ['已付款', '已退款'] : [DDZT],
      XSXM: name,
      DDLX: 0,
      kcmc,
      KHBJSJId: curBJId,
    });
    if (resAll.status === 'ok') {
      setDataSource(resAll?.data);
    } else {
      setDataSource([]);
    }
  };
  useEffect(() => {
    if (curXNXQId) {
      getData();
    }
  }, [curXNXQId, kcmc, curBJId, name]);
  const onExportClick = () => {
    setLoading(true);
    (async () => {
      const res = await exportStudentOrders({
        XNXQId: curXNXQId,
        DDZT: DDZT === '已付款' ? ['已付款', '已退款'] : [DDZT],
        DDLX: 0,
        kcmc,
        bjmc,
      });
      if (res.status === 'ok' && res.data) {
        window.location.href = res.data;
        setLoading(false);
      } else {
        message.error(res.message);
        setLoading(false);
      }
    })();
  };

  const columns: ProColumns<API.KHXSDD>[] | undefined = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 58,
      fixed: 'left',
    },
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      width: 100,
      fixed: 'left',
      render: (_text: any, record: any) => {
        const showWXName = record?.XSJBSJ?.XM === '未知' && record?.XSJBSJ?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.XSJBSJ.WechatUserId} />;
        }
        return record?.XSJBSJ?.XM;
      },
    },
    {
      title: '订单编号',
      dataIndex: 'DDBH',
      key: 'DDBH',
      align: 'center',
      ellipsis: true,
      width: 180,
    },
    {
      title: '行政班名称',
      dataIndex: 'XZBJSJ',
      key: 'XZBJSJ',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSJBSJ?.BJSJ?.NJSJ?.NJMC}${record?.XSJBSJ?.BJSJ?.BJ}`;
      },
    },
    {
      title: '课程班名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      ellipsis: true,
      width: 140,
      render: (_text: any, record: any) => {
        return <div>{record?.KHBJSJ?.BJMC}</div>;
      },
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      ellipsis: true,
      width: 160,
      render: (_text: any, record: any) => {
        return <div>{record?.KHBJSJ?.KHKCSJ?.KCMC}</div>;
      },
    },
    {
      title: '课程费用(元)',
      dataIndex: 'KCFY',
      key: 'KCFY',
      align: 'center',
      width: 110,
      render: (_text: any, record: any) => {
        return <div>{record?.KHBJSJ?.FY}</div>;
      },
    },
    {
      title: '教辅费用(元)',
      dataIndex: 'JCFY',
      key: 'JCFY',
      align: 'center',
      width: 110,
      render: (_text: any, record: any) => {
        return <div>{(Number(record.DDFY) - Number(record?.KHBJSJ?.FY)).toFixed(2)}</div>;
      },
    },
    {
      title: '订单总费用(元)',
      dataIndex: 'DDFY',
      key: 'DDFY',
      align: 'center',
      width: 120,
    },
    {
      title: '下单时间',
      dataIndex: 'XDSJ',
      key: 'XDSJ',
      align: 'center',
      ellipsis: true,
      width: 150,
      render: (_text: any, record: any) => {
        return record.XDSJ?.substring(0, 16);
      },
    },
    {
      title: '付款时间',
      dataIndex: 'ZFSJ',
      key: 'ZFSJ',
      align: 'center',
      ellipsis: true,
      width: 150,
      hideInTable: DDZT !== '已付款',
      render: (_text: any, record: any) => {
        return record.ZFSJ?.substring(0, 16);
      },
    },
    {
      title: '支付方式',
      dataIndex: 'ZFFS',
      key: 'ZFFS',
      align: 'center',
      ellipsis: true,
      width: 150,
      hideInTable: DDZT !== '已付款',
      render: (_text: any, record: any) => {
        return record.ZFFS;
      },
    },
  ];
  return (
    <>
      <div className={styles.tableStyle}>
        <Spin spinning={loading}>
          <ProTable<any>
            actionRef={actionRef}
            columns={columns}
            rowKey="id"
            pagination={{
              showQuickJumper: true,
              pageSize: 10,
              defaultCurrent: 1,
            }}
            scroll={{ x: DDZT !== '已付款' ? 1300 : 1500 }}
            dataSource={dataSource}
            headerTitle={
              <>
                <SearchLayout>
                  <SemesterSelect XXJBSJId={currentUser?.xxId} onChange={termChange} />
                  <CourseSelect XXJBSJId={currentUser?.xxId} onChange={courseChange} />
                  <ClassSelect XNXQId={curXNXQId} KHKCSJId={curKCId} onChange={classChange} />
                  <div>
                    <label htmlFor='student'>学生名称：</label>
                    <Search
                      allowClear
                      onSearch={(val) => {
                        setName(val)
                      }}
                    />
                  </div>
                </SearchLayout>
              </>
            }
            options={{
              setting: false,
              fullScreen: false,
              density: false,
              reload: false,
            }}
            search={false}
            toolBarRender={() => [
              <Button icon={<DownloadOutlined />} type="primary" onClick={onExportClick}>
                导出
              </Button>
            ]}
          />
        </Spin>
      </div>
      <PromptInformation
        text="未查询到学年学期数据，请先设置学年学期"
        link="/basicalSettings/termManagement"
        open={kai}
        colse={kaiguan}
      />
    </>
  );
};

export default OrderInquiry;

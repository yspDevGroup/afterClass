/*
 * @description:
 * @author: gxh
 * @Date: 2021-09-23 09:09:58
 * @LastEditTime: 2021-12-10 13:47:49
 * @LastEditors: zpl
 */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, message, Select, Spin } from 'antd';
import { exportStudentOrders, getAllKHXSDD } from '@/services/after-class/khxsdd';
// import { queryXNXQList } from '@/services/local-services/xnxq';

import styles from './index.less';
import { useModel } from 'umi';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ShowName from '@/components/ShowName';
import { DownloadOutlined } from '@ant-design/icons';
import { getKHXXZZFW } from '@/services/after-class/khxxzzfw';
import { getKHZZFW } from '@/services/after-class/khzzfw';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';

const { Option } = Select;

type selectType = { label: string; value: string };
/**
 *
 * 订单查询页面
 * @return
 */
const { Search } = Input;
const OrderInquiry = (props: any) => {
  const DDZT: string = props.TabState;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  const [curXNXQId, setCurXNXQId] = useState<any>();
  const [name, setName] = useState<string>();
  const [fwlxList, setFwlxList] = useState<API.KHZZFW[]>();
  const [FWLX, setFWLX] = useState<string>();
  const [FWLXId, setFWLXId] = useState<string>();
  const [fwList, setFwList] = useState<API.KHXXZZFW[]>();
  const [FWMC, setFWMC] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  // 学年学期筛选
  const termChange = (val: string) => {
    setCurXNXQId(val);
  };
  useEffect(() => {
    (async () => {
      // 服务类别的获取
      const result = await getKHZZFW({
        XXJBSJId: currentUser?.xxId,
        page: 0,
        pageSize: 0,
      });
      if (result.status === 'ok') {
        setFwlxList(result?.data?.rows);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (curXNXQId) {
        const data = {
          XXJBSJId: currentUser?.xxId,
          XNXQId: curXNXQId || '',
          KHZZFWId: FWLXId,
          FWZT: 1,
          page: 0,
          pageSize: 0,
        };
        const res = await getKHXXZZFW(data);
        if (res.status === 'ok') {
          setFwList(res?.data?.rows);
        }
      }
    })();
  }, [curXNXQId, FWLXId]);
  useEffect(() => {
    (async () => {
      const res = await getAllKHXSDD({
        XXJBSJId: currentUser?.xxId,
        XNXQId: curXNXQId,
        XSXM: name,
        FWMC,
        FWLX,
        // 父传子判断要请求的状态
        DDZT: DDZT === '已付款' ? ['已付款', '已退款'] : [DDZT],
        DDLX: 1,
      });
      if (res.status === 'ok') {
        setDataSource(res.data);
      }
    })();
  }, [curXNXQId, name, FWMC, FWLX]);
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
      render: (_text: any, record: any) => (
        <ShowName type="userName" openid={record?.XSJBSJ.WechatUserId} XM={record?.XSJBSJ?.XM} />
      ),
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
      dataIndex: 'XSJBSJ',
      key: 'XSJBSJ',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSJBSJ?.BJSJ?.NJSJ?.NJMC}${record?.XSJBSJ?.BJSJ?.BJ}`;
      },
    },
    {
      title: '服务名称',
      dataIndex: 'KHXXZZFW',
      key: 'KHXXZZFW',
      align: 'center',
      width: 160,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return <div>{record?.KHXXZZFW.FWMC}</div>;
      },
    },
    {
      title: '服务类型',
      dataIndex: 'KHZZFW',
      key: 'KHZZFW',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return <div>{record?.KHXXZZFW.KHZZFW.FWMC}</div>;
      },
    },
    {
      title: '订单费用(元)',
      dataIndex: 'DDFY',
      key: 'DDFY',
      align: 'center',
      width: 110,
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
      hideInTable: DDZT !== '已付款',
      ellipsis: true,
      width: 150,
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
      render: (_text: any, record: any) => {
        return record.ZFFS?.substring(0, 16);
      },
    },
  ];
  const onExportClick = () => {
    setLoading(true);
    (async () => {
      const res = await exportStudentOrders({
        XNXQId: curXNXQId,
        XSXM: name,
        // 父传子判断要请求的状态
        DDZT: DDZT === '已付款' ? ['已付款', '已退款'] : [DDZT],
        DDLX: 1,
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
            scroll={{ x: DDZT !== '已付款' ? 1000 : 1300 }}
            dataSource={dataSource}
            headerTitle={
              <>
                <SearchLayout>
                  <SemesterSelect XXJBSJId={currentUser?.xxId} onChange={termChange} />
                  <div>
                    <label htmlFor="type">服务类别：</label>
                    <Select
                      style={{ width: 160 }}
                      allowClear
                      value={FWLX}
                      onChange={(value: string, option: any) => {
                        setFWLX(value);
                        setFWLXId(option?.key);
                        setFWMC(undefined);
                      }}
                    >
                      {fwlxList?.map((item: API.KHZZFW) => {
                        return (
                          <Option key={item.id} value={item.FWMC!}>
                            {item.FWMC}
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="name">服务名称：</label>
                    <Select
                      value={FWMC}
                      style={{ width: 160 }}
                      allowClear
                      onChange={(value: string) => {
                        setFWMC(value);
                      }}
                    >
                      {fwList?.map((item: API.KHXXZZFW) => {
                        return (
                          <Option key={item.FWMC} value={item.FWMC!}>
                            {item.FWMC}
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="student">学生名称：</label>
                    <Search
                      allowClear
                      style={{ width: 160 }}
                      onSearch={(val) => {
                        setName(val);
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
              </Button>,
            ]}
          />
        </Spin>
      </div>
    </>
  );
};

export default OrderInquiry;

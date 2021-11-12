/*
 * @description:
 * @author: gxh
 * @Date: 2021-09-23 09:09:58
 * @LastEditTime: 2021-11-12 13:32:39
 * @LastEditors: Sissle Lynn
 */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, message, Select, Spin } from 'antd';
import { exportStudentOrders, getAllKHXSDD } from '@/services/after-class/khxsdd';
import { queryXNXQList } from '@/services/local-services/xnxq';

import styles from './index.less';
import { useModel } from 'umi';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { DownloadOutlined } from '@ant-design/icons';

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
  const [termList, setTermList] = useState<any>();
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      // 学年学期数据的获取
      const res = await queryXNXQList(currentUser?.xxId);
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          // 默认续期
          setCurXNXQId(curTerm.id);
          // 学期列表
          setTermList(newData);
        }
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const res = await getAllKHXSDD({
        XNXQId: curXNXQId,
        XSXM: name,
        // 父传子判断要请求的状态
        DDZT: DDZT === '已付款' ? ['已付款', '已退款'] : [DDZT],
        DDLX: 1
      })
      if (res.status === 'ok') {
        setDataSource(res.data)
      }
    })()
  }, [curXNXQId, name])
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
      }
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
        return `${record?.XSJBSJ?.BJSJ?.NJSJ?.NJMC}${record?.XSJBSJ?.BJSJ?.BJ}`
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
        DDLX: 1
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
      <div className={styles.searchs}>
        <div>
          <span>
            所属学年学期：
            <Select
              value={curXNXQId}
              style={{ width: 160 }}
              onChange={(value: string) => {
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
          <span>学生名称：</span>
          <div>
            <Search
              allowClear
              style={{ width: 160 }}
              onSearch={(val) => {
                setName(val)
              }}
            />
          </div>
        </div>
        <span style={{ marginLeft: 'auto' }}>
          <Button icon={<DownloadOutlined />} type="primary" onClick={onExportClick}>
            导出
          </Button>
        </span>
      </div>
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
            options={{
              setting: false,
              fullScreen: false,
              density: false,
              reload: false,
            }}
            search={false}
          />
        </Spin>
      </div>
    </>
  );
};

export default OrderInquiry;

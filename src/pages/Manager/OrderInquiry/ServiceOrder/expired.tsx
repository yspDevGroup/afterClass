/*
 * @description:
 * @author: gxh
 * @Date: 2021-09-23 09:09:58
 * @LastEditTime: 2021-10-15 09:55:56
 * @LastEditors: Sissle Lynn
 */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Select } from 'antd';
import { getAllKHXSDD } from '@/services/after-class/khxsdd';
import { queryXNXQList } from '@/services/local-services/xnxq';

import styles from './index.less';
import { useModel } from 'umi';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

const { Option } = Select;

type selectType = { label: string; value: string };
/**
 *
 * 订单查询页面
 * @return
 */
const OrderInquiry = (props: any) => {
  const DDZT = props.TabState;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  const [curXNXQId, setCurXNXQId] = useState<any>();
  const [termList, setTermList] = useState<any>();
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
      } else {
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const res = await getAllKHXSDD({
        XNXQId: curXNXQId,
        // 父传子判断要请求的状态
        DDZT,
        DDLX: 1
      })
      if (res.status === 'ok') {
        setDataSource(res.data)
      }
    })()
  }, [curXNXQId])
  const columns: ProColumns<API.KHXSDD>[] | undefined = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: '订单编号',
      dataIndex: 'DDBH',
      key: 'DDBH',
      align: 'center',
      ellipsis: true,
      width: 160,
    },
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      width: 100,
      render:(_text: any, record: any)=>{
        return record?.XSJBSJ?.XM
      }
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
      render: (text: any) => {
        return <div>{text?.FWMC}</div>;
      },
    },
    {
      title: '订单费用(元)',
      dataIndex: 'DDFY',
      key: 'DDFY',
      align: 'center',
      width: 100,
    },
    {
      title: '下单时间',
      dataIndex: 'XDSJ',
      key: 'XDSJ',
      align: 'center',
      ellipsis: true,
      width: 150,
      render: (_text: any, record: any) => {
        return record.XDSJ?.substring(0,16);
      },
    },
    {
      title: '付款时间',
      dataIndex: 'ZFSJ',
      key: 'ZFSJ',
      align: 'center',
      hideInTable: DDZT!=='已付款',
      ellipsis: true,
      width: 150,
      render: (_text: any, record: any) => {
        return record.ZFSJ?.substring(0,16);
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
        return record.ZFFS?.substring(0,16);
      },
    },
  ];
  return (
    <>
      <div className={styles.searchs}>
        <div>
          <span>
            所属学年学期：
            <Select
              value={curXNXQId}
              style={{ width: 200 }}
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
        {/* <div>
          <span>服务名称：</span>
          <div>
            <Select
              style={{ width: 200 }}
              value={SeverData}
              allowClear
              placeholder="请选择"
              onChange={onKcmcChange}
            >
              {SeverData?.map((item: selectType) => {
                return (
                  <Option value={item.label} key={item.value}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div> */}
      </div>
      <div className={styles.tableStyle}>
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          dataSource={dataSource}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          search={false}
        />
      </div>
    </>
  );
};

export default OrderInquiry;

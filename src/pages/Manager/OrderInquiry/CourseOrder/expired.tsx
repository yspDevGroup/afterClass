/*
 * @description:
 * @author: gxh
 * @Date: 2021-09-23 09:09:58
 * @LastEditTime: 2021-10-12 17:56:11
 * @LastEditors: Sissle Lynn
 */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Select } from 'antd';
import { getAllKHXSDD } from '@/services/after-class/khxsdd';
import { getAllKHKCSJ } from '@/services/after-class/khkcsj';
import { getAllKHBJSJ } from '@/services/after-class/khbjsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import PromptInformation from '@/components/PromptInformation';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
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
  const [tableLoading, setTableLoading] = useState(true);
  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  const [curXNXQId, setCurXNXQId] = useState<any>();
  const [termList, setTermList] = useState<any>();
  // 课程选择框的数据
  const [kcmcData, setKcmcData] = useState<selectType[] | undefined>([]);
  // 班级名称选择框的数据
  const [bjmcData, setBjmcData] = useState<selectType[] | undefined>([]);
  const [kcmcValue, setKcmcValue] = useState<any>();
  const [bjmcValue, setBjmcValue] = useState<any>();
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
      // 学年学期数据的获取
      const res = await queryXNXQList(currentUser?.xxId);
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          setCurXNXQId(curTerm.id);
          setTermList(newData);
        }
      } else {
        setkai(true);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (curXNXQId) {
        // 获取订单查询的表格数据
        const resl = await getAllKHXSDD({
          XNXQId: curXNXQId,
          //父传子判断要请求的状态
          DDZT,
          DDLX: 0
        });
        if (resl.status === 'ok') {
          setTableLoading(false);
          setDataSource(resl.data);
          setKcmcValue(undefined);
          setBjmcValue(undefined);
        }

        // 通过课程数据接口拿到所有的课程
        const khkcResl = await getAllKHKCSJ({
          isRequired: false,
          XNXQId: curXNXQId,
          XXJBSJId: currentUser?.xxId,
          page: 0,
          pageSize: 0,
        });
        if (khkcResl.status === 'ok') {
          const KCMC = khkcResl.data.rows?.map((item: any) => ({
            label: item.KCMC,
            value: item.id,
          }));
          setKcmcData(KCMC);
        }

        // 通过班级数据接口拿到所有的班级
        const bjmcResl = await getAllKHBJSJ({ XNXQId: curXNXQId, page: 0, pageSize: 0, name: '' });
        if (bjmcResl.status === 'ok') {
          const BJMC = bjmcResl.data?.rows?.map((item: any) => ({
            label: item.BJMC,
            value: item.BJMC,
          }));
          setBjmcData(BJMC);
        }
      }
    })();
  }, [curXNXQId]);
  const columns: ProColumns<API.KHXSDD>[] | undefined = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      render:(_text: any, record: any)=>{
        return record?.XSJBSJ?.XM
      }
    },
    {
      title: '班级',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      render: (_text: any, record: any) => {
        return <div>{record?.KHBJSJ?.BJMC}</div>;
      },
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      render: (_text: any, record: any) => {
        return <div>{record?.KHBJSJ?.KHKCSJ?.KCMC}</div>;
      },
    },
    {
      title: '下单时间',
      dataIndex: 'XDSJ',
      key: 'XDSJ',
      align: 'center',
    },
    {
      title: '付款时间',
      dataIndex: 'ZFSJ',
      key: 'ZFSJ',
      align: 'center',
    },
    {
      title: '订单费用(元)',
      dataIndex: 'DDFY',
      key: 'DDFY',
      align: 'center',
    },
    {
      title: '订单状态',
      dataIndex: 'DDZT',
      key: 'DDZT',
      align: 'center',
    },
  ];

  // 控制学期学年数据提示框的函数
  const kaiguan = () => {
    setkai(false);
  };
  const onKcmcChange = async (value: any, key: any) => {
    setTableLoading(true);
    setBjmcValue('');
    setKcmcValue(value);
    const bjmcResl = await getAllKHBJSJ({
      XNXQId: curXNXQId,
      kcId: key?.key || '',
      page: 0,
      pageSize: 0,
      name: '',
    });
    if (bjmcResl.status === 'ok') {
      const BJMC = bjmcResl.data?.rows?.map((item: any) => ({
        label: item.BJMC,
        value: item.BJMC,
      }));
      setBjmcData(BJMC);
    }

    // 获取订单查询的表格数据
    const resl = await getAllKHXSDD({
      XNXQId: curXNXQId,
      kcmc: value,
      DDZT
    });
    if (resl.status === 'ok') {
      console.log(resl.data);

      setTableLoading(false);
      setDataSource(resl.data);
    }
  };

  const onBjmcChange = async (value: any) => {
    setTableLoading(true);
    setBjmcValue(value);

    // 获取订单查询的表格数据
    const resl = await getAllKHXSDD({
      XNXQId: curXNXQId,
      bjmc: value,
      DDZT
    });
    if (resl.status === 'ok') {
      setTableLoading(false);
      setDataSource(resl.data);
    }
  };
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
        <div>
          <span>课程名称：</span>
          <div>
            <Select
              style={{ width: 200 }}
              value={kcmcValue}
              allowClear
              placeholder="请选择"
              onChange={onKcmcChange}
            >
              {kcmcData?.map((item: selectType) => {
                return (
                  <Option value={item.label} key={item.value}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
        <div>
          <span>课程班名称：</span>
          <div>
            <Select
              style={{ width: 200 }}
              value={bjmcValue}
              allowClear
              placeholder="请选择"
              onChange={onBjmcChange}
            >
              {bjmcData?.map((item: selectType) => {
                return (
                  <Option value={item.label} key={item.label}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
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
